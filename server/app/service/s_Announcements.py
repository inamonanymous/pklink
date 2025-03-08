from app.model.m_Announcements import Announcements
from app.model.m_Posts import Posts
from app.model.m_Users import Users
from app.model.m_ResidentType import ResidentType
from app.ext import db
from datetime import datetime

class AnnouncementsService:
    def count_current_published_announcements(self):
        try:
            now = datetime.now()
            count = Announcements.query.filter(
                Announcements.is_published == True,
                Announcements.publish_date >= now
            ).count()
            return count
        except Exception as e:
            print(f"Error counting current published announcements: {e}")
            return 0


    def insert_announcement(self, posts_id, category):
        try:
            check_post = Posts.query.filter_by(id=posts_id).first()

            if check_post is None:
                print('no post record found')
                return None

            new_announcement = Announcements(
                posts_id=posts_id,
                category=category,
                is_published=True,
                publish_date=datetime.now()
            )
            db.session.add(new_announcement)
            db.session.commit()
            return new_announcement
        except Exception as e:
            print(f'error at insert announcement {e}')
            return None

    def edit_announcement(self, announcement_id, publish_date=None, is_published=None, category=None):
        try:
            target_announcement = Announcements.query.filter_by(id=announcement_id).first()
            if target_announcement is None:
                print('no announcement found')
                return None

            # If publish_date is provided, check against the post's date_created
            if publish_date:
                # Convert the publish_date (assuming it's a string) to a datetime object.
                # Adjust the format as needed if it's already a datetime.
                new_publish_date = datetime.fromisoformat(publish_date)
                post_date_created = target_announcement.post.date_created

                # Only update if the new publish date is NOT earlier than the post's date_created.
                if new_publish_date < post_date_created:
                    print("Provided publish_date is before the post's creation date; skipping update.")
                else:
                    target_announcement.publish_date = new_publish_date

            if is_published is not None:
                target_announcement.is_published = is_published
            if category:
                target_announcement.category = category

            db.session.commit()
            return target_announcement
        except Exception as e:
            print(f'error at edit announcement: {e}')
            return None


    def delete_announcement(self, announcement_id):
        try:
            target_announcement = Announcements.query.filter_by(id=announcement_id).first()
            if target_announcement is None:
                print('no announcement found')
                return None
            db.session.delete(target_announcement)
            db.session.commit()
            return True
        except Exception as e:
            print(f'error at delete announcement: {e}')


    def get_announcement_by_id(self, announcement_id, serialize=True):
        announcement = Announcements.query \
            .join(Posts, Announcements.posts_id == Posts.id) \
            .join(Users, Posts.created_by == Users.id) \
            .join(ResidentType, Users.resident_id == ResidentType.id) \
            .filter(Announcements.id == announcement_id) \
            .first()
        return self.serialize_announcement(announcement) if announcement and serialize else announcement

    def get_all_announcements(self):
        announcements = Announcements.query \
            .join(Posts, Announcements.posts_id == Posts.id) \
            .join(Users, Posts.created_by == Users.id) \
            .join(ResidentType, Users.resident_id == ResidentType.id) \
            .all()
        return [self.serialize_announcement(announcement) for announcement in announcements]

    
    def serialize_announcement(self, announcement):
        """Serialize an announcement along with its related post, user, and resident type data."""
        return {
            'id': announcement.id,
            'posts_id': announcement.posts_id,
            'publish_date': announcement.publish_date.isoformat() if announcement.publish_date else None,
            'is_published': announcement.is_published,
            'category': announcement.category,
            'post': {
                'id': announcement.post.id,
                'title': announcement.post.title,
                'content': announcement.post.content,
                'photo_path': announcement.post.photo_path,
                'created_by': announcement.post.created_by,
                'date_created': announcement.post.date_created.isoformat() if announcement.post.date_created else None,
                'user': {
                    'id': announcement.post.user.id,
                    'firstname': announcement.post.user.firstname,
                    'middlename': announcement.post.user.middlename,
                    'lastname': announcement.post.user.lastname,
                    'photo_path': announcement.post.user.photo_path,
                    'resident_type': announcement.post.user.resident.resident_type_name 
                                    if announcement.post.user.resident else None
                } if announcement.post.user else None
            } if announcement.post else None
        }
