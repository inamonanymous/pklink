from app.ext import db
from app.model.m_Villages import Villages
class VillagesService:
    def get_village_by_id(self, id):
        return Villages.query.filter_by(id=id).first()

    def insert_village(self, village_name, user_id):
        try:
            query = Villages(
                village_name=village_name,
                modified_by=user_id
            )
            db.session.add(query)
            db.session.commit()
            return query
        except Exception as e:
            print(f'error at insert village {e}')
            return None

    def delete_village(self, id):
        try:
            target_village = Villages.query.filter_by(id=id).first()
            if not target_village:
                return False
            db.session.delete(target_village)
            db.session.commit()
            return True
        except Exception as e:
            print(f'error at delete village: {e}')
            return False

    def edit_village(self, id, village_name, user_id):
        try:
            target_village = Villages.query.filter_by(id=id).first()
            if not village_name:
                return None
            target_village.village_name = village_name
            target_village.modified_by=user_id
            db.session.commit()
            return target_village
        except Exception as e:
            print(f'error at edit village: {e}')
            return None


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
        