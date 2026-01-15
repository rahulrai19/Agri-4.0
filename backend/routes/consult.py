import os
import requests
import json
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

consult_bp = Blueprint('consult', __name__)


@consult_bp.route('/api/consult', methods=['POST'])
def consult_expert():
    """
    AI consultation endpoint using OpenAI Chat Completions API.
    - Uses only pest detection result (label + confidence) as requested.
    - Accepts optional `diagnosis_text` (plain text summary from frontend).
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return jsonify({"error": "OPENAI_API_KEY not found in environment"}), 503

    try:
        data = request.get_json(force=True, silent=True) or {}

        # Preferred: plain text from frontend (already extracted after diagnosis)
        diagnosis_text = data.get("diagnosis_text")

        # Also accept raw pest_data for backward compatibility
        pest_data = data.get("pest_data", {}) or {}
        pest_label = pest_data.get("label", "Unknown")
        pest_conf = pest_data.get("confidence", 0)

        if diagnosis_text:
            # Use the provided text, but keep it focused on pest result
            prompt_body = diagnosis_text
        else:
            # Construct a simple text description from pest_data only
            prompt_body = f"Pest Detection: {pest_label} (Confidence: {pest_conf:.2%})"

        # Language Preference
        language = data.get("language", "English")

        # Final prompt sent to OpenAI
        prompt_text = f"""You are an expert agricultural scientist and plant pathologist.
        
The system has scanned a crop image and detected:
{prompt_body}

Please analyze this likelihood and provide a report in this JSON format.
CRITICAL: The content of all values in the JSON MUST be in {language} language.
If language is Hindi, use Devanagari script (e.g., 'फसल', 'कीट'). Do NOT use Hinglish.

{{
  "crop_analysis": "Identify the crop if possible and comment on its health status.",
  "pest_disease_analysis": "Explain the detected pest/disease (or confirm if healthy).",
  "symptoms": "Visual symptoms to look for.",
  "immediate_action": "The most urgent step the farmer should take.",
  "remedies": [
    {{
      "type": "Chemical",
      "action": "Product names, dosage, and safety instructions."
    }},
    {{
      "type": "Organic/Cultural",
      "action": "Natural methods or farming practices."
    }}
  ],
  "prevention": "How to prevent this in future."
}}

Use simple, encouraging language for farmers.
Return ONLY valid JSON.
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
            "temperature": 0.7,
            "max_tokens": 800,
        }

        print("Sending request to OpenAI API (gpt-4o-mini)...")

        # Simple retry for 429 / 503
        import time

        max_retries = 3
        for attempt in range(max_retries):
            response = requests.post(url, headers=headers, json=payload, timeout=30)

            if response.status_code == 200:
                break

            if response.status_code in (429, 503) and attempt < max_retries - 1:
                sleep_time = 2 * (attempt + 1)
                print(
                    f"OpenAI rate/overload ({response.status_code}). "
                    f"Retrying in {sleep_time}s..."
                )
                time.sleep(sleep_time)
                continue

            # Non‑retriable or final failure
            print(f"OpenAI API Error ({response.status_code}): {response.text}")
            try:
                err_json = response.json()
                err_msg = err_json.get("error", {}).get("message", response.text)
            except Exception:
                err_msg = response.text

            return (
                jsonify(
                    {
                        "error": f"AI API Error: {err_msg}",
                        "status": response.status_code,
                    }
                ),
                response.status_code,
            )

        response_json = response.json()

        # Extract text from OpenAI response
        try:
            raw_text = response_json["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as e:
            print(f"Failed to extract text from OpenAI response: {e}")
            print(f"Full response: {json.dumps(response_json, indent=2)}")
            return (
                jsonify(
                    {
                        "error": "AI response was empty or malformed.",
                        "details": response_json.get("error", response_json),
                    }
                ),
                400,
            )

        # Clean up markdown code fences if present
        clean_text = raw_text.strip()
        if clean_text.startswith("```"):
            parts = clean_text.split("```", 2)
            if len(parts) > 1:
                clean_text = parts[1]
                if clean_text.startswith("json"):
                    clean_text = clean_text[4:]
            clean_text = clean_text.strip()

        return jsonify({"raw": raw_text, "clean": clean_text})

    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500


@consult_bp.route("/api/consult/test", methods=["GET"])
def test_consult_env():
    import sys

    debug_info = {
        "status": "OpenAI API Mode Active",
        "executable": sys.executable,
        "api_configured": bool(os.getenv("OPENAI_API_KEY")),
    }
    return jsonify(debug_info)

