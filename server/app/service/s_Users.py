from app.service import check_password_hash, generate_password_hash, db, abort
from app.model.m_Users import Users
from app.model.m_UserDetails import UserDetails
from app.model.m_ResidentType import ResidentType
from app.service.s_functions import check_if_local, upload_image_to_gcs, generate_gcs_registration_image_path, check_image_validity, update_user_image_in_gcs, delete_user_image_in_gcs, delete_user_directory_in_gcs
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import func, text, case
from app.service.s_functions import verify_face
from datetime import datetime

class UserService:
    def change_password(self, user_id, old_password, new_password):
        try:
            # Get user by id
            user = Users.query.filter_by(id=user_id).first()
            if not user:
                print("User not found")
                return None
            
            # Verify the old password
            if not check_password_hash(user.password, old_password):
                print("Old password does not match")
                return None
            
            # Generate a new password hash and update the user's password
            user.password = generate_password_hash(new_password)
            db.session.commit()
            return user
        except Exception as e:
            print(f"Error changing password: {e}")
            db.session.rollback()
            return None

    def delete_user(self, user_id):
        try:
            target_user = Users.query.filter_by(id=user_id).first()
            if not target_user:
                print('user cannot be found')
                return False
            
            """ user_details = UserDetails.query.filter_by(user_id=target_user.id).first() """


            db.session.delete(target_user)
            db.session.commit()
            delete_user_directory_in_gcs(target_user.id)
            return True
        except Exception as e:
            #print(f'error at us.delete_user: {e}')
            return False


    def delete_user_resident_type(self, user_id):
        try:
            target_user = Users.query.filter_by(id=user_id).first()
            if not (target_user and target_user.resident_id):
                print('user cannot be found')
                return None
            target_user.resident_id = None
            db.session.commit()
            return target_user
        except Exception as e:
            print(f'error at us.delete_user_resident_type: {e}')
            return None
        

    def assign_user_resident_type(self, user_id, resident_type_id):
        try:
            target_user = Users.query.filter_by(id=user_id).first()
            target_resident_type = ResidentType.query.filter_by(id=resident_type_id).first()

            if not (target_user and target_resident_type):
                print('user and resident type cannot be found')
                return None
            target_user.resident_id = target_resident_type.id
            db.session.commit()
            return target_user
        except Exception as e:
            print(f'error at us.assign_user_resident_type: {e}')
            return None
        


    def edit_user_photo(self, user_id, photo):
        target_user = Users.query.filter_by(id=user_id).first()
        if not (target_user and target_user.photo_path):
            print('no user or photo found')
            return  None
        update_image = update_user_image_in_gcs(target_user.id, photo)
        if not update_image:
            print('user image failed to update')
            return None
        target_user.photo_path = update_image
        db.session.commit()
        return target_user
    
    def add_user_photo(self, user_id, photo):
        target_user = Users.query.filter_by(id=user_id).first()
        if not target_user:
            print('no user found')
            return None
        if target_user.photo_path:
            print('cant add photo, theres existing one')
            return None
        image_ext = check_image_validity(photo)
        if not image_ext:
            print('file not valid')
            return None
        
        new_image_path = generate_gcs_registration_image_path(target_user.id, 'user_photo', image_ext)
        upload_image_to_gcs(photo, new_image_path)
        target_user.photo_path = new_image_path
        db.session.commit()
        return target_user
        
    def delete_user_photo(self, user_id):
        target_user = Users.query.filter_by(id=user_id).first()
        if not target_user:
            print('no user found')
            return False
        if not target_user.photo_path:
            print('cant delete photo, if theres nothing exists')
            return False
        if not delete_user_image_in_gcs(target_user.id):
            print('error deleting user image')
            return False
        target_user.photo_path = None
        db.session.commit()
        return True

    def get_users_by_resident_type(self):
        query = (
            db.session.query(
                case(
                    (Users.resident_id == None, "Registered Resident"),
                    else_=ResidentType.resident_type_name
                ).label("resident_type"),
                func.count(Users.id).label("count")
            )
            .outerjoin(ResidentType, Users.resident_id == ResidentType.id)
            .group_by("resident_type")
        )

        results = query.all()
        return {
            "labels": [row.resident_type for row in results],
            "counts": [row.count for row in results],
        }

    def get_registration_stats(self, span="daily"):
        """
        Fetch user registration counts and last names based on the specified span: daily, monthly, or yearly.
        """
        span_mapping = {
            "daily": "%Y-%m-%d",
            "monthly": "%Y-%m",
            "yearly": "%Y"
        }

        if span not in span_mapping:
            abort(400, message="Invalid timespan. Choose from daily, monthly, or yearly.")

        query = db.session.query(
            func.date_format(Users.date_created, span_mapping[span]).label("date"),
            func.count(Users.id).label("count"),
            func.group_concat(Users.lastname).label("last_names")  # Collect last names as a CSV string
        ).group_by(text("date")).order_by(text("date"))

        results = query.all()

        return {
            "labels": [row.date for row in results],
            "counts": [row.count for row in results],
            "last_names": [row.last_names.split(",") if row.last_names else [] for row in results]  # Convert CSV to list
        }


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
                    gender=user_data['gender']
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
                    modified_by = user_entry.id
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

                if user_photo != "" or user_photo is not None:
                    user_photo_ext = ""
                    user_photo_ext = check_image_validity(user_photo)
                    if user_photo_ext:
                        user_photo_path = generate_gcs_registration_image_path(user_entry.id, 'user_photo', user_photo_ext)
                        user_entry.photo_path = user_photo_path
                        print(upload_image_to_gcs(user_photo, user_photo_path))
                        
                
                selfie_path = generate_gcs_registration_image_path(user_entry.id, 'selfie', selfie_ext)
                gov_id_path = generate_gcs_registration_image_path(user_entry.id, 'gov_id', gov_id_ext)


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