# routes/crop.py
from flask import Blueprint, request, jsonify
from backend.inference.crop_model import predict_crop_health

crop_bp = Blueprint("crop", __name__, url_prefix="/api/predict")

@crop_bp.route("/crop", methods=["POST"])
def crop_predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img_bytes = file.read()

    try:
        result = predict_crop_health(img_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
