from app.resource import Resource, abort, reqparse, request, VUS_ins, AS_ins, US_ins, UDS_ins, PS_ins, ES_ins, R_ins, I_ins, session
from .r_functions import require_user_session, get_current_user_privilege, get_current_user_username
from datetime import datetime, timezone


#--------------- Variable Values ---------------#
""" 
    VUS_ins = <VerifiedUsersService> object instance
    AS_ins = <AdminService> object instance
    US_ins = <UserService> object instance
    UDS_ins = <UserDetailsService> object instance
    PS_ins = <PostService> object instance
    R_ins = <RequestService> object instance
"""

class UnverifiedUserData(Resource):
    @require_user_session
    #GET request for fetching all <Unverified Users>
    def get(self):
        users = VUS_ins.get_all_unverified_users_list_obj()
        return users

#User verification
class UserVerification(Resource):
    
    #DELETE request for deleting user from verified table
    #this user still exists on users table
    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['control_accounts']:
            abort(401, message="current user not allowed")    
        delete_parser = reqparse.RequestParser()
        delete_parser.add_argument("req_user_id", type=str, required=True, help="username is required")
        user_id = request.args.get('req_user_id')
        if AS_ins.get_admin_by_user_id(user_id):
            abort(409, message="target user is listead as admin")    
        if not VUS_ins.delete_verified_user(user_id):
            abort(404, message="target user not found")    
        return {"message": "deleting verified user success"}, 201

    #PUT request for inserting of user to verified table 
    @require_user_session
    def put(self):
        put_parser = reqparse.RequestParser()
        put_parser.add_argument("req_user_id", type=str, required=True, help="user id is required")
        args = put_parser.parse_args()
        print(f"hellow owrld: {args}")
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['control_accounts']:
            abort(401, message="current user not allowed") 
        user_id = args['req_user_id']
        user_entry = VUS_ins.insert_verified_user(user_id)
        if user_entry is None:
            abort(409, message="It's either user already verified or user id is unknown")
        return {"message": "verification success"}, 201
    
    #GET request for fetching all <Verified Users>
    @require_user_session
    def get(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['view_accounts']:
            abort(401, message="current user not allowed") 

        verified_users = VUS_ins.get_all_verified_users_list_obj()
        return verified_users
    
    #PATCH request for individually fetching user information by username
    @require_user_session
    def patch(self):
        patch_parser = reqparse.RequestParser()
        patch_parser.add_argument("req_user_username", type=str, required=True, help="username is required")
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['view_accounts']:
            abort(401, message="current user not allowed") 
        args = patch_parser.parse_args()
        user_username = args['req_user_username']
        user = US_ins.get_user_dict_by_username(user_username)
        if user is None:
            return {"message": "invalid! no user found"}, 404
        user_details = UDS_ins.get_user_details_dict_by_user_id(user['user_id'])
        if user_details is None:
            return {"message": "invalid! no userdetails found"}, 404
        user['user_details_obj'] = user_details
        return user
        
class PostManagement(Resource):
    @require_user_session
    def put(self):
        current_user_privilege = get_current_user_privilege()
        if current_user_privilege is None:
            abort(406, message="Current user not found")    
        if not current_user_privilege['manage_post']:
            abort(401, message="Current user not allowed")    

        args = request.form

        post_photo = request.files.get('req_post_photo')
        if args is None:
            return {"message": "Invalid request"}, 400

        user = US_ins.get_user_dict_by_username(get_current_user_username())

        post_id = args.get('req_post_id')
        if not post_id:
            return {"message": "Post ID is required"}, 400

        updated_post = PS_ins.edit_post(
            post_id=post_id,
            title=args.get('req_post_title'),
            content=args.get('req_post_content'),
            new_image=post_photo,
            user_id=user['user_id']
        )

        if not updated_post:
            return {"message": "Post not found"}, 404

        return {"message": "Post updated successfully"}, 200


    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['manage_post']:
            abort(401, message="current user not allowed")    

        post_id = request.args.get('req_post_id')
        
        status = PS_ins.delete_post(post_id)
        if not status:
            return {"message": "failed to delete"}, 405
        
        return {"post deleted": "post"}, 201
    
    
    @require_user_session
    def post(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['add_post']:
            abort(401, message="current user not allowed")    

        args = request.form
        post_photo = request.files.get('req_post_photo')
        print(args)
        if args is None:
            return {"message": "invalid request"}, 400
        user = US_ins.get_user_dict_by_username(session.get('user_username'))
        if user is None:
            return {"message": "invalid! no user found"}, 406
        PS_ins.insert_post(
            title=args['req_post_title'],
            content=args['req_post_content'],
            photo=post_photo,
            created_by=user['user_id']
        )
        return {"post added": "post"}, 200

class EventManagement(Resource):
    @require_user_session
    def put(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_event']:
            abort(401, message="current user not allowed")    

        put_parser = reqparse.RequestParser()
        put_parser.add_argument("req_event_id", type=str, required=True, help="Event ID is required")
        put_parser.add_argument("req_event_title", type=str, required=False)
        put_parser.add_argument("req_event_description", type=str, required=False)
        put_parser.add_argument("req_event_date", type=str, required=False)
        put_parser.add_argument("req_start_time", type=str, required=False)
        put_parser.add_argument("req_end_time", type=str, required=False)
        put_parser.add_argument("req_location", type=str, required=False)
        
        args = put_parser.parse_args()

        # Call edit_event method from EventService
        updated_event = ES_ins.edit_event(
            args["req_event_id"],
            title=args.get("req_event_title"),
            description=args.get("req_event_description"),
            event_date=args.get("req_event_date"),
            start_time=args.get("req_start_time"),
            end_time=args.get("req_end_time"),
            location=args.get("req_location")
        )
        print(args.get('req_event_title'))
        print(updated_event.title)
        if not updated_event:
            return {"message": "Event not found"}, 404
        
        return {"message": "Event updated successfully"}, 200



    @require_user_session
    def post(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_event']:
            abort(401, message="current user not allowed")    

        post_parser = reqparse.RequestParser()
        post_parser.add_argument('req_event_title', type=str, required=True, help="Title is required")
        post_parser.add_argument('req_event_description', type=str, required=True, help="Description is required")
        post_parser.add_argument('req_event_date', type=str, required=True, help="Date is required (YYYY-MM-DD)")
        post_parser.add_argument('req_event_start_time', type=str, required=True, help="Start time is required (HH:MM)")
        post_parser.add_argument('req_event_end_time', type=str, required=True, help="End time is required (HH:MM)")
        post_parser.add_argument('req_event_location', type=str, required=True, help="Location is required")
        
        args = post_parser.parse_args()

        try:
            event_date = datetime.strptime(args['req_event_date'], '%Y-%m-%d').date()  # Convert to date object
        except ValueError:
            print("hello date")
            return {"message": "Invalid date format. Use YYYY-MM-DD."}, 400

        # Validate and parse the start time
        try:
            start_time = datetime.strptime(args['req_event_start_time'], '%H:%M').time()  # Convert to time object
        except ValueError:
            print("hello time")
            return {"message": "Invalid start time format. Use HH:MM."}, 400

        # Validate and parse the end time
        try:
            end_time = datetime.strptime(args['req_event_end_time'], '%H:%M').time()  # Convert to time object
        except ValueError:
            print("hello time")
            return {"message": "Invalid end time format. Use HH:MM."}, 400

        print(f"args {args}")
        print(f"event date: {event_date}")
        print(f"start time: {start_time}")
        print(f"end time: {end_time}")
        user = US_ins.get_user_dict_by_username(session.get('user_username'))

        if not ES_ins.insert_event(
            title=args['req_event_title'],
            description=args['req_event_description'],
            event_date=args['req_event_date'],
            start_time=args['req_event_start_time'],
            end_time=args['req_event_end_time'],
            location=args['req_event_location'],
            created_by=user['user_id']
            
        ):
            return {"message": "event insertion error"}, 405
            

        return {"message": "insert complete"}, 201

    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_event']:
            abort(401, message="current user not allowed")    

        event_id = request.args.get('req_event_id')
        if event_id is None:
            return {'message': 'event not found'}, 404
            
        if not ES_ins.delete_event(event_id):
            return {'message': 'deletion unsuccessful'}, 405
        return {'message': 'deletion successful'}, 200
    

class DocumentRequestManagement(Resource):
    @require_user_session
    def get(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_request']:
            abort(401, message="current user not allowed")    

        data = R_ins.get_all_document_requests_list()
        return data, 200

    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_request']:
            abort(401, message="current user not allowed")            

        request_id = request.args.get('req_request_id')
        if request_id is None:
            return {'message': 'request not found'}, 404
        if not R_ins.delete_document_request_by_request_id(request_id):
            return {'message': 'deletion unuccessful'}, 405
        return {'message': 'deletion successful'}, 200

    @require_user_session
    def put(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_request']:
            abort(401, message="current user not allowed")    

        put_parser = reqparse.RequestParser()
        put_parser.add_argument('req_request_id', type=str, required=True, help="Request ID is required")
        put_parser.add_argument('req_status', type=str, choices=('pending', 'in_progress', 'completed'), help="Invalid status")
        put_parser.add_argument('req_description_text', type=str, help="Description is required")
        put_parser.add_argument('req_document_type', type=str, choices=('cedula', 'brgy_certificate', 'brgy_clearance'), help="Invalid document type")
        put_parser.add_argument('req_reason', type=str, help="Reason is required")
        put_parser.add_argument('req_additional_info', type=str, help="Additional info")
        put_parser.add_argument('req_resolved_at', type=str, help="Resolved at datetime (YYYY-MM-DD HH:MM:SS)")

        try:
            args = put_parser.parse_args()

            request_data = {
                "request_id": args['req_request_id'],
                "status": args['req_status'],
                "description_text": args['req_description_text'],
            }

            document_data = {
                "document_type": args['req_document_type'],
                "reason": args['req_reason'],
                "additional_info": args['req_additional_info'],
                "resolved_at": args['req_resolved_at']
            }

            result = R_ins.edit_document_request(request_data['request_id'], request_data, document_data)
            return result

        except Exception as e:
            print(f"Error processing request update: {e}")
            return {"message": "Failed to process update"}, 500
    
    @require_user_session
    def patch(self):
        patch_parser = reqparse.RequestParser()
        patch_parser.add_argument('req_request_id', type=str, required=True, help="Request ID is required")
        patch_parser.add_argument('req_request_status', type=str, required=True, help="Request Status is required")
        args = patch_parser.parse_args()
        print(args)
        result = R_ins.edit_request_status(
            args['req_request_id'],
            args['req_request_status']
        )
        if not result:
            return {"message": "failed to edit request status"}, 400
        return {"message": "edit request status succcesful"}, 200

class HealthSupportManagement(Resource):
    @require_user_session
    def get(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_request']:
            abort(401, message="current user not allowed")    

        data = R_ins.get_all_health_support_requests_list()
        return data, 200
    
    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_request']:
            abort(401, message="current user not allowed")    

        request_id = request.args.get('req_request_id')
        if request_id is None:
            return {'message': 'request not found'}, 404
        if not R_ins.delete_health_support_request_by_request_id(request_id):
            return {'message': 'deletion unuccessful'}, 405
        return {'message': 'deletion successful'}, 200

    @require_user_session
    def put(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['manage_request']:
            abort(401, message="current user not allowed")    

        put_health_support_parser = reqparse.RequestParser()
        put_health_support_parser.add_argument('req_request_id', type=str, required=True, help="Request ID is required")
        put_health_support_parser.add_argument('req_status', type=str, choices=('pending', 'in_progress', 'completed'), help="Invalid status")
        put_health_support_parser.add_argument('req_description_text', type=str, help="Description is required")
        put_health_support_parser.add_argument('req_support_type', type=str, help="Support type is required")
        put_health_support_parser.add_argument('req_additional_info', type=str, help="Additional info")
        put_health_support_parser.add_argument('req_resolved_at', type=str, help="Resolved at datetime (YYYY-MM-DD HH:MM:SS)")

        try:
            args = put_health_support_parser.parse_args()

            request_data = {
                "request_id": args['req_request_id'],
                "status": args['req_status'],
                "description_text": args['req_description_text'],
            }

            health_support_data = {
                "support_type": args['req_support_type'],
                "additional_info": args['req_additional_info'],
                "resolved_at": args['req_resolved_at']
            }

            result = R_ins.edit_health_support_request(request_data['request_id'], request_data, health_support_data)
            return result

        except Exception as e:
            print(f"Error processing request update: {e}")
            return {"message": "Failed to process update"}, 500

    @require_user_session
    def patch(self):
        patch_parser = reqparse.RequestParser()
        patch_parser.add_argument('req_request_id', type=str, required=True, help="Request ID is required")
        patch_parser.add_argument('req_request_status', type=str, required=True, help="Request Status is required")
        args = patch_parser.parse_args()
        print(args)
        result = R_ins.edit_request_status(
            args['req_request_id'],
            args['req_request_status']
        )
        if not result:
            return {"message": "failed to edit request status"}, 400
        return {"message": "edit request status succcesful"}, 200

class IncidentManagement(Resource):
    def get(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['partial_admin']:
            abort(401, message="current user not allowed")      

        data = I_ins.get_all_incidents_dict()
        return data, 200
    
    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['partial_admin']:
            abort(401, message="current user not allowed")     

        incident_id = request.args.get('req_incident_id')
        if incident_id is None:
            return {'message': 'request not found'}, 404
        if not I_ins.delete_incident(incident_id):
            return {'message': 'deletion unuccessful'}, 405
        return {'message': 'deletion successful'}, 200
    
    @require_user_session
    def put(self):
        current_user_privilege = get_current_user_privilege()
        if current_user_privilege is None:
            abort(406, message="Current user not found")    
        if not current_user_privilege['partial_admin']:
            abort(401, message="Current user not allowed")    
        
        args = request.form

        incident_photo = request.files.get('req_incident_photo')
        if args is None:
            return {"message": "invalid request"}, 400
                
        user = US_ins.get_user_dict_by_username(get_current_user_username())

        updated_incident = I_ins.edit_incident(
            incident_id=args['req_incident_id'],
            user_id=user['user_id'],
            description=args['req_description'],
            location=args['req_location'],
            new_image=incident_photo
        )

        if not updated_incident:
            return {"message": "incident not found"}, 404
        
        return {"message": "Incident updated successfully"}, 200
    
    @require_user_session
    def patch(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(406, message="current user not found")    
        if not current_user_privelege['partial_admin']:
            abort(401, message="current user not allowed")  
        patch_parser = reqparse.RequestParser()
        patch_parser.add_argument('req_incident_id', type=str, required=True, help="Incident id is required")
        patch_parser.add_argument('req_incident_status', type=str, required=True, help="Incident Status is required")
        args = patch_parser.parse_args()
        result = I_ins.edit_incident_status(
            args['req_incident_id'],
            args['req_incident_status']
        )
        if not result:
            return {"message": "failed to edit incident status"}, 400
        return {"message": "edit request status successful"}, 200