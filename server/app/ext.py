from flask_session import Session
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

cors = CORS()
sess = Session()
db = SQLAlchemy()
migrate = Migrate()
