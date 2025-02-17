from app.ext import db
from app.model import get_uuid, dt

class PostComments(db.Model):
    __tablename__ = 'postcomments'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    post_id = db.Column(db.String(32), db.ForeignKey('posts.id') ,default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id') ,default=get_uuid)
    comment = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    posts = db.relationship('Posts', foreign_keys=[post_id], backref=db.backref('postcomments', lazy=True))