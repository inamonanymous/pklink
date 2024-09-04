from flask import session
from app.ext import db
from app.model import get_uuid, dt
from app.model.m_Users import Users
from app.model.m_BrgyStreets import BrgyStreets
from app.model.m_Villages import Villages

class UserDetails(db.Model):
    __tablename__ = 'userdetails'
    id = db.Column(db.String(32), default=get_uuid, unique=True, primary_key=True)
    user_username = db.Column(db.String(32), db.ForeignKey('users.username'), nullable=False, unique=True)
    village_id = db.Column(db.String(32), db.ForeignKey('villages.id'), nullable=True)
    brgy_street_id = db.Column(db.String(32), db.ForeignKey('brgystreets.id'), nullable=True)
    house_number = db.Column(db.Integer, nullable=False)
    lot_number = db.Column(db.Integer, nullable=True)
    block_number = db.Column(db.Integer, nullable=True)
    village_street = db.Column(db.String(255), nullable=True)
    email_address = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False)
    phone_number2 = db.Column(db.String(15), nullable=True)
    selfie_photo_path = db.Column(db.String(255), nullable=False)
    gov_id_photo_path = db.Column(db.String(255), nullable=False)
    last_modified = db.Column(db.DateTime, default=dt.datetime.now())
    modified_by = db.Column(db.String(255), nullable=False)

    users = db.relationship('Users', backref=db.backref('userdetails', lazy=True))
    
    @classmethod
    def insert_user_details(cls, 
                            user_username,
                            village_id, 
                            brgy_street_id, 
                            house_number,
                            lot_number, 
                            block_number, 
                            village_street, 
                            email_address,
                            phone_number,
                            phone_number2,
                            selfie_photo_path,
                            gov_id_photo_path
                            ):
        user_details_entry = cls(
            user_username=user_username,
            village_id=village_id,
            brgy_street_id=brgy_street_id,
            house_number=house_number,
            lot_number=lot_number,
            block_number=block_number,
            village_street=village_street,
            email_address=email_address.strip(),
            phone_number=phone_number.strip(),
            phone_number2=phone_number2,
            selfie_photo_path=selfie_photo_path.strip(),
            gov_id_photo_path=gov_id_photo_path.strip(),
            last_modified=dt.datetime.now(),
            modified_by=user_username,
        )
        if cls.query.filter_by(user_username=user_details_entry.user_username).first() is not None:
            return None
        db.session.add(user_details_entry)
        db.session.commit()
        return user_details_entry

    #GET user details with location or village information by targeting username
    @classmethod
    def get_user_details_by_username(cls, username):
        ud_query = cls.query.filter_by(
            user_username=username
        ).first()
        location_type = str()
        village_info = Villages.get_village_by_id(ud_query.village_id)
        brgy_street_info = BrgyStreets.get_street_by_id(ud_query.brgy_street_id)
        
        if brgy_street_info:
            location_type = 'Local Resident'
        elif village_info:
            location_type = 'Subdivision / Village'
        else:
            location_type = 'invalid' 

        current_user_details = {
            'user_username': ud_query.user_username,
            'location_type': location_type,
            'village_obj': village_info,
            'brgy_street_obj': brgy_street_info,
            'house_number': ud_query.house_number,
            'lot_number': ud_query.lot_number,
            'block_number': ud_query.block_number,
            'village_street': ud_query.village_street,
            'email_address': ud_query.email_address,
            'phone_number': ud_query.phone_number,
            'phone_number2': ud_query.phone_number2,
            'selfie_photo_path': ud_query.selfie_photo_path,
            'gov_id_photo_path': ud_query.gov_id_photo_path,
            'last_modified': ud_query.last_modified.isoformat(),
            'modified_by': ud_query.modified_by,
        }

        return current_user_details

        

