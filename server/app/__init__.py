from flask import Flask
from app.config import ApplicationConfig
from app.model import db
from app.ext import sess, cors
from app.resource.user import UserAuth, UserRegistration, UserData, UserVerification
from flask_restful import Api

def create_app():
    app = Flask(__name__)
    app.config.from_object(ApplicationConfig)
    db.init_app(app)
    sess.init_app(app)
    api = Api(app)
    cors.init_app(app, resources={r"/user/*": {"origins": ["*"]}})

    api.add_resource(UserAuth, '/user/auth')
    api.add_resource(UserRegistration, '/user/registration')
    api.add_resource(UserData, '/user/data')
    api.add_resource(UserVerification, '/user/verify')

    return app
    