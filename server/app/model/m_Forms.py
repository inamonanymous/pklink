from app.ext import db
from app.model import get_uuid, dt

class Forms(db.Model):
    __tablename__ = 'forms'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    target_residents = db.Column(db.String(32))
    title = db.Column(db.String(255), nullable=False)
    description_text = db.Column(db.String(255), nullable=False)
    created_by = db.Column(db.String(255), db.ForeignKey('users.id'), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    