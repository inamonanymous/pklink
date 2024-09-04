from app.ext import db
from app.model import get_uuid, dt

class ResidentType(db.Model):
    __tablename__ = 'residenttype'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid, unique=True)
    resident_type_name = db.Column(db.String(255), unique=True)
    manage_post = db.Column(db.Boolean, default=False)
    add_post = db.Column(db.Boolean, default=False)
    manage_event = db.Column(db.Boolean, default=False)
    add_event = db.Column(db.Boolean, default=False)
    manage_announcement = db.Column(db.Boolean, default=False)
    add_announcement = db.Column(db.Boolean, default=False)
    view_accounts = db.Column(db.Boolean, default=False)
    control_accounts = db.Column(db.Boolean, default=False)
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    modified_by = db.Column(db.String(255), nullable=False)

    users = db.relationship('Users', backref=db.backref('residenttype'))