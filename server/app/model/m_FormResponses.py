from app.ext import db
from app.model import get_uuid, dt

class FormResponses(db.Model):
    __tablename__ = 'formresponses'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    form_id = db.Column(db.String(32), db.ForeignKey('forms.id'), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('verifiedusers.user_id'), primary_key=True, default=get_uuid)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    form = db.relationship('FormResponses', backref=db.backref('formresponses', lazy=True))
    user = db.relationship('Users', backref=db.backref('formresponses', lazy=True))