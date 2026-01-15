# inference/crop_model.py

import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from io import BytesIO
from PIL import Image

# Load model once (for performance)
model_path = "backend/models/crop_model.h5"
model = tf.keras.models.load_model(model_path)
print("✅ Crop model loaded successfully!")

# Define class labels
class_names = ["Healthy", "Diseased"]

def preprocess_image(img_bytes):
    img = Image.open(BytesIO(img_bytes)).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict_crop_health(img_bytes):
    img_array = preprocess_image(img_bytes)
    prediction = model.predict(img_array)
    class_index = int(prediction[0][0] > 0.5)
    label = class_names[class_index]
    confidence = float(prediction[0][0]) if label == "Diseased" else 1 - float(prediction[0][0])
    return {"class": label, "confidence": round(confidence, 3)}
