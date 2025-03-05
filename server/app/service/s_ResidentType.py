from app.model.m_ResidentType import ResidentType
from app.ext import db
class ResidentTypeService:
    def get_all_resident_type(self):
        query = ResidentType.query.all()
        data = [{
            'resident_type_id': i.id,
            'resident_type_name': i.resident_type_name,
            'resident_manage_post': i.manage_post,
            'resident_add_post': i.add_post,
            'resident_manage_event': i.manage_event,
            'resident_add_event': i.add_event,
            'resident_manage_announcement': i.manage_announcement,
            'resident_add_announcement': i.add_announcement,
            'resident_view_accounts': i.view_accounts,
            'resident_control_accounts': i.control_accounts,
            'resident_partial_admin': i.partial_admin,
            'resident_manage_request': i.manage_request,
            'modified_by': i.modified_by,
            'date_created': i.date_created.isoformat(),
        } for i in query]
        return data

    def get_resident_type_by_id(self, id):
        return ResidentType.query.filter_by(id=id).first()

    def delete_resident_type(self, id):
        try:
            target_resident_type = ResidentType.query.filter_by(id=id).first()
            if not target_resident_type:
                return False
            db.session.delete(target_resident_type)
            db.session.commit()
            return True
        except Exception as e:
            print(f'error deleting resident type: {e}')
            return False
            

    def insert_resident_type(self, 
                         name, 
                         user_id, 
                         manage_post: bool, 
                         add_post: bool,
                         manage_event: bool,
                         add_event: bool,
                         manage_announcement: bool,
                         add_announcement: bool,
                         view_accounts: bool,
                         control_accounts: bool,
                         partial_admin: bool,
                         manage_request: bool):
    
        try:
            query = ResidentType(
                resident_type_name=name,
                modified_by=user_id,
                manage_post=manage_post,
                add_post=add_post,
                manage_event=manage_event,
                add_event=add_event,
                manage_announcement=manage_announcement,
                add_announcement=add_announcement,
                view_accounts=view_accounts,
                control_accounts=control_accounts,
                partial_admin=partial_admin,
                manage_request=manage_request
            )

            db.session.add(query)
            db.session.commit()
            return query
        except Exception as e:
            print(f'Error at insert resident type: {e}')
            return None

            
    def edit_resident_type(self,
                       id, 
                       name, 
                       user_id,
                       manage_post: bool, 
                       add_post: bool,
                       manage_event: bool,
                       add_event: bool,
                       manage_announcement: bool,
                       add_announcement: bool,
                       view_accounts: bool,
                       control_accounts: bool,
                       partial_admin: bool,
                       manage_request: bool):
    
        target_resident_type = ResidentType.query.filter_by(id=id).first()
        
        if not target_resident_type:
            return None

        target_resident_type.resident_type_name = name
        target_resident_type.manage_post = manage_post
        target_resident_type.add_post = add_post
        target_resident_type.manage_event = manage_event
        target_resident_type.add_event = add_event
        target_resident_type.manage_announcement = manage_announcement
        target_resident_type.add_announcement = add_announcement
        target_resident_type.view_accounts = view_accounts
        target_resident_type.control_accounts = control_accounts
        target_resident_type.partial_admin = partial_admin
        target_resident_type.manage_request = manage_request
        target_resident_type.modified_by=user_id
        
        db.session.commit()
        return target_resident_type


    def get_resident_type_dict_by_id(self, resident_id):
        query = ResidentType.query.filter_by(id=resident_id).first()
        if not query:
            return None
        resident_data = {
            'resident_type_id': query.id,
            'resident_type_name': query.resident_type_name,
            'resident_manage_post': query.manage_post,
            'resident_add_post': query.add_post,
            'resident_manage_event': query.manage_event,
            'resident_add_event': query.add_event,
            'resident_manage_announcement': query.manage_announcement,
            'resident_add_announcement': query.add_announcement,
            'resident_view_accounts': query.view_accounts,
            'resident_control_accounts': query.control_accounts,
            'resident_partial_admin': query.partial_admin,
            'resident_manage_request': query.manage_request,
            'modified_by': query.modified_by,
            'last_modified': query.last_modified.isoformat(),
        }
        return resident_data