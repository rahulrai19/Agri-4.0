from __future__ import annotations

from http import HTTPStatus

from flask import Blueprint, jsonify, request

from ..inference.pest_model import get_model

pest_bp = Blueprint("pest", __name__, url_prefix="/api/predict")


@pest_bp.post("/pest")
def predict_pest():
    if "file" not in request.files:
        return jsonify(error="Missing 'file' in multipart form-data"), HTTPStatus.BAD_REQUEST

    file = request.files["file"]
    if file.filename == "":
        return jsonify(error="Empty filename"), HTTPStatus.BAD_REQUEST

    image_bytes = file.read()
    model = get_model()
    label, confidence, probabilities = model.predict_image(image_bytes)

    return jsonify(
        {
            "label": label,
            "confidence": confidence,
            # "probabilities": probabilities,
            # "classes": model.classes,
        }
    )


