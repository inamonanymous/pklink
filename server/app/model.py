from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from werkzeug.security import check_password_hash, generate_password_hash
import datetime as dt
db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    middlename = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

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
    
    @classmethod
    def get_all_user(cls):
        query = cls.query.order_by(cls.lastname.asc()).all()
        users = [{
            'user_id': i.id,
            'user_email': i.email,
            'user_firstname': i.firstname,
            'user_middlename': i.middlename,
            'user_lastname': i.lastname,
            'user_date_created': i.date_created.isoformat()
        } for i in query]

        return users
    
    
class VerifiedUsers(db.Model):
    __tablename__ = 'verified_users'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_email = db.Column(db.String(255), db.ForeignKey('users.email'), unique=True, nullable=False)
    date_verified = db.Column(db.DateTime, default=dt.datetime.now())
    
    users = db.relationship('Users', backref=db.backref('verified_users', lazy=True))

    @classmethod
    def insert_verified_user(cls, email):
        check_user = cls.query.filter_by(user_email=email).first()
        if check_user or Users.query.filter_by(email=email).first() is None: #check if that email already in this table OR that email is not in the Users table
            return None
        user_entry = cls(user_email=email)
        db.session.add(user_entry)
        db.session.commit()
        return user_entry
    
    @classmethod
    def get_all_users_with_verification(cls):
        query = db.session.query(
            Users,
            cls.date_verified
        ).outerjoin(
            Users, Users.email == cls.user_email
        ).order_by(Users.lastname.asc()).all()

        users = [{
            'user_id': i[0].id,
            'user_email': i[0].email,
            'user_firstname': i[0].firstname,
            'user_middlename': i[0].middlename,
            'user_lastname': i[0].lastname,
            'user_date_created': i[0].date_created.isoformat(),
            'user_verified': i[1] is not None,
            'date_verified': i[1].isoformat() if i[1] else None
        } for i in query]

        return users