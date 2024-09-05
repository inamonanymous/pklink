from app.resource import Resource, abort, reqparse, session
from .functions import require_user_session, get_current_user_username
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_Admin import Admin
from app.model.m_UserDetails import UserDetails
from app.model.m_BrgyStreets import BrgyStreets
from app.model.m_Villages import Villages
from app.ext import cross_origin

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
        current_user = Users.check_login(
            args['req_user_username'], 
            args['req_user_password']
        )
        #check if no user returned
        if current_user is None:
            abort(406, message="Wrong credentials")

        verified_users = VerifiedUsers.get_verified_user_by_username(args['req_user_username'])            
        admin_users = Admin.get_admin_by_username(args['req_user_username'])            
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
        user = Users.get_user_by_username(current_username)
        user_details = UserDetails.get_user_details_by_username(current_username)
        user_and_user_details_combined = {
            'res_user_data': user,
            'res_user_details_data': user_details
        }

        return user_and_user_details_combined, 200


#User registration
class UserRegistration(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_username" , type=str, required=True, help='username is required')
    post_req.add_argument("req_user_password" , type=str, required=True, help='Password is required')
    post_req.add_argument("req_user_firstname" , type=str, required=True, help='Firstname is required')
    post_req.add_argument("req_user_middlename" , type=str, required=True, help='Middlename is required')
    post_req.add_argument("req_user_lastname" , type=str, required=True, help='Lastname is required')
    post_req.add_argument("req_user_suffix" , type=str, required=True, help='Lastname is required')
    post_req.add_argument("req_user_gender" , type=str, required=False, help='Lastname is required')
    post_req.add_argument("req_user_photo_path" , type=str, required=False, help='Lastname is required')

    post_req.add_argument("req_user_house_number", type=str, required=True)
    post_req.add_argument("req_user_brgy_street_id", type=str, required=False)
    post_req.add_argument("req_user_village_id", type=str, required=False)
    post_req.add_argument("req_user_village_street", type=str, required=False)
    post_req.add_argument("req_user_lot_number", type=str, required=False)
    post_req.add_argument("req_user_block_number", type=str, required=False)
    post_req.add_argument("req_user_email_address", type=str, required=True)
    post_req.add_argument("req_user_phone_number", type=str, required=True)
    post_req.add_argument("req_user_phone_number2", type=str, required=False)
    post_req.add_argument("req_user_selfie_photo_path", type=str, required=True)
    post_req.add_argument("req_user_gov_id_photo_path", type=str, required=True)

    #POST request for registering account
    def post(self):
        args = self.post_req.parse_args()
        user_entry = Users.insert_user(
            username = args['req_user_username'],
            password = args['req_user_password'],
            firstname = args['req_user_firstname'],
            middlename = args['req_user_middlename'],
            lastname = args['req_user_lastname'],
            suffix = args['req_user_suffix'],
            gender = args['req_user_gender'],
            photo_path = args['req_user_photo_path']
        )
        if not user_entry:
            abort(409, message="username already exists")

        user_details_entry = UserDetails.insert_user_details(
            user_username=args['req_user_username'],
            village_id=args['req_user_village_id'],
            brgy_street_id=args['req_user_brgy_street_id'],
            house_number=args['req_user_house_number'],
            lot_number=args['req_user_lot_number'],
            block_number=args['req_user_block_number'],
            village_street=args['req_user_village_street'],
            email_address=args['req_user_email_address'],
            phone_number=args['req_user_phone_number'],
            phone_number2=args['req_user_phone_number2'],
            selfie_photo_path=args['req_user_selfie_photo_path'],
            gov_id_photo_path=args['req_user_gov_id_photo_path']
        )

        if not user_details_entry:
            abort(409, message="user failed to register")
        
        return {"message": "registration success"}, 201

class RegisteredVillages(Resource):
    def get(self):
        data = Villages.get_all_villages()
        return data, 200
    
class RegisteredBrgyStreets(Resource):
    def get(self):
        data = BrgyStreets.get_all_streets()
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
