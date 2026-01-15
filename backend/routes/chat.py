from flask import Blueprint, request, jsonify
import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/api/chat', methods=['POST'])
def chat_assistant():
    """
    General AI Assistant endpoint using OpenAI.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return jsonify({"error": "OPENAI_API_KEY not found"}), 503

    try:
        data = request.get_json() or {}
        user_message = data.get('message', '')
        history = data.get('history', [])

        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        language = data.get('language', 'English')
        
        # System Prompt
        system_prompt = f"""You are the 'Agri 4.0 Assistant', an expert AI prepared to help farmers and agriculturalists. 
        You are knowledgeable about crops, pests, diseases, fertilizers, weather, and general farming practices.
        
        IMPORTANT INSTRUCTION:
        You MUST provide your response in {language} language.
        Even if the user speaks in another language, you must reply in {language}.
        
        Guidelines:
        - Be helpful, encouraging, and concise.
        - Use simple language suitable for farmers.
        - If asked about app features, guide them (e.g., "You can use the 'tools' section for calculators").
        - If unsure, advise consulting a local expert.
        """

        messages = [{"role": "system", "content": system_prompt}]
        
        # Add history (limit to last 6 messages to save tokens context)
        for msg in history[-6:]:
            messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
        
        messages.append({"role": "user", "content": user_message})

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500,
        }

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            return jsonify({"error": f"AI Error: {response.text}"}), response.status_code

        response_json = response.json()
        ai_reply = response_json["choices"][0]["message"]["content"]

        return jsonify({"reply": ai_reply})

    except Exception as e:
        print(f"Chat API Error: {e}")
        return jsonify({"error": str(e)}), 500
