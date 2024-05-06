from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

from .main import main
from .auth import auth


def create_app():
    app = Flask(__name__, static_folder='reports_backtesting')
    # app.config.from_object(config_object)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or '@wecare!kibet$this'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app, resources={r"*": {"origins": ["https://optiwealth.onrender.com", "http://localhost:3000"]}})
    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()

        app.register_blueprint(main)
        app.register_blueprint(auth)
    
    @app.route('/reports/<path:path>')
    def send_report(path):
        return send_from_directory('reports_backtesting', path)

    print("Static folder path:", app.static_folder)

    return app