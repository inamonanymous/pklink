from app.model.m_Posts import Posts
from app.model.m_Users import Users
from app.model.m_Announcements import Announcements
from app.model.m_ResidentType import ResidentType
from app.ext import db
from app.service.s_functions import generate_gcs_post_image_path, upload_image_to_gcs, check_image_validity, delete_post_folder_from_gcs, update_post_image_in_gcs
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

class PostsService:
    def edit_post(self, post_id, title=None, content=None, new_image=None, user_id=None):
        target_post = Posts.query.filter_by(id=post_id).first()
        if target_post is None:
            return None

        # Handle image update
        if new_image and user_id:
            new_photo_url = update_post_image_in_gcs(user_id, post_id, new_image)
            if new_photo_url:
                target_post.photo_path = new_photo_url  # Update only if upload succeeds

        # Prepare update data
        update_data = {
            "title": title,
            "content": content,
        }

        # Update only non-None fields
        for key, value in update_data.items():
            if value is not None:
                setattr(target_post, key, value)

        db.session.commit()
        return target_post  # Return updated post


    def delete_post(self, post_id):
        post = Posts.query.filter_by(id=post_id).first()
        announcement = Announcements.query.filter_by(posts_id=post.id).first()

        if announcement is None:
            return False
        
        db.session.delete(announcement)
        db.session.commit()
        if post is None:
            return False

         # Delete the photo from GCS if it exists
        if post.photo_path:
            print(delete_post_folder_from_gcs(post.created_by, post.id))

        # Delete the post from the database
        try:
            db.session.delete(post)
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {e}")
            return False

    def insert_post(self, title, content, photo, created_by):
        # Create a new post entry and save it to the database
        try:
            post_entry = Posts(
                title=title,
                content=content,
                created_by=created_by,
                date_created=datetime.now()
            )
            db.session.add(post_entry)
            db.session.commit()

            photo_path_gcs = None
            # Save the post photo and get the file path
            if photo:
                photo_ext = check_image_validity(photo)
                if not photo_ext:
                    return {"message": "Failed to save image. image not valid"}, 400  # Return error if image save failed
                photo_path_gcs = generate_gcs_post_image_path(user_id=created_by, post_id=post_entry.id, image_ext=photo_ext)
                photo.seek(0)
                print(upload_image_to_gcs(photo, photo_path_gcs))
                if not photo_path_gcs:
                    return {"message": "Failed to save image."}, 500  # Return error if image save failed
            else:
                photo_path_gcs = None
            post_entry.photo_path = photo_path_gcs
            db.session.commit()
            return True
        except SQLAlchemyError as e:
            db.session.rollback()
            print(e)
            return False


    def get_all_posts_dict(self):
        # Perform the query using Posts.query
        query = Posts.query\
            .join(Users, Posts.created_by == Users.id)\
            .outerjoin(ResidentType, Users.resident_id == ResidentType.id)\
            .order_by(Posts.date_created.desc())\
            .add_entity(Users)\
            .add_entity(ResidentType)\
            .all()

        # Convert query result to list of dictionaries
        posts_list = []
        for post, user, resident_type in query:
            result = {
                'post_id': post.id,
                'post_title': post.title,
                'post_content': post.content,
                'post_user_id': post.created_by,
                'user_firstname': user.firstname,
                'user_middlename': user.middlename,
                'user_lastname': user.lastname,
                'user_resident_type': resident_type.resident_type_name if resident_type else None,
                'user_photo_path': user.photo_path if user.photo_path else None,
                'post_photo_path': post.photo_path,
                'post_date_created': post.date_created.isoformat()
            }
            posts_list.append(result)

        return posts_list

    def get_all_post_by_user_id(self, user_id):
        # Perform the query using Posts.query
        query = Posts.query\
            .join(Users, Posts.created_by == Users.id)\
            .outerjoin(ResidentType, Users.resident_id == ResidentType.id)\
            .filter(Users.id == user_id)\
            .order_by(Posts.date_created.desc())\
            .add_entity(Users)\
            .add_entity(ResidentType)\
            .all()

        # If no results, return None
        if not query:
            return None

        # Convert query result to list of dictionaries
        result_list = []
        for post, user, resident_type in query:
            result = {
                'user_firstname': user.firstname,
                'user_middlename': user.middlename,
                'user_lastname': user.lastname,
                'user_resident_type': resident_type.resident_type_name if resident_type else None,
                'user_photo_path': user.photo_path if user.photo_path else None,
                'post_title': post.title,
                'post_content': post.content,
                'post_photo_path': post.photo_path,
                'post_date_created': post.date_created.isoformat()
            }
            result_list.append(result)

        return result_list
