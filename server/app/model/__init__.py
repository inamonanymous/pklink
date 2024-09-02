from uuid import uuid4
from sqlalchemy.orm import aliased
from werkzeug.security import check_password_hash, generate_password_hash
import datetime as dt

def get_uuid():
    return uuid4().hex