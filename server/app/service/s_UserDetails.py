from app.model.m_UserDetails import UserDetails
from app.service.s_Villages import VillagesService
from app.service.s_BrgyStreet import BrgyStreetService

vs_ins = VillagesService()
bss_ins = BrgyStreetService()

class UserDetailsService:
    #GET user details with location or village information by targeting user id
    #returned as dictionary {}
    def get_user_details_dict_by_user_id(self, user_id):
        ud_query = UserDetails.query.filter_by(
            user_id=user_id
        ).first()
        if not ud_query:
            return None
        location_type = str()
        village_info = vs_ins.get_village_dict_by_id(ud_query.village_id)
        brgy_street_info = bss_ins.get_street_dict_by_id(ud_query.brgy_street_id)
        
        if brgy_street_info:
            location_type = 'Local Resident'
        elif village_info:
            location_type = 'Subdivision / Village'
        else:
            location_type = 'invalid' 

        current_user_details = {
            'user_id': user_id,
            'location_type': location_type,
            'village_obj': village_info,
            'brgy_street_obj': brgy_street_info,
            'house_number': ud_query.house_number,
            'lot_number': ud_query.lot_number,
            'civil_status': ud_query.civil_status,
            'birthday': ud_query.birthday.isoformat(),
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