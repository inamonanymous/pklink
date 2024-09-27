from app.ext import db
from app.model import get_uuid, dt

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    resident_id = db.Column(db.String(32), db.ForeignKey('residenttype.id'), nullable=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    middlename = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    suffix = db.Column(db.String(255), nullable=True)
    gender = db.Column(db.String(255), nullable=False)
    photo_path = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    resident = db.relationship('ResidentType', foreign_keys=[resident_id], backref=db.backref('Users', lazy=True))
