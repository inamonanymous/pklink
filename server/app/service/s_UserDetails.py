from app.model.m_Villages import Villages
from app.model.m_UserDetails import UserDetails
from app.model.m_BrgyStreets import BrgyStreets

class UserDetailsService:
    #GET user details with location or village information by targeting username
    #returned as dictionary {}
    def get_user_details_dict_by_username(self, username):
        ud_query = UserDetails.query.filter_by(
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