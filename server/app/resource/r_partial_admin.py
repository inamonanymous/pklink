from app.resource import Resource, abort, reqparse, request
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_UserDetails import UserDetails
from app.model.m_Admin import Admin
from .functions import require_user_session, get_current_user_privilege

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

    #DELETE request for deleting user from verified table
    #this user still exists on users table
    @require_user_session
    def delete(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['control_accounts']:
            abort(401, message="current user not allowed")    
        user_username = request.args.get('req_user_username')
        if Admin.get_admin_by_username(user_username):
            abort(409, message="target user is listead as admin")    
        if not VerifiedUsers.delete_verified_user(user_username):
            abort(404, message="target user not found")    
        return {"message": "deleting verified user success"}, 201

    #PUT request for inserting of user to verified table 
    @require_user_session
    def put(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['control_accounts']:
            abort(401, message="current user not allowed") 
        args = self.post_req.parse_args()
        user_username = args['req_user_username']
        user_entry = VerifiedUsers.insert_verified_user(user_username)
        if user_entry is None:
            abort(409, message="It's either user already verified or username is unknown")
        return {"message": "verification success"}, 201
    
    #GET request for fetching all <Verified Users>
    @require_user_session
    def get(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['view_accounts']:
            abort(401, message="current user not allowed") 

        verified_users = VerifiedUsers.get_all_users_data_with_verification()
        return verified_users
    
    #PATCH request for individually fetching user information
    @require_user_session
    def patch(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['view_accounts']:
            abort(401, message="current user not allowed") 
        args = self.post_req.parse_args()
        user_username = args['req_user_username']
        user = Users.get_user_by_username(user_username)
        if user is None:
            return {"message": "invalid! no user found"}, 404
        user_details = UserDetails.get_user_details_by_username(user_username)
        if user_details is None:
            return {"message": "invalid! no userdetails found"}, 404
        user_details.pop('user_username')
        user['user_details_obj'] = user_details
        return user
        
        
