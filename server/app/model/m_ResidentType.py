from app.ext import db
from app.model import get_uuid, dt

class ResidentType(db.Model):
    __tablename__ = 'residenttype'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid, unique=True)
    resident_type_name = db.Column(db.String(255), unique=True)
    manage_post = db.Column(db.Boolean, default=False)
    add_post = db.Column(db.Boolean, default=False)
    manage_event = db.Column(db.Boolean, default=False)
    add_event = db.Column(db.Boolean, default=False)
    manage_announcement = db.Column(db.Boolean, default=False)
    add_announcement = db.Column(db.Boolean, default=False)
    view_accounts = db.Column(db.Boolean, default=False)
    control_accounts = db.Column(db.Boolean, default=False)
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    modified_by = db.Column(db.String(255), nullable=False)

    users = db.relationship('Users', backref=db.backref('residenttype'))

    @classmethod
    def get_resident_type_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        if not query:
            return {}
        resident_data = {
            'resident_type_name': query.resident_type_name,
            'resident_manage_post': query.manage_post,
            'resident_add_post': query.add_post,
            'resident_manage_event': query.manage_event,
            'resident_add_event': query.add_event,
            'resident_manage_announcement': query.manage_announcement,
            'resident_add_announcement': query.add_announcement,
            'resident_view_accounts': query.view_accounts,
            'resident_control_accounts': query.control_accounts,
        }
        return resident_data