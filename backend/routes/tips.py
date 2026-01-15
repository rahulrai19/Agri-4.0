import os
import requests
import json
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

tips_bp = Blueprint('tips', __name__)

@tips_bp.route('/api/tips', methods=['POST'])
def get_cultivation_tips():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
         return jsonify({"error": "OPENAI_API_KEY not configured"}), 500

    data = request.json
    crop_name = data.get('crop_name')
    language = data.get('language', 'English')

    if not crop_name:
        return jsonify({"error": "Crop name is required"}), 400

    # Prompt adapted for OpenAI
    prompt_text = f"""You are an expert agricultural scientist.
    Provide detailed cultivation tips for the crop: '{crop_name}'.
    
    RETURN ONLY JSON in the following format. Ensure all values are in {language} language.
    If {language} is Hindi, use Devanagari script.

    {{
        "soil_climate": "Soil type, pH, and climate requirements.",
        "sowing_planting": "Sowing time, method, spacing, and seed rate.",
        "water_management": "Irrigation schedule and water requirements.",
        "nutrient_management": "Fertilizer requirements (NPK) and organic manure.",
        "pest_disease_mgmt": "Common pests/diseases and their control measures.",
        "harvesting": "Signs of maturity and harvesting method."
    }}
    """

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert agricultural scientist. Respond only with valid JSON.",
            },
            {"role": "user", "content": prompt_text},
        ],
        "temperature": 0.5,
        "max_tokens": 800,
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
             return jsonify({"error": f"OpenAI API Error: {response.text}"}), response.status_code

        response_json = response.json()
        raw_text = response_json["choices"][0]["message"]["content"]

        # Clean up markdown code fences if present (Standard robust parsing)
        clean_text = raw_text.strip()
        if clean_text.startswith("```"):
            parts = clean_text.split("```", 2)
            if len(parts) > 1:
                clean_text = parts[1]
                if clean_text.startswith("json"):
                    clean_text = clean_text[4:]
            clean_text = clean_text.strip()
        
        return jsonify({
            "success": True, 
            "crop": crop_name,
            "data": clean_text 
        })

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        return jsonify({"error": "Failed to generate tips"}), 500
