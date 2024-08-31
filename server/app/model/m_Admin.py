from app.model import db, get_uuid

class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_email = db.Column(db.String(255), db.ForeignKey('users.email'), unique=True, nullable=False)

    users = db.relationship('Users', backref=db.backref('admin', lazy=True))

    @classmethod
    def get_admin_by_email(cls, email:str):
        return cls.query.filter_by(user_email=email).first()
    