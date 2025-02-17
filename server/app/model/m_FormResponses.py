from app.ext import db
from app.model import get_uuid, dt

class FormResponses(db.Model):
    __tablename__ = 'formresponses'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    form_id = db.Column(db.String(32), db.ForeignKey('forms.id'))
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    form = db.relationship('Forms', foreign_keys=[form_id], backref=db.backref('formresponses', lazy=True))
    