from flask import Flask
from config import ApplicationConfig
from model import db
from resource.user import UserAuth, UserRegistration
from flask_session import Session
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
db.init_app(app)
api = Api(app)
sess = Session(app)
CORS(app, resources={r"/user/*": {"origins": ["*"]}})

api.add_resource(UserAuth, '/user/auth')
api.add_resource(UserRegistration, '/user/registration')

if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port="5001"
    )