from app.ext import db
from app.model import get_uuid, dt

class DocumentRequests(db.Model):
    __tablename__ = 'document_requests'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    request_id = db.Column(db.String(255), db.ForeignKey('requests.id'), unique=True, nullable=False)
    document_type = db.Column(db.Enum('cedula', 'brgy_certificate', 'brgy_clearance'), nullable=False)
    additional_info = db.Column(db.String(255))
    resolved_at = db.Column(db.DateTime)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    request = db.relationship('Requests',  foreign_keys=[request_id], backref=db.backref('document_requests'))

