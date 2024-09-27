from app.ext import db
from app.model import get_uuid, dt

class Announcements(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    posts_id = db.Column(db.String(255), db.ForeignKey('posts.id'), unique=True, nullable=False)
    publish_date = db.Column(db.DateTime)
    is_published = db.Column(db.Boolean)
    category = db.Column(db.String(255))

    post = db.relationship('Posts',  foreign_keys=[posts_id], backref=db.backref('announcements'))
    