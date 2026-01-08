from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app)  # 🔥 This line allows frontend (5173) to talk to backend (5000)

    db.init_app(app)

    from app.routes import register_routes
    register_routes(app)

    with app.app_context():
        db.create_all()

    return app
