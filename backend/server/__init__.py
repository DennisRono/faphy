from flask import Flask
from flask_cors import CORS
import os
from .main import main

def create_app():
    app = Flask(__name__, static_folder='public')

    # app.config.from_object(config_object)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or '@wecare!kibet$this'

    CORS(app)

    app.register_blueprint(main)

    return app