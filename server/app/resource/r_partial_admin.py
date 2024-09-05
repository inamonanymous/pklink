from app.resource import Resource, abort, reqparse, _ADMIN
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_UserDetails import UserDetails
from app.model.m_ResidentType import ResidentType
from .functions import require_user_session, check_user_type, get_current_user_username

class UnverifiedUserData(Resource):
    @require_user_session
    #GET request for fetching all <Unverified Users>
    def get(self):
        users = VerifiedUsers.get_all_unverified_users_data()
        return users

#User verification
class UserVerification(Resource):
    post_req = reqparse.RequestParser()
    post_req.add_argument("req_user_username", type=str, required=True, help="username Address is required")

    #PUT request for inserting of user to verified table 
    @require_user_session
    def put(self):
        current_user_username = get_current_user_username()
    
        user = Users.get_user_by_username(current_user_username)
        #if user object is empty
        if user is None:
            abort(401, message="current user not allowed")    
        #if resident type object is empty inside user object
        if user['resident_type_object'] is None:
            abort(401, message="current user not allowed")    
        #if resident control account is false inside resident type object inside user object
        if not user['resident_type_object']['resident_control_accounts']:
            abort(401, message="current user not allowed to configure accounts")    
        args = self.post_req.parse_args()
        user_username = args['req_user_username']
        user_entry = VerifiedUsers.insert_verified_user(user_username)
        if user_entry is None:
            abort(409, message="It's either user already verified or username is unknown")
        return {"message": "verification success"}, 201
    
    #GET request for fetching all <Verified Users>
    @require_user_session
    def get(self):
        current_user_username = get_current_user_username()
    
        user = Users.get_user_by_username(current_user_username)
        #if user object is empty
        if user is None:
            abort(401, message="current user not allowed")    
        #if resident type object is empty inside user object
        if user['resident_type_object'] is None:
            abort(401, message="current user not allowed")    
        #if resident control account is false inside resident type object inside user object
        if not user['resident_type_object']['resident_view_accounts']:
            abort(401, message="current user not allowed to configure accounts")    

        verified_users = VerifiedUsers.get_all_users_data_with_verification()
        return verified_users
    
    #PATCH request for individually fetching user information
    @require_user_session
    def patch(self):
        args = self.post_req.parse_args()
        user_username = args['req_user_username']
        verified_user = Users.get_user_by_username(user_username)
        if verified_user is None:
            return {"message": "invalid! no user found"}, 404
        user_details = UserDetails.get_user_details_by_username(user_username)
        if user_details is None:
            return {"message": "invalid! no userdetails found"}, 404
        user_details.pop('user_username')
        verified_user['user_details_obj'] = user_details
        return verified_user
        
        
