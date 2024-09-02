from app.ext import db
from app.model import get_uuid

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_username = db.Column(db.String(255), db.ForeignKey('users.username'), unique=True, nullable=False)

    users = db.relationship('Users', backref=db.backref('admin', lazy=True))

    @classmethod
    def get_admin_by_username(cls, username:str):
        return cls.query.filter_by(user_username=username).first()
    