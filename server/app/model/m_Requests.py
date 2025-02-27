from app.ext import db
from app.model import get_uuid, dt

class Requests(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_id = db.Column(db.String(255), db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    request_type = db.Column(db.Enum('health_support', 'document_request'), nullable=False)
    status = db.Column(db.Enum('pending', 'in_progress', 'completed'), nullable=False)
    description_text = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    qr_code_path = db.Column(db.String(255))

    user = db.relationship('Users', foreign_keys=[user_id], backref=db.backref('requests', cascade='all, delete-orphan'))
    