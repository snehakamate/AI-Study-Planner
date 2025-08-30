from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()  # This loads .env into environment variables

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app)

    # Import and register routes
    from .routes import main
    app.register_blueprint(main)

    return app
