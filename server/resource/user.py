from flask_restful import Resource, abort, reqparse
from flask import session , jsonify
from model import User

#User login and registration
class UserAuth(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_email" , type=str, required=True, help='Email Address is required')
    post_req.add_argument("req_user_password" , type=str, required=True, help='Password is required')

    def delete(self):
        session.clear()
        abort(400, message="Logged out")

    def post(self): 
        args = self.post_req.parse_args()
        current_user = User.check_login(
            args['req_user_email'].strip(), 
            args['req_user_password'].strip()
        )
        if current_user is None:
            abort(401, message="Wrong credentials")
        session['user_email'] = current_user.email
        user_data = {
            "res_user_email": current_user.email,
            "res_user_password": current_user.password,
            "session": session.get('user_email')
        }
        return user_data, 200


class UserRegistration(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_email" , type=str, required=True, help='Email Address is required')
    post_req.add_argument("req_user_password" , type=str, required=True, help='Password is required')
    post_req.add_argument("req_user_firstname" , type=str, required=True, help='Firstname is required')
    post_req.add_argument("req_user_middlename" , type=str, required=True, help='Middlename is required')
    post_req.add_argument("req_user_lastname" , type=str, required=True, help='Lastname is required')

    def post(self):
        args = self.post_req.parse_args()
        user_entry = User.insert_user(
            email = args['req_user_email'].strip(),
            firstname = args['req_user_firstname'].strip(),
            middlename = args['req_user_middlename'].strip(),
            lastname = args['req_user_lastname'].strip(),
            password = args['req_user_password'].strip()
        )
        if not user_entry:
            abort(401, message="Email already exists")
        return {"message": "registration success"}, 201
