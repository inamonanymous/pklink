from app.resource import Resource, abort, reqparse, session, request, VUS_ins, ES_ins, US_ins, UDS_ins, VS_ins, BSS_ins, PS_ins, R_ins, I_ins
from .r_functions import require_user_session, get_current_user_username, get_current_user_privilege

#--------------- Variable Values ---------------#
""" 
    AS_ins = <AdminService> object instance
    BSS_ins = <BrgyStreetService> object instance
    RTS_ins = <ResidentTypeService> object instance
    UDS_ins = <UserDetailsService> object instance
    US_ins = <UserService> object instance
    VUS_ins = <VerifiedUsersService> object instance
    VS_ins = <VillagesService> object instance
    PS_ins = <PostsService> object instance
    R_ins = <RequestsService> object instance
    I_ins = <IncidentsService> object instance
"""

#User authentication api
class UserAuth(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_username" , type=str, required=True, help='Username is required')
    post_req.add_argument("req_user_password" , type=str, required=True, help='Password is required')

    #DELETE request for user logout
    @require_user_session
    def delete(self):
        session.pop('user_username')
        abort(410, message="Logged out")

    #POST request for user login
    def post(self): 
        args = self.post_req.parse_args()
        current_user = US_ins.check_login(
            args['req_user_username'], 
            args['req_user_password']
        )
        #check if no user returned
        if current_user is None:
            abort(406, message="Wrong credentials")
        session['user_username'] = current_user.username
        return {"login_mode": "user"}, 200
    
    #GET request for user information
    @require_user_session
    def get(self):
        current_username = get_current_user_username()
        user = US_ins.get_user_dict_by_username(current_username)
        user_details = UDS_ins.get_user_details_dict_by_user_id(user['user_id'])
        user_and_user_details_combined = {
            'res_user_data': user,
            'res_user_details_data': user_details
        }
        return user_and_user_details_combined, 200


#User registration
class UserRegistration(Resource):

    #POST request for registering account
    def post(self):
        if 'req_user_selfie_photo_path' not in request.files or 'req_user_gov_id_photo_path' not in request.files:
            return {"error": "Both selfie and government ID are required."}, 400

        args = request.form
        user_photo = request.files.get('req_user_photo_path', None)  # Set to None if not provided
            
        
        selfie = request.files['req_user_selfie_photo_path']
        gov_id = request.files['req_user_gov_id_photo_path']
        print("display photo: ", user_photo)
        print("selfie: ", selfie)
        print("government : ", gov_id)
        user_data = {
            'username': args['req_user_username'],
            'password': args['req_user_password'],
            'firstname': args['req_user_firstname'],
            'middlename': args['req_user_middlename'],
            'lastname': args['req_user_lastname'],
            'suffix': args['req_user_suffix'],
            'gender': args['req_user_gender']
        }
        details_data = {
            'village_id': args['req_user_village_id'],
            'brgy_street_id': args['req_user_brgy_street_id'],
            'house_number': args['req_user_house_number'],
            'lot_number': args['req_user_lot_number'],
            'block_number': args['req_user_block_number'],
            'village_street': args['req_user_village_street'],
            'email_address': args['req_user_email_address'],
            'phone_number': args['req_user_phone_number'],
            'phone_number2': args['req_user_phone_number2'],
        }
        if not US_ins.insert_user_and_details(user_data, details_data, user_photo, selfie, gov_id):
            return {"message": "registration unsuccessful"}, 406
        return {"message": "registration success"}, 201

class Incident(Resource):
    @require_user_session
    def post(self):
        args = request.form
        incident_photo = request.files.get('req_incident_photo')
        current_user = US_ins.get_user_dict_by_username(get_current_user_username())
        if not all([
            args.get('req_description') and args['req_description'].strip(),
            args.get('req_location') and args['req_location'].strip()
        ]):
            return {"message": "All fields are required and cannot be empty"}, 400
        if not I_ins.insert_incident(
            user_id=current_user['user_id'],
            description=args['req_description'],
            location=args['req_location'],
            photo=incident_photo
        ):
            return {"message": "error inserting incident"}, 401
        return {"message": "incident inserted successfully"}, 200


class DocumentRequest(Resource):
    @require_user_session
    def post(self):
        post_req = reqparse.RequestParser()
        post_req.add_argument("req_document_type" , type=str, required=True, help='Document Type is required')
        post_req.add_argument("req_additional_info" , type=str, required=False)
        post_req.add_argument("req_reason" , type=str, required=True, help='Reason is required')
        post_req.add_argument("req_description" , type=str, required=False)

        args = post_req.parse_args()
        if not all([
            args.get('req_document_type') and args['req_document_type'].strip(),
            args.get('req_additional_info') and args['req_additional_info'].strip(),
            args.get('req_reason') and args['req_reason'].strip(),
            args.get('req_description') and args['req_description'].strip()
        ]):
            return {"message": "All fields are required and cannot be empty"}, 400
        current_user = US_ins.get_user_dict_by_username(get_current_user_username())

        if not R_ins.insert_document_request(
            current_user['user_id'],
            args['req_document_type'],
            args['req_additional_info'],
            args['req_reason'],
            args['req_description'],
        ):
            return {"message": "document request unsuccessful"}, 406
        return {"message": "added document request"}, 201

class HealthSupportRequest(Resource):
    @require_user_session
    def post(self):
        post_req = reqparse.RequestParser()
        post_req.add_argument("req_support_type" , type=str, required=True, help='Support Type is required')
        post_req.add_argument("req_additional_info" , type=str, required=False)
        post_req.add_argument("req_description" , type=str, required=False) 

        if not all([
            args.get('req_support_type') and args['req_support_type'].strip(),
            args.get('req_additional_info') and args['req_additional_info'].strip(),
            args.get('req_description') and args['req_description'].strip()
        ]):
            return {"message": "All fields are required and cannot be empty"}, 400

        current_user = US_ins.get_user_dict_by_username(get_current_user_username())
        args = post_req.parse_args()
        if not R_ins.insert_health_support_request(
            current_user['user_id'],
            args['req_support_type'],
            args['req_additional_info'],
            args['req_description']
        ):
            return {"message": "health support request unsuccessful"}, 406
        return {"message": "added health support request"}, 201


class EventsData(Resource):
    def get(self):
        data = ES_ins.get_all_events_dict()
        return data, 200
    
class PostsData(Resource):
    def get(self):
        data = PS_ins.get_all_posts_dict()
        return data, 200

class RegisteredVillages(Resource):
    def get(self):
        data = VS_ins.get_all_villages_list()
        return data, 200
    
class RegisteredBrgyStreets(Resource):
    def get(self):
        data = BSS_ins.get_all_streets_list_obj()
        return data, 200

#User check session
class CheckSession(Resource):
    @require_user_session
    def get(self):
        data = get_current_user_privilege()
        if data is None: 
            return {"message": "not logged in"}, 406
        return data, 200
