from app.ext import db
from datetime import timedelta
class ApplicationConfig:
    SQLALCHEMY_DATABASE_URI = 'mysql://root:@localhost:3306/ibrgy_pksc'
    SECRET_KEY = 'T^R,dWiKCP_a'
    SESSION_TYPE = 'sqlalchemy'
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_SQLALCHEMY = db
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)
    SESSION_COOKIE_HTTPONLY=True