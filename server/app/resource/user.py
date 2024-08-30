from flask_restful import Resource, abort, reqparse
from flask import session
from app.model import Users, VerifiedUsers, Admin
from .functions import require_user_session
        
#User authentication api
class UserAuth(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_email" , type=str, required=True, help='Email Address is required')
    post_req.add_argument("req_user_password" , type=str, required=True, help='Password is required')

    #DELETE request for user logout
    @require_user_session
    def delete(self):
        session.pop('user_email')
        abort(410, message="Logged out")

    #POST request for user login
    def post(self): 
        args = self.post_req.parse_args()
        current_user = Users.check_login(
            args['req_user_email'], 
            args['req_user_password']
        )
        #check if no user returned
        if current_user is None:
            abort(406, message="Wrong credentials")

        verified_users = VerifiedUsers.get_verified_user_by_email(args['req_user_email'])            
        admin_users = Admin.get_admin_by_email(args['req_user_email'])            
        #check if user not in <Verified Table> or <Admin Table>
        if not (verified_users or admin_users):
            abort(401, message="Account not verified")
            
        session['user_email'] = current_user.email
        user_data = {
            "res_user_email": current_user.email,
            "res_user_password": current_user.password,
            "session": session.get('user_email')
        }
        return user_data, 200

#User registration
class UserRegistration(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_email" , type=str, required=True, help='Email Address is required')
    post_req.add_argument("req_user_password" , type=str, required=True, help='Password is required')
    post_req.add_argument("req_user_firstname" , type=str, required=True, help='Firstname is required')
    post_req.add_argument("req_user_middlename" , type=str, required=True, help='Middlename is required')
    post_req.add_argument("req_user_lastname" , type=str, required=True, help='Lastname is required')

    #POST request for registering account
    def post(self):
        args = self.post_req.parse_args()
        user_entry = Users.insert_user(
            email = args['req_user_email'],
            firstname = args['req_user_firstname'],
            middlename = args['req_user_middlename'],
            lastname = args['req_user_lastname'],
            password = args['req_user_password']
        )
        if not user_entry:
            abort(409, message="Email already exists")
        return {"message": "registration success"}, 201



