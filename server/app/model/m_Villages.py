from app.ext import db
from app.model import get_uuid, dt

class Villages(db.Model):
    __tablename__ = 'villages'
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    village_name = db.Column(db.String(255), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    modified_by = db.Column(db.String(255), nullable=False)

    userdetails = db.relationship('UserDetails', backref=db.backref('villages'))
