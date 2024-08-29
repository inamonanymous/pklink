from flask_restful import Resource, abort, reqparse
from flask import session , jsonify
from app.model import VerifiedUsers
from app.ext import _ADMIN
from .functions import require_user_session, check_user_type, get_current_user_email

#User verification
class UserVerification(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_email", type=str, required=True, help="Email Address is required")

    #insert user to verified table 
    @require_user_session
    def put(self):
        current_user_email = get_current_user_email()
        user_type = check_user_type(current_user_email)

        if user_type!=_ADMIN:
            abort(401, message="not admin")    

        args = self.post_req.parse_args()
        user_email = args['req_user_email']
        user_entry = VerifiedUsers.insert_verified_user(user_email)
        if user_entry is None:
            abort(409, message="It's either user already verified or email is unknown")
        return {"message": "verification success"}, 201
    
    @require_user_session
    def get(self):
        verified_users = VerifiedUsers.get_all_users_with_verification()
        return verified_users