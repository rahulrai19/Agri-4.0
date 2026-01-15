from flask import Blueprint, request, jsonify
from backend.database import db
from bson.objectid import ObjectId
import datetime

market_bp = Blueprint("market", __name__)

@market_bp.route("/api/market", methods=["GET"])
def get_items():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        # Filter by category if provided
        category = request.args.get("category")
        search_query = request.args.get("search")

        query = {}
        if category and category != "All":
            query["category"] = category
        
        if search_query:
            query["name"] = {"$regex": search_query, "$options": "i"}
        
        items = list(db.market.find(query))
        
        # Convert ObjectId to string for JSON serialization
        for item in items:
            item["_id"] = str(item["_id"])
            
        return jsonify(items), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_bp.route("/api/market", methods=["POST"])
def create_item():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ["name", "price", "category", "image"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        new_item = {
            "name": data["name"],
            "company": data.get("company", "Unknown"),
            "price": data["price"],
            "category": data["category"],
            "image": data["image"],
            "description": data.get("description", ""),
            "created_at": datetime.datetime.utcnow()
        }
        
        result = db.market.insert_one(new_item)
        new_item["_id"] = str(result.inserted_id)
        
        return jsonify(new_item), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@market_bp.route("/api/market/<id>", methods=["DELETE"])
def delete_item(id):
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        result = db.market.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Item deleted"}), 200
        else:
            return jsonify({"error": "Item not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
