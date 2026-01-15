from __future__ import annotations

import io
from pathlib import Path
from typing import List, Optional, Tuple, Union

import torch
from PIL import Image
from torchvision import models, transforms

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = next((p for p in [MODELS_DIR / "resnet50_0.497.pkl", MODELS_DIR / "resnet.pkl"] if p.exists()), None)
CLASSES_PATH = MODELS_DIR / "classes.txt"


_transform = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)


class _PestModelSingleton:
    _instance: Optional["_PestModelSingleton"] = None

    def __init__(self) -> None:
        if MODEL_PATH is None:
            raise FileNotFoundError("No pest model file found in backend/models (expected resnet50_0.497.pkl or resnet.pkl)")

        self.device = torch.device("cpu")
        self.classes: List[str] = self._load_classes(CLASSES_PATH)
        self.model: torch.nn.Module = self._load_model(MODEL_PATH, num_classes=len(self.classes))
        self.model.eval()
        self.model.to(self.device)

    @classmethod
    def get(cls) -> "_PestModelSingleton":
        if cls._instance is None:
            cls._instance = _PestModelSingleton()
        return cls._instance

    @staticmethod
    def _load_classes(path: Path) -> List[str]:
        if not path.exists():
            raise FileNotFoundError(f"Classes file not found: {path}")
        with path.open("r", encoding="utf-8") as f:
            classes = [line.strip() for line in f if line.strip()]
        if not classes:
            raise ValueError("Classes file is empty")
        return classes

    @staticmethod
    def _build_resnet50(num_classes: int) -> torch.nn.Module:
        model = models.resnet50(weights=None)
        in_features = model.fc.in_features
        model.fc = torch.nn.Linear(in_features, num_classes)
        return model

    def _load_model(self, path: Path, num_classes: int) -> torch.nn.Module:
        # Try loading as a full Torch model first
        try:
            loaded = torch.load(path, map_location=self.device)
            if isinstance(loaded, torch.nn.Module):
                return loaded
            if isinstance(loaded, dict) and "state_dict" in loaded:
                state_dict = loaded["state_dict"]
            elif isinstance(loaded, dict):
                state_dict = loaded
            else:
                raise ValueError("Unsupported model serialization format")

            model = self._build_resnet50(num_classes=num_classes)
            missing, unexpected = model.load_state_dict(state_dict, strict=False)
            if unexpected:
                # Best-effort load; still usable if backbone matches
                pass
            return model
        except Exception as exc:
            raise RuntimeError(f"Failed to load model from {path}: {exc}") from exc

    def predict_image(self, img: Union[Image.Image, bytes]) -> Tuple[str, float, List[float]]:
        if isinstance(img, bytes):
            img = Image.open(io.BytesIO(img)).convert("RGB")
        else:
            img = img.convert("RGB")

        tensor = _transform(img).unsqueeze(0).to(self.device)
        with torch.inference_mode():
            logits = self.model(tensor)
            probs = torch.softmax(logits, dim=1).squeeze(0)

        conf, idx = torch.max(probs, dim=0)
        class_name = self.classes[int(idx)]
        return class_name, float(conf), probs.cpu().tolist()


def get_model() -> _PestModelSingleton:
    return _PestModelSingleton.get()


