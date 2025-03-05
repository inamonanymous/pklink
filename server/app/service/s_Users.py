from app.service import check_password_hash, generate_password_hash, db, abort
from app.model.m_Users import Users
from app.model.m_UserDetails import UserDetails
from app.service.s_functions import check_if_local, upload_image_to_gcs, generate_gcs_registration_image_path, check_image_validity
from sqlalchemy.exc import SQLAlchemyError
from app.service.s_functions import verify_face
from datetime import datetime

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
            print('no pic found')
            return False
        if not verify_face(gov_id, selfie):
            print('no face detected')
            return False
        if not (details_data['brgy_street_id'] or details_data['village_id']):
            print('no location data found')
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
                    gender=user_data['gender'],
                    date_created=datetime.now()
                )
                db.session.add(user_entry)
                db.session.flush()
                
                #entry object for user details
                user_details_entry = UserDetails(
                    user_id = user_entry.id,
                    house_number = details_data['house_number'],
                    email_address = details_data['email_address'],
                    phone_number = details_data['phone_number'],
                    phone_number2 = details_data['phone_number2'],
                    birthday = details_data['birthday'],
                    civil_status = details_data['civil_status'],
                    modified_by = user_entry.id,
                    date_created=datetime.now()
                )

                # Check if local, with explicit handling for ValueError
                try:
                    is_local = check_if_local(details_data['brgy_street_id'], details_data['village_id'])
                except ValueError as e:
                    db.session.rollback()  # Rollback the transaction
                    print(f"Error determining if local: {e}")
                    return False

                if not is_local:
                    user_details_entry.village_id = details_data['village_id'] 
                    user_details_entry.lot_number = details_data['lot_number']
                    user_details_entry.block_number = details_data['block_number']
                    user_details_entry.village_street = details_data['village_street']
                else:   
                    user_details_entry.brgy_street_id = details_data['brgy_street_id'] 

                db.session.add(user_details_entry)
                db.session.flush()
                
                
                selfie_ext = check_image_validity(selfie)
                gov_id_ext = check_image_validity(gov_id)
                user_photo_ext = ""
                if user_photo:
                    user_photo_ext = check_image_validity(user_photo)
                
                selfie_path = generate_gcs_registration_image_path(user_entry.id, 'selfie', selfie_ext)
                gov_id_path = generate_gcs_registration_image_path(user_entry.id, 'gov_id', gov_id_ext)

                user_photo_path = generate_gcs_registration_image_path(user_entry.id, 'user_photo', user_photo_ext)

                if user_photo is not None:
                    user_entry.photo_path = user_photo_path
                    print(upload_image_to_gcs(user_photo, user_photo_path))

                print(upload_image_to_gcs(selfie, selfie_path))
                print(upload_image_to_gcs(gov_id, gov_id_path))
                

                user_details_entry.selfie_photo_path=selfie_path
                user_details_entry.gov_id_photo_path=gov_id_path
            db.session.commit()
            return True
        except SQLAlchemyError as e:
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