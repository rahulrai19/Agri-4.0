from flask import Blueprint, jsonify

multispec_bp = Blueprint("multispec", __name__, url_prefix="/api/predict")

@multispec_bp.route("/multispectral", methods=["GET","POST"]) # only get added for testing purpose
def multispectral_route():
    return jsonify({"message": "Multispectral model active!"}), 200
