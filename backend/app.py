from flask import Flask, jsonify
from pathlib import Path

def create_app() -> Flask:
    app = Flask(__name__)

    @app.get("/health")
    def health_check():
        return jsonify(status="ok"), 200

    return app

if __name__ == "__main__":
    # Ensure expected directories exist at runtime (no-ops if already present)
    for p in [
        Path("models"),
        Path("routes"),
        Path("static"),
    ]:
        p.mkdir(parents=True, exist_ok=True)

    app = create_app()
    app.run(host="0.0.0.0", port=8000, debug=True)


