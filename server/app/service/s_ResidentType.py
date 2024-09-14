from app.model.m_ResidentType import ResidentType

class ResidentTypeService:
    def get_resident_type_dict_by_id(self, resident_id):
        query = ResidentType.query.filter_by(id=resident_id).first()
        if not query:
            return None
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