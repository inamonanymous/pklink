from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy.orm import aliased
from werkzeug.security import check_password_hash, generate_password_hash
import datetime as dt
db = SQLAlchemy()


def get_uuid():
    return uuid4().hex