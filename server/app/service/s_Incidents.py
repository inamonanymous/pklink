from app.ext import db
from app.model.m_Incidents import Incidents
from app.model.m_Users import Users
from app.service.s_functions import generate_gcs_incident_image_path, upload_image_to_gcs, check_image_validity

class IncidentsService:
    def delete_incident(self, incident_id):
    # Find the incident by ID
        incident = Incidents.query.filter_by(id=incident_id).first()

        if not incident:
            print('no incident found')
            False

        try:
            db.session.delete(incident)
            db.session.commit()
            True
        except Exception as e:
            print('exception on deleting incident')
            db.session.rollback()
            False



    def insert_incident(self, user_id, description, location, photo):
        try:
            incident_entry = Incidents(
                user_id=user_id,
                description=description,
                status='pending',
                location=location
            )

            photo_path_gcs = None
            if photo:
                photo_ext = check_image_validity(photo)
                if not photo_ext:
                    return {"message": "Failed to save image. image not valid"}, 400  # Return error if image save failed
                photo_path_gcs = generate_gcs_incident_image_path(
                    user_id=user_id,
                    incident_id=incident_entry.id, #warning alert / inserting NONE
                    image_ext=photo_ext
                    )
                if not photo_path_gcs:
                    return {"message": "Failed to save image."}, 500  # Return error if image save failed
            else:
                photo_path_gcs = None

            incident_entry.photo_path = photo_path_gcs

            db.session.add(incident_entry)
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

            