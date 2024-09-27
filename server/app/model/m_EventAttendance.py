from app.ext import db
from app.model import get_uuid, dt

class EventAttendance(db.Model):
    __tablename__ = 'eventattendance'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    event_id = db.Column(db.String(32), db.ForeignKey('events.id'), default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('verifiedusers.user_id'), default=get_uuid)
    status = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    event = db.relationship('Events', foreign_keys=[event_id], backref=db.backref('eventattendance', lazy=True))
    v_user = db.relationship('VerifiedUsers', foreign_keys=[user_id], backref=db.backref('formresponses', lazy=True))
    
