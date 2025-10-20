from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, ma
from .routes import api_bp

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'dev-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    
    app.register_blueprint(api_bp, url_prefix='/api')
    
    return app
