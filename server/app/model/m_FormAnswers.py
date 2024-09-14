from app.ext import db
from app.model import get_uuid, dt

class FormAnswers(db.Model):
    __tablename__ = 'formanswers'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    form_response_id = db.Column(db.String(32), db.ForeignKey('formresponses.id'), primary_key=True, default=get_uuid)
    form_fields_id = db.Column(db.String(32), db.ForeignKey('formfields.id'), primary_key=True, default=get_uuid)
    answer = db.Column(db.String(255), nullable=True)

    forms = db.relationship('FormResponses', backref=db.backref('formanswers', lazy=True))
    formfield = db.relationship('FormFields', backref=db.backref('formanswers', lazy=True))
    