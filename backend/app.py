from flask import Flask, jsonify
from pathlib import Path
from flask import send_from_directory

try:
    from flask_cors import CORS
except Exception:
    CORS = None  # type: ignore


def create_app() -> Flask:
    app = Flask(__name__)

    # Enable CORS for frontend (localhost:5173)
    if CORS is not None:
        CORS(
            app,
            resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
        )

    # Register Blueprints
    try:
        # Absolute imports
        from backend.routes.pest import pest_bp
        app.register_blueprint(pest_bp)

        from backend.routes.crop import crop_bp
        app.register_blueprint(crop_bp)

        from backend.routes.multispectral import multispec_bp
        app.register_blueprint(multispec_bp)

        from backend.routes.market import market_bp
        app.register_blueprint(market_bp)

        from backend.routes.auth import auth_bp
        app.register_blueprint(auth_bp)

        from backend.routes.community import community_bp
        app.register_blueprint(community_bp)

        from backend.routes.chat import chat_bp
        app.register_blueprint(chat_bp)

        from backend.routes.tips import tips_bp
        app.register_blueprint(tips_bp)

    except Exception:
        # Fallback to relative imports
        try:
            from .routes.pest import pest_bp
            app.register_blueprint(pest_bp)

            from .routes.crop import crop_bp
            app.register_blueprint(crop_bp)

            from .routes.multispectral import multispec_bp
            app.register_blueprint(multispec_bp)

            from .routes.market import market_bp
            app.register_blueprint(market_bp)

            from .routes.auth import auth_bp
            app.register_blueprint(auth_bp)

            from .routes.community import community_bp
            app.register_blueprint(community_bp)

            from .routes.chat import chat_bp
            app.register_blueprint(chat_bp)

            from .routes.tips import tips_bp
            app.register_blueprint(tips_bp)

        except Exception as e:
            print(f"CRITICAL ERROR: Blueprint registration failed completely: {e}")
            app.logger.warning("Blueprint registration failed: %s", e)

    # Isolated Consult Blueprint Registration
    try:
        from backend.routes.consult import consult_bp
        app.register_blueprint(consult_bp)
        print("SUCCESS: consult_bp registered (Absolute)")
    except Exception:
        try:
            from .routes.consult import consult_bp
            app.register_blueprint(consult_bp)
            print("SUCCESS: consult_bp registered (Relative)")
        except Exception as e:
            print(f"CRITICAL: Failed to register consult_bp: {e}")

    # Health Check
    @app.get("/health")
    def health_check():
        return jsonify(status="ok"), 200

    # Serve static frontend
    @app.get("/")
    def index():
        return send_from_directory("static", "index.html")

    print("\nRegistered Routes:")
    for rule in app.url_map.iter_rules():
      print(rule)
  

    return app


if __name__ == "__main__":
    # Ensure runtime dirs exist
    for p in [
        Path("models"),
        Path("routes"),
        Path("static"),
    ]:
        p.mkdir(parents=True, exist_ok=True)

    # Run app
    app = create_app()
    print("starting server on port 8000...")
    # Disable reloader to prevent [WinError 10038] and venv monitoring crashes
    app.run(host="0.0.0.0", port=8000, debug=True, use_reloader=False)
