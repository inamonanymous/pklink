from app.resource import Resource, abort, reqparse, _ADMIN
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from .functions import require_user_session, check_user_type, get_current_user_username

class UnverifiedUserData(Resource):
    @require_user_session
    #GET request for fetching all <Unverified Users>
    def get(self):
        users = VerifiedUsers.get_all_unverified_users()
        return users

#User verification
class UserVerification(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_username", type=str, required=True, help="username Address is required")

    #PUT request for inserting of user to verified table 
    @require_user_session
    def put(self):
        current_user_username = get_current_user_username()
        user_type = check_user_type(current_user_username)

        if user_type!=_ADMIN:
            abort(401, message="not admin")    

        args = self.post_req.parse_args()
        user_username = args['req_user_username']
        user_entry = VerifiedUsers.insert_verified_user(user_username)
        if user_entry is None:
            abort(409, message="It's either user already verified or username is unknown")
        return {"message": "verification success"}, 201
    
    #GET request for fetching all <Verified Users>
    @require_user_session
    def get(self):
        verified_users = VerifiedUsers.get_all_users_with_verification()
        return verified_users
    
