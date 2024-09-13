from app.model.m_BrgyStreets import BrgyStreets

class BrgyStreetService:
    def get_street_dict_by_id(self, id):
        query = BrgyStreets.query.filter_by(id=id).first()
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
    
    def get_all_streets_list_obj(self):
        query = BrgyStreets.query.all()
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