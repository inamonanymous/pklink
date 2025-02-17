from app.ext import db
from app.model import get_uuid, dt

class Incidents(db.Model):
    __tablename__ = 'incidents'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    status = db.Column(db.Enum('pending', 'open', 'closed'), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    photo_path = db.Column(db.String(255))
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    user = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('incidents'))
    