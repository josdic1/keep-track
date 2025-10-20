from flask import Flask
from flask_cors import CORS
from .extensions import db, migrate, ma
from .routes import api_bp
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import os

def create_app(config_name='development'):
    app = Flask(__name__, instance_relative_config=True)
    os.makedirs(app.instance_path, exist_ok=True)

    # Configuration
    if config_name == 'production':
        app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
        app.config['DEBUG'] = False
    elif config_name == 'testing':
        app.config['SECRET_KEY'] = 'test-secret-key'
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['TESTING'] = True
    else:
        app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(app.instance_path, "app.db")}'
        app.config['DEBUG'] = True

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Initialize Flask-Admin
    admin = Admin(app, name='Keep-Track Admin', template_mode='bootstrap4')

    # Import models and add admin views
    from .models import Track, Artist, Tag, Link, Media, StatusHistory
    

    admin.add_view(ModelView(Track, db.session, name='Tracks'))
    admin.add_view(ModelView(Artist, db.session, name='Artists'))
    admin.add_view(ModelView(Tag, db.session, name='Tags'))
    admin.add_view(ModelView(Link, db.session, name='Links'))
    admin.add_view(ModelView(Media, db.session, name='Media'))
    admin.add_view(ModelView(StatusHistory, db.session, name='Status History'))

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
