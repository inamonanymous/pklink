from app.model.m_Posts import Posts
from app.model.m_Users import Users
from app.model.m_ResidentType import ResidentType

class PostsService:
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

    def get_post_details_by_user_id(self, user_id):
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
