from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from werkzeug.security import check_password_hash, generate_password_hash
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    middlename = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)

    @classmethod
    def check_login(cls, email, password) -> object:
        user = cls.query.filter_by(email=email).first()
        if not (user and check_password_hash(user.password, password)):
            return None
        return user
    
    @classmethod
    def insert_user(cls, email, firstname, middlename, lastname, password) -> object:
        check_user = cls.query.filter_by(email=email).first()
        if check_user:
            return None
        user_entry = cls(email=email,
                         firstname=firstname,
                         middlename=middlename,
                         lastname=lastname,
                         password=generate_password_hash(password))
        db.session.add(user_entry)
        db.session.commit()
        return user_entry
    





