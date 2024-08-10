from model import db
class ApplicationConfig:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///sqlite.db'
    SECRET_KEY = 'T^R,dWiKCP_a'
    SESSION_TYPE = 'sqlalchemy'
    SESSION_SQLALCHEMY = db
