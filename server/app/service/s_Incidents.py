from app.ext import db
from app.model.m_Incidents import Incidents
from app.model.m_Users import Users
from app.service.s_functions import generate_gcs_incident_image_path, upload_image_to_gcs, check_image_validity, delete_incident_folder_from_gcs, update_incident_image_in_gcs

class IncidentsService:
    def delete_incidents_by_user(self, user_id):
        try:
            db.session.query(Incidents).filter_by(user_id=user_id).delete()
            db.session.commit()
            return True
        except Exception as e:
            print(f'error at delete incident by user: {e}')
            return False


    def get_incident_by_incident_id(self, incident_id):
        return Incidents.query.filter_by(id=incident_id).first()

    def edit_incident_status(self, incident_id, status):
        try:
            target_incident = Incidents.query.filter_by(id=incident_id).first()
            if not target_incident:
                return None
            if status is None or status == "":
                return None
            target_incident.status = status
            db.session.commit()
            return target_incident
        except Exception as e:
            db.session.rollback()
            print(f"Error updating incident status {e}")
            return None

    def check_current_user_and_incident_match(self, incident_id, user_id):
        request = Incidents.query.filter_by(id=incident_id, user_id=user_id).first()
        return request is not None

    def get_all_incidents_by_user_id(self, user_id):
        try:
            incidents = Incidents.query.filter_by(user_id=user_id).all()
            return [
                {
                    "incident_id": incident.id,
                    "user_id": incident.user_id,
                    "description": incident.description,
                    "status": incident.status,
                    "location": incident.location,
                    "photo_path": incident.photo_path,
                    "date_created": incident.date_created.isoformat()
                }
                for incident in incidents
            ]
        except Exception as e:
            print(f"Error fetching incidents: {e}")
            return []

    def edit_incident(self, incident_id, user_id=None, description=None, location=None, new_image=None, status=None):
        target_incident = Incidents.query.filter_by(id=incident_id).first()
        if target_incident is None:
            return None
        # Handle image update
        if new_image and user_id:
            new_photo_url = update_incident_image_in_gcs(user_id, incident_id, new_image)
            if new_photo_url:
                target_incident.photo_path = new_photo_url  # Update only if upload succeeds

        # Prepare update data
        update_data = {
            "description": description,
            "location": location,
            "status": status,
        }

        # Update only non-None fields
        for key, value in update_data.items():
            if value is not None:
                setattr(target_incident, key, value)

        db.session.commit()
        return target_incident  # Return updated post


    def delete_incident(self, incident_id):
    # Find the incident by ID
        incident = Incidents.query.filter_by(id=incident_id).first()

        if not incident:
            print('no incident found')
            return False

        if incident.photo_path:
            print(delete_incident_folder_from_gcs(incident.user_id, incident.id))

        try:
            db.session.delete(incident)
            db.session.commit()
            return True
        except Exception as e:
            print('exception on deleting incident')
            db.session.rollback()
            return False

    def insert_incident(self, user_id, description, location, photo):
        try:
            incident_entry = Incidents(
                user_id=user_id,
                description=description,
                status='pending',
                location=location
            )

            db.session.add(incident_entry)
            db.session.commit()

            photo_path_gcs = None
            if photo:
                photo_ext = check_image_validity(photo)
                if not photo_ext:
                    return {"message": "Failed to save image. image not valid"}, 400  # Return error if image save failed
                photo_path_gcs = generate_gcs_incident_image_path(
                    user_id=user_id,
                    incident_id=incident_entry.id,
                    image_ext=photo_ext
                    )
                photo.seek(0)
                print(upload_image_to_gcs(photo, photo_path_gcs))
                if not photo_path_gcs:
                    return {"message": "Failed to save image."}, 500  # Return error if image save failed
            else:
                photo_path_gcs = None
            
            incident_entry.photo_path = photo_path_gcs

            db.session.commit()
            return incident_entry
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            print(f"Error inserting incident: {e}")  # Log the error
            return None  # Return None to indicate failure
        
    def get_all_incidents_dict(self):
    # Perform the query joining Incidents with Users
        query = Incidents.query\
            .join(Users, Incidents.user_id == Users.id)\
            .order_by(Incidents.date_created.desc())\
            .add_entity(Users)\
            .all()

        # Convert query result to list of dictionaries
        incidents_list = []
        for incident, user in query:
            result = {
                'incident_id': incident.id,
                'incident_description': incident.description,
                'incident_status': incident.status,
                'incident_location': incident.location,
                'incident_photo_path': incident.photo_path if incident.photo_path else None,
                'incident_date_created': incident.date_created.isoformat(),
                'user_id': user.id,
                'user_firstname': user.firstname,
                'user_middlename': user.middlename,
                'user_lastname': user.lastname,
            }
            incidents_list.append(result)

        return incidents_list

            