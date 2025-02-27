from app.ext import db
from app.model import get_uuid, dt

class HealthSupportRequests(db.Model):
    __tablename__ = 'health_support_requests'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    request_id = db.Column(db.String(255), db.ForeignKey('requests.id', ondelete="CASCADE"), unique=True, nullable=False)
    support_type = db.Column(db.String(255), nullable=False)
    additional_info = db.Column(db.String(255))
    resolved_at = db.Column(db.DateTime)

    request = db.relationship('Requests', foreign_keys=[request_id], backref=db.backref('health_support_requests', cascade='all, delete-orphan'))
