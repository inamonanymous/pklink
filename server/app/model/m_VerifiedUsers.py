from app.ext import db
from app.model import get_uuid, dt

class VerifiedUsers(db.Model):
    __tablename__ = 'verifiedusers'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id', ondelete="CASCADE"), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())
    verified_by = db.Column(db.String(32), db.ForeignKey('users.id'))
    
    user = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('verifiedusers', lazy=True, cascade='all, delete-orphan'))
    