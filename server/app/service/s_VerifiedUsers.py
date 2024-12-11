from app.service import db, aliased
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_ResidentType import ResidentType

class VerifiedUsersService:
    def delete_verified_user(self, user_id) -> bool:
        target_user = self.get_verified_user_obj_by_user_id(user_id)
        if target_user is None:
            return False
        db.session.delete(target_user)
        db.session.commit()
        return True

    def insert_verified_user(self, user_id) -> object:
        #check if that user_id already in <VerifiedUsers> table 
        check_v_user = VerifiedUsers.query.filter_by(
            user_id=user_id
        ).first() is not None

        #check if that user id is not in the <Users> table
        check_user = Users.query.filter_by(
            id=user_id
        ).first() is None

        if check_v_user or check_user: 
            return None
        user_entry = VerifiedUsers(
            user_id=user_id.strip()
        )
        db.session.add(user_entry)
        db.session.commit()
        return user_entry
    
    def get_all_verified_users_list_obj(self):
        # fetch all rows from <Users> table 
        # COMBINED WITH rows inside <VerifiedUsers> table 
        # IF username registered in <VerifiedUsers> table
        # returned as list of objects [{}]
        query = db.session.query(
            Users,
            VerifiedUsers.date_created,
            ResidentType.resident_type_name
        ).outerjoin(
            Users, VerifiedUsers.user_id == Users.id
        ).outerjoin(
            ResidentType, Users.resident_id == ResidentType.id
        ).order_by(Users.lastname.asc()).all()
         
        if not query:
            return []

        users = [{
            'user_id': i[0].id,
            'user_resident_id': i[0].resident_id,
            'user_username': i[0].username,
            'user_firstname': i[0].firstname,
            'user_middlename': i[0].middlename,
            'user_lastname': i[0].lastname,
            'user_suffix': i[0].suffix,
            'user_gender': i[0].gender,
            'user_photo_path': i[0].photo_path,
            'user_date_created': i[0].date_created.isoformat(),
            'user_verified': i[1] is not None,
            'date_verified': i[1].isoformat() if i[1] else None,
            'user_resident_type': i[2]  # Added key for resident type name
        } for i in query] #index 0 = <Users> table | index 1 = <VerifiedUsers> table 
        return users
    
    @classmethod
    def get_all_unverified_users_list_obj(self):
        # fetch all rows from <Users> table 
        # IF username 
        # NOT registered in <VerifiedUsers> table
        # returned as list of objects [{}]
        query = db.session.query(Users).outerjoin(
            VerifiedUsers, Users.id == VerifiedUsers.user_id
        ).filter(
            VerifiedUsers.user_id == None
        ).all()

        # Format the results
        users = [{
            'status': 'unverified',
            'user_id': i.id,
            'user_username': i.username,
            'user_firstname': i.firstname,
            'user_middlename': i.middlename,
            'user_lastname': i.lastname,
            'user_suffix': i.suffix,
            'user_gender': i.gender,
            'user_photo_path': i.photo_path,
            'user_verified': False,
            'user_date_created': i.date_created.isoformat()
        } for i in query]

        return users

    @classmethod
    def get_verified_user_obj_by_user_id(self, user_id:str):
        return VerifiedUsers.query.filter_by(user_id=user_id).first()