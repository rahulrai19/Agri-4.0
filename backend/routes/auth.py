from flask import Blueprint, request, jsonify
from backend.database import db
import datetime
from bson.objectid import ObjectId

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth/register", methods=["POST"])
def register():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.json
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Missing email or password"}), 400

    email = data["email"]
    
    # Check if user exists
    if db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    new_user = {
        "name": data.get("name", "User"),
        "email": email,
        "password": data["password"], # In production, HASH THIS!
        "role": "farmer",
        "created_at": datetime.datetime.utcnow()
    }

    result = db.users.insert_one(new_user)
    
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": str(result.inserted_id),
            "name": new_user["name"],
            "email": new_user["email"]
        }
    }), 201

@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    if db is None:
        return jsonify({"error": "Database connection failed"}), 500

    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = db.users.find_one({"email": email})

    if not user or user["password"] != password: # In production, check hash
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user.get("role", "farmer")
        }
    }), 200
