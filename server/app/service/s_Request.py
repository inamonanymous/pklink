from app.model.m_Requests import Requests
from app.model.m_DocumentRequest import DocumentRequests
from app.model.m_HealthSupportRequests import HealthSupportRequests
from app.ext import db

class RequestsService:
    def edit_request_status(seld, request_id, status):
        try:
            target_request = Requests.query.filter_by(id=request_id).first()
            if not target_request:
                return None
            if status is None or status == "":
                return None
            target_request.status=status
            db.session.commit()
            return target_request
        except Exception as e:
            db.session.rollback()
            print(f"Error updating request staus: {e}")
            return None
        

    def edit_document_request(self, request_id, new_request_data, new_document_data):
        try:
            # Fetch the main request from the Requests table
            request = Requests.query.filter_by(id=request_id).first()
            if not request:
                return {"message": "Request not found"}, 404

            # Update editable fields in the Requests table
            if 'status' in new_request_data:
                request.status = new_request_data['status']
            if 'description_text' in new_request_data:
                request.description_text = new_request_data['description_text']
            request.last_modified = db.func.current_datetime()
            # Update document request details in DocumentRequests table
            document_request = DocumentRequests.query.filter_by(request_id=request_id).first()
            if document_request:
                if 'document_type' in new_document_data:
                    document_request.document_type = new_document_data['document_type']
                if 'reason' in new_document_data:
                    document_request.reason = new_document_data['reason']
                if 'additional_info' in new_document_data:
                    document_request.additional_info = new_document_data['additional_info']
                if 'resolved_at' in new_document_data:
                    document_request.resolved_at = new_document_data['resolved_at']

            # Commit changes to the database
            db.session.commit()
            return {"message": "Document request updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error updating document request: {e}")
            return {"message": "Failed to update request"}, 500

    def edit_health_support_request(self, request_id, new_request_data, new_health_support_data):
        try:
            # Fetch the main request from the Requests table
            request = Requests.query.filter_by(id=request_id).first()
            if not request:
                return {"message": "Request not found"}, 404

            # Update editable fields in the Requests table
            if 'status' in new_request_data:
                request.status = new_request_data['status']
            if 'description_text' in new_request_data:
                request.description_text = new_request_data['description_text']
            request.last_modified = db.func.current_datetime()
            # Update health support request details in HealthSupportRequests table
            health_support_request = HealthSupportRequests.query.filter_by(request_id=request_id).first()
            if health_support_request:
                if 'support_type' in new_health_support_data:
                    health_support_request.support_type = new_health_support_data['support_type']
                if 'additional_info' in new_health_support_data:
                    health_support_request.additional_info = new_health_support_data['additional_info']
                if 'resolved_at' in new_health_support_data:
                    health_support_request.resolved_at = new_health_support_data['resolved_at']

            # Commit changes to the database
            db.session.commit()
            return {"message": "Health support request updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Error updating health support request: {e}")
            return {"message": "Failed to update request"}, 500

    def delete_health_support_request_by_request_id(self, request_id):
        try:    
            health_support_request = HealthSupportRequests.query.filter_by(request_id=request_id).first()
            request = Requests.query.filter_by(id=request_id).first()
            db.session.delete(health_support_request)
            db.session.delete(request)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error deleting request: {e}")  # Log the error
            return None
        
    def delete_document_request_by_request_id(self, request_id):
        try:    
            document_request = DocumentRequests.query.filter_by(request_id=request_id).first()
            request = Requests.query.filter_by(id=request_id).first()
            db.session.delete(document_request)
            db.session.delete(request)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error deleting request: {e}")  # Log the error
            return None
    
    
    def get_all_requests_list(self):
        try:
            requests_obj = Requests.query.order_by(Requests.date_created.asc()).all()
            requests_list_dict = [{
                "user_id": i.user_id,
                "request_type": i.request_type,
                "status": i.status,
                "description_text": i.description_text,
                "date_created": i.date_created.isoformat(),
                "last_modified": i.last_modified.isoformat(),
            } for i in requests_obj]
            return requests_list_dict
        except Exception as e:
            print(f"Error getting request: {e}")  # Log the error
            return None

    def get_all_health_support_requests_by_user(self, user_id):
        try:
            # Query to get health support requests for a specific user
            requests_list = db.session.query(
                HealthSupportRequests.id.label("health_request_id"),
                HealthSupportRequests.request_id,
                Requests.user_id,
                Requests.status,
                Requests.description_text,
                HealthSupportRequests.support_type,
                HealthSupportRequests.additional_info,
                HealthSupportRequests.resolved_at,
                Requests.date_created,
                Requests.last_modified
            ).join(Requests, HealthSupportRequests.request_id == Requests.id)\
            .filter(Requests.user_id == user_id)\
            .order_by(HealthSupportRequests.resolved_at.asc())\
            .all()

            # Convert the result into a list of dictionaries
            return [{
                "health_request_id": row.health_request_id,
                "request_id": row.request_id,
                "user_id": row.user_id,
                "request_type": "Health Support Request",
                "status": row.status,
                "description_text": row.description_text,
                "support_type": row.support_type,
                "additional_info": row.additional_info,
                "resolved_at": row.resolved_at.isoformat() if row.resolved_at else None,
                "date_created": row.date_created.isoformat(),
                "last_modified": row.last_modified.isoformat(),
            } for row in requests_list]

        except Exception as e:
            print(f"Error retrieving health support requests for user {user_id}: {e}")
            return []


    def get_all_health_support_requests_list(self):
        try:
            # Query to join HealthSupportRequests with Requests using request_id
            requests_list = db.session.query(
                HealthSupportRequests.id.label("health_request_id"),
                HealthSupportRequests.request_id,
                Requests.user_id,
                Requests.status,
                Requests.description_text,
                HealthSupportRequests.support_type,
                HealthSupportRequests.additional_info,
                HealthSupportRequests.resolved_at,
                Requests.date_created,
                Requests.last_modified
            ).join(Requests, HealthSupportRequests.request_id == Requests.id)\
            .order_by(HealthSupportRequests.resolved_at.asc())\
            .all()

            # Convert the result into a list of dictionaries
            requests_list_dict = [{
                "health_request_id": row.health_request_id,
                "request_id": row.request_id,
                "user_id": row.user_id,
                "request_type": "Health Support Request",
                "status": row.status,
                "description_text": row.description_text,
                "support_type": row.support_type,
                "additional_info": row.additional_info,
                "resolved_at": row.resolved_at.isoformat() if row.resolved_at else None,
                "date_created": row.date_created.isoformat(),
                "last_modified": row.last_modified.isoformat(),
            } for row in requests_list]

            return requests_list_dict
        except Exception as e:
            print(f"Error getting health support requests: {e}")
            return None

        
    def get_all_document_requests_by_user(self, user_id):
        try:
            # Query to filter document requests for a specific user
            requests_list = db.session.query(
                DocumentRequests.id.label("document_request_id"),
                DocumentRequests.request_id,
                Requests.user_id,
                Requests.status,
                Requests.description_text,
                DocumentRequests.document_type,
                DocumentRequests.reason,
                DocumentRequests.additional_info,
                DocumentRequests.resolved_at,
                DocumentRequests.date_created.label("document_date_created"),
                Requests.date_created,
                Requests.last_modified
            ).join(Requests, DocumentRequests.request_id == Requests.id)\
            .filter(Requests.user_id == user_id)\
            .order_by(DocumentRequests.date_created.asc())\
            .all()

            # Convert the result into a list of dictionaries
            requests_list_dict = [{
                "document_request_id": row.document_request_id,
                "request_id": row.request_id,
                "user_id": row.user_id,
                "request_type": "Document Request",
                "status": row.status,
                "description_text": row.description_text,
                "document_type": row.document_type,
                "reason": row.reason,
                "additional_info": row.additional_info,
                "resolved_at": row.resolved_at.isoformat() if row.resolved_at else None,
                "document_date_created": row.document_date_created.isoformat(),
                "date_created": row.date_created.isoformat(),
                "last_modified": row.last_modified.isoformat(),
            } for row in requests_list]

            return requests_list_dict

        except Exception as e:
            print(f"Error fetching document requests for user {user_id}: {e}")
            return []


    def get_all_document_requests_list(self):
        try:
            # Query to join DocumentRequests with Requests using request_id
            requests_list = db.session.query(
                DocumentRequests.id.label("document_request_id"),
                DocumentRequests.request_id,
                Requests.user_id,
                Requests.status,
                Requests.description_text,
                DocumentRequests.document_type,
                DocumentRequests.reason,
                DocumentRequests.additional_info,
                DocumentRequests.resolved_at,
                DocumentRequests.date_created.label("document_date_created"),
                Requests.date_created,
                Requests.last_modified
            ).join(Requests, DocumentRequests.request_id == Requests.id)\
            .order_by(DocumentRequests.date_created.asc())\
            .all()

            # Convert the result into a list of dictionaries
            requests_list_dict = [{
                "document_request_id": row.document_request_id,
                "request_id": row.request_id,
                "user_id": row.user_id,
                "request_type": "Document Request",
                "status": row.status,
                "description_text": row.description_text,
                "document_type": row.document_type,
                "reason": row.reason,
                "additional_info": row.additional_info,
                "resolved_at": row.resolved_at.isoformat() if row.resolved_at else None,
                "document_date_created": row.document_date_created.isoformat(),
                "date_created": row.date_created.isoformat(),
                "last_modified": row.last_modified.isoformat(),
            } for row in requests_list]

            return requests_list_dict
        except Exception as e:
            print(f"Error getting document requests: {e}")
            return None
        
    def insert_request(self, user_id, request_type, description_text):
        try:
            new_request = Requests(
                user_id=user_id,
                request_type=request_type,
                status='pending',
                description_text=description_text
            )
            db.session.add(new_request)
            db.session.commit()
            return new_request
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            print(f"Error inserting request: {e}")  # Log the error
            return None  # Return None to indicate failure

    def insert_document_request(self, user_id, document_type, additional_info, reason, description_text):
        try:
            new_request = self.insert_request(user_id, 'document_request', description_text)
            new_doc_request = DocumentRequests(
                request_id=new_request.id,
                document_type=document_type,
                additional_info=additional_info,
                reason=reason
            )
            db.session.add(new_doc_request)
            db.session.commit()
            return new_doc_request
        except Exception as e:
            db.session.rollback()
            print(f'Error inserting document request {e}')
            return None
        
    def insert_health_support_request(self, user_id, support_type, additional_info, description_text):
        try:
            new_request = self.insert_request(user_id, 'health_support', description_text)
            new_health_support_request = HealthSupportRequests(
                request_id = new_request.id,
                support_type=support_type,
                additional_info=additional_info
            )
            db.session.add(new_health_support_request)
            db.session.commit()
            return new_health_support_request
        except Exception as e:
            db.session.rollback()
            print(f'Error inserting health support request {e}')
            return None
        