from app.model.m_Villages import Villages
class VillagesService:
    def get_village_dict_by_id(self, id):
        query = Villages.query.filter_by(id=id).first()
        if not query:
            return None
        village_data = {
            'id': query.id,
            'village_name': query.village_name,
            'last_modified': query.last_modified.isoformat(),
            'modified_by': query.modified_by,
        }
        return village_data
    
    def get_all_villages_list(self):
        query = Villages.query.all()
        if not query:
            return None
        villages_data = [{
            'id': i.id,
            'village_name': i.village_name,
            'last_modified': i.last_modified.isoformat(),
            'modified_by': i.modified_by,
        } for i in query]

        return villages_data