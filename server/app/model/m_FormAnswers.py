from app.ext import db
from app.model import get_uuid, dt

class FormAnswers(db.Model):
    __tablename__ = 'formanswers'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    form_response_id = db.Column(db.String(32), db.ForeignKey('formresponses.id'), primary_key=True, default=get_uuid)
    form_fields_id = db.Column(db.String(32), db.ForeignKey('formfields.id'), primary_key=True, default=get_uuid)
    answer = db.Column(db.String(255), nullable=True)

    form_response = db.relationship('FormResponses', foreign_keys=[form_response_id], backref=db.backref('formanswers', lazy=True))
    formfield = db.relationship('FormFields', foreign_keys=[form_fields_id], backref=db.backref('formanswers', lazy=True))
    