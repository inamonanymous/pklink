from app.ext import db
from app.model.m_Incidents import Incidents
from app.service.s_functions import generate_gcs_incident_image_path, upload_image_to_gcs, check_image_validity

class IncidentsService:
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
                    incident_id=incident_entry.id,
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
            