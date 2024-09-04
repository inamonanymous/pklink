from app.ext import db
from app.model import get_uuid, dt

class Villages(db.Model):
    __tablename__ = 'villages'
    id = db.Column(db.String(32), unique=True, primary_key=True, default=get_uuid)
    village_name = db.Column(db.String(255), unique=True, nullable=False)
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    modified_by = db.Column(db.String(255), nullable=False)

    users = db.relationship('UserDetails', backref=db.backref('villages'))

    @classmethod
    def get_village_by_id(cls, id):
        query = cls.query.filter_by(id=id).first()
        if not query:
            return None
        village_data = {
            'id': query.id,
            'village_name': query.village_name,
            'last_modified': query.last_modified.isoformat(),
            'modified_by': query.modified_by,
        }
        return village_data
    
    @classmethod
    def get_all_villages(cls):
        query = cls.query.all()
        if not query:
            return None
        villages_data = [{
            'id': i.id,
            'village_name': i.village_name,
            'last_modified': i.last_modified.isoformat(),
            'modified_by': i.modified_by,
        } for i in query]

        return villages_data