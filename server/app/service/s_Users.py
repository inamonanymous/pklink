from app.service import check_password_hash, generate_password_hash, db, abort
from app.model.m_Users import Users
from app.model.m_UserDetails import UserDetails
from app.service.functions import get_image_registration_path, create_user_directory, save_user_registration_image

class UserService:
    #verify user authentication 
    # IF username 
    # AND password matched a row inside <Users> table
    def check_login(self, username, password):
        user = Users.query.filter_by(
            username=username.strip()
        ).first()
        if not (user and check_password_hash(user.password, password.strip())):
            return None
        return user
    
    #insert data to user table with userdetails table
    def insert_user_and_details(self, user_data, details_data, user_photo, selfie, gov_id) -> bool:
        if not (selfie and gov_id):
            return False
        try:
            with db.session.begin_nested():

                user_entry = Users(
                    username=user_data['username'].strip(),
                    password=generate_password_hash(user_data['password'].strip()),
                    firstname=user_data['firstname'],
                    middlename=user_data['middlename'],
                    lastname=user_data['lastname'],
                    suffix=user_data['suffix'],
                    gender=user_data['gender']
                )
                db.session.add(user_entry)
                db.session.flush()
                
                #entry object for user details
                user_details_entry = UserDetails(
                    user_id = user_entry.id,
                    village_id = details_data['village_id'],
                    brgy_street_id = details_data['brgy_street_id'],
                    house_number = details_data['house_number'],
                    lot_number = details_data['lot_number'],
                    block_number = details_data['block_number'],
                    village_street = details_data['village_street'],
                    email_address = details_data['email_address'],
                    phone_number = details_data['phone_number'],
                    phone_number2 = details_data['phone_number2'],
                    modified_by = user_entry.id
                )

                db.session.add(user_details_entry)
                db.session.flush()

                user_directory = create_user_directory(user_entry.id)
                
                photo_paths = get_image_registration_path(
                    user_directory,
                    user_photo=user_photo,
                    selfie=selfie,
                    gov_id=gov_id
                )

                if photo_paths['user_photo_path']:
                    save_user_registration_image(selfie, photo_paths['selfie_path'])
                    user_entry.photo_path = photo_paths['user_photo_path']

                save_user_registration_image(selfie, photo_paths['selfie_path'])
                save_user_registration_image(gov_id, photo_paths['gov_id_path'])

                user_details_entry.selfie_photo_path=photo_paths['selfie_path']
                user_details_entry.gov_id_photo_path=photo_paths['gov_id_path']
            db.session.commit()
            return True
        except db.SQLAlchemyError as e:
            db.session.rollback()
            print(e)
            return False


    #fetch all rows from <Users> table
    def get_all_user(self):
        query = Users.query.order_by(Users.lastname.asc()).all()
        users = [{
            'user_id': i.id,
            'user_username': i.username,
            'user_firstname': i.firstname,
            'user_middlename': i.middlename,
            'user_lastname': i.lastname,
            'user_suffix': i.suffix,
            'user_gender': i.gender,
            'user_photo_path': i.photo_path,
            'user_date_created': i.date_created.isoformat()
        } for i in query]

        return users
    
    #fetch all rows from <Users> table
    #returned as dictionary {}
    def get_user_dict_by_username(self, username):
        query = Users.query\
            .filter_by(username=username)\
            .order_by(Users.lastname.asc())\
            .first()
        if not query:
            return None
        users = {
            'user_id': query.id,
            'resident_id': query.resident_id,
            'user_username': query.username,
            'user_firstname': query.firstname,
            'user_middlename': query.middlename,
            'user_lastname': query.lastname,
            'user_suffix': query.suffix,
            'user_gender': query.gender,
            'user_photo_path': query.photo_path,
            'user_date_created': query.date_created.isoformat()
        } 

        return users
    
    @classmethod
    def get_user_obj_by_id(self, id):
        query = Users.query.filter_by(id=id).first()
        return query 