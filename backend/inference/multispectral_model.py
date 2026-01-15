import os
import tensorflow as tf
import numpy as np

# Build absolute path to models folder safely
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "multispectral_model.h5")

print(" Loading multispectral model from:", MODEL_PATH)

# Load the model
model = tf.keras.models.load_model(MODEL_PATH)
print("Multispectral model loaded successfully!")


# Main inference function
def predict_multispectral(ms_patch):
    """
    ms_patch should be a numpy array of shape (224, 224, 4)
    representing the multispectral bands stacked.
    """

    ms_patch = ms_patch.astype("float32")
    ms_patch = np.expand_dims(ms_patch, axis=0)  # (1,224,224,4)

    pred = model.predict(ms_patch)
    class_idx = int(np.argmax(pred))

    classes = ["Healthy", "Medium", "Stressed", "Diseased"]

    return {
        "class": classes[class_idx],
        "confidence": float(pred[0][class_idx])
    }
