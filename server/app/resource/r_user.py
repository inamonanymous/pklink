from app.resource import Resource, abort, reqparse, session, request, VUS_ins, AS_ins, US_ins, UDS_ins, VS_ins, BSS_ins
from .functions import require_user_session, get_current_user_username, get_current_user_privilege

#--------------- Variable Values ---------------#
""" 
    AS_ins = <AdminService> object instance
    BSS_ins = <BrgyStreetService> object instance
    RTS_ins = <ResidentTypeService> object instance
    UDS_ins = <UserDetailsService> object instance
    US_ins = <UserService> object instance
    VUS_ins = <VerifiedUsersService> object instance
    VS_ins = <VillagesService> object instance
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

        verified_users = VUS_ins.get_verified_user_obj_by_username(args['req_user_username'])            
        admin_users = AS_ins.get_admin_by_username(args['req_user_username'])            
        #check if user not in <Verified Table> or <Admin Table>
        if not (verified_users or admin_users):
            abort(401, message="Account not verified")
            
        session['user_username'] = current_user.username
        user_data = {
            "res_user_username": current_user.username,
            "res_user_password": current_user.password,
            "session": session.get('user_username')
        }
        return user_data, 200
    
    #GET request for user information
    @require_user_session
    def get(self):
        current_username = get_current_user_username()
        user = US_ins.get_user_dict_by_username(current_username)
        user_details = UDS_ins.get_user_details_dict_by_username(current_username)
        user_privelege = get_current_user_privilege()
        user_and_user_details_combined = {
            'res_user_data': user,
            'res_user_details_data': user_details,
            'res_user_resident_name': user_privelege['type_name'] if user_privelege is not None else 'Verified'
        }

        return user_and_user_details_combined, 200


#User registration
class UserRegistration(Resource):

    #POST request for registering account
    def post(self):
        if 'req_user_selfie_photo_path' not in request.files or 'req_user_gov_id_photo_path' not in request.files:
            return {"error": "Both selfie and government ID are required."}, 400

        args = request.form
        user_photo = request.files['req_user_photo_path']
        selfie = request.files['req_user_selfie_photo_path']
        gov_id = request.files['req_user_gov_id_photo_path']

        user_data = {
            'username': args['req_user_username'],
            'password': args['req_user_password'],
            'firstname': args['req_user_firstname'],
            'middlename': args['req_user_middlename'],
            'lastname': args['req_user_lastname'],
            'suffix': args['req_user_suffix'],
            'gender': args['req_user_gender'],
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
        user_username = get_current_user_username()        
        isAuth = bool()
        message = "Not logged in"
        if user_username:
            message = "Logged in"
            isAuth = True
        else:
            isAuth = False
        data = {
            "message": message,
            "is_authenticated": isAuth
        }
        return data
