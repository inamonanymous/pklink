from app.ext import db
from app.model import get_uuid, dt

class BrgyStreets(db.Model):
    __tablename__ = 'brgystreets'
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    street_name = db.Column(db.String(255), unique=True, nullable=False)
    purok = db.Column(db.Integer, nullable=False)
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    modified_by = db.Column(db.String(255), nullable=False)

    usersdetails = db.relationship('UserDetails', backref=db.backref('brgystreets'))

    @classmethod
    def get_street_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        if not query:
            return None
        street_data = {
            'id': query.id,
            'street_name': query.street_name,
            'purok': query.purok,
            'last_modified': query.last_modified.isoformat(),
            'modified_by': query.modified_by,
        }
        return street_data
    
    @classmethod
    def get_all_streets(cls):
        query = cls.query.all()
        if not query:
            return None
        streets_data = [{
            'id': i.id,
            'street_name': i.street_name,
            'purok': i.purok,
            'last_modified': i.last_modified.isoformat(),
            'modified_by': i.modified_by,
        }for i in query]
        return streets_data