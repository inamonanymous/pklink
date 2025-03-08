from app.ext import db
from app.model import get_uuid, dt

class Events(db.Model):
    __tablename__ = 'events'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    created_by = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    user = db.relationship('Users', foreign_keys=[created_by], backref=db.backref('events'))