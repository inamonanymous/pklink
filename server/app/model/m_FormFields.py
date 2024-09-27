from app.ext import db
from app.model import get_uuid, dt

class FormFields(db.Model):
    __tablename__ = 'formfields'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    form_id = db.Column(db.String(32), db.ForeignKey('forms.id'), nullable=False)
    label = db.Column(db.String(255), nullable=False)
    field_type = db.Column(db.String(255), nullable=False)
    is_required = db.Column(db.Boolean, default=True)

    forms = db.relationship('Forms', foreign_keys=[form_id], backref=db.backref('formfields', lazy=True))