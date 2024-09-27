from app.ext import db
from app.model import get_uuid, dt

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id'), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    users = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('admin', lazy=True))