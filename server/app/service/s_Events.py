from app.model.m_Events import Events
from app.model.m_Users import Users
from app.model.m_ResidentType import ResidentType
from app.service import db


class EventService:
    def delete_event(self, event_id):
        target_event = Events.query.filter_by(id=event_id).first()
        if target_event is None:
            return False
        db.session.delete(target_event)
        db.session.commit()
        return True

    def get_all_events_dict(self):
    # Perform the query using Posts.query
        query = Events.query\
            .join(Users, Events.created_by == Users.id)\
            .outerjoin(ResidentType, Users.resident_id == ResidentType.id)\
            .order_by(Events.date_created.desc())\
            .add_entity(Users)\
            .add_entity(ResidentType)\
            .all()

        # Convert query result to list of dictionaries
        events_list = []
        for event, user, resident_type in query:
            result = {
                'event_id': event.id,
                'event_title': event.title,
                'event_description': event.description,
                'event_location': event.location,
                'event_date': event.event_date.isoformat(),
                'event_start_time': event.start_time.isoformat(),
                'event_end_time': event.end_time.isoformat(),
                'event_user_id': event.created_by,
                'user_firstname': user.firstname,
                'user_middlename': user.middlename,
                'user_lastname': user.lastname,
                'user_resident_type': resident_type.resident_type_name if resident_type else None,
                'user_photo_path': user.photo_path if user.photo_path else None,
                'event_date_created': event.date_created.isoformat()
            }
            events_list.append(result)

        return events_list

    def insert_event(self, title, description, event_date, start_time, end_time, location, created_by):
        try:
            event_entry = Events(
                title=title,
                description=description,
                event_date=event_date,
                start_time=start_time,
                end_time=end_time,
                location=location,
                created_by=created_by
            )
            db.session.add(event_entry)
            db.session.commit()
            return True

        except:
            db.session.rollback()
            return False
