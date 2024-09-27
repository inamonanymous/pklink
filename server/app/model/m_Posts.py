from app.ext import db
from app.model import get_uuid, dt

class Posts(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.String(255), nullable=False)
    created_by = db.Column(db.String(32), db.ForeignKey('verifiedusers.user_id'))
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    v_user = db.relationship('VerifiedUsers', foreign_keys=[created_by], backref=db.backref('posts', lazy=True))