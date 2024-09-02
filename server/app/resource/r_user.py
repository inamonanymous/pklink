from app.resource import Resource, abort, reqparse, session
from .functions import require_user_session
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_Admin import Admin
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
        return {"message": "registration success"}, 201

#User check session
class CheckSession(Resource):
    def get(self):
        user_username = session.get('user_username', "")
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
