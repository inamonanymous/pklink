from app.model.m_BrgyStreets import BrgyStreets
from app.ext import db
from app.model import dt

class BrgyStreetService:
    def get_brgy_street_by_id(self, id):
        return BrgyStreets.query.filter_by(id=id).first()

    def insert_street(self, street_name, purok, user_id):
        try:
            query = BrgyStreets(
                street_name=street_name,
                purok=purok,
                modified_by=user_id
            )
            db.session.add(query)
            db.session.commit()
            return query
        except Exception as e:
            print(f'error at insert street brgy: {e}')
            return None
        

    def delete_street(self, id):
        try:
            target_street = BrgyStreets.query.filter_by(id=id).first()
            if not target_street:
                return None
            db.session.delete(target_street)
            db.session.commit()
            return True
        except Exception as e:
            print(f'error at delete street: {e}')

    def edit_street(self, id, street_name, purok, user_id):
        try:
            target_street = BrgyStreets.query.filter_by(id=id).first()
            if not target_street:
                return None
            if street_name:
                target_street.street_name = street_name
            if purok:
                target_street.purok = purok
            target_street.last_modified = dt.datetime.now()
            target_street.modified_by = user_id
            db.session.commit()
            return target_street

        except Exception as e:
            print(f'error at edit street: {e}')
            return None

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