from app.resource import Resource, abort, reqparse, request, VUS_ins, AS_ins, US_ins, UDS_ins
from .functions import require_user_session, get_current_user_privilege

#--------------- Variable Values ---------------#
""" 
    VUS_ins = <VerifiedUsersService> object instance
    AS_ins = <AdminService> object instance
    US_ins = <UserService> object instance
    UDS_ins = <UserDetailsService> object instance
"""

class UnverifiedUserData(Resource):
    @require_user_session
    #GET request for fetching all <Unverified Users>
    def get(self):
        users = VUS_ins.get_all_unverified_users_list_obj()
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
        if AS_ins.get_admin_by_username(user_username):
            abort(409, message="target user is listead as admin")    
        if not VUS_ins.delete_verified_user(user_username):
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
        user_entry = VUS_ins.insert_verified_user(user_username)
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

        verified_users = VUS_ins.get_all_verified_users_list_obj()
        return verified_users
    
    #PATCH request for individually fetching user information by username
    @require_user_session
    def patch(self):
        current_user_privelege = get_current_user_privilege()
        if current_user_privelege is None:
            abort(404, message="current user not found")    
        if not current_user_privelege['view_accounts']:
            abort(401, message="current user not allowed") 
        args = self.post_req.parse_args()
        user_username = args['req_user_username']
        user = US_ins.get_user_dict_by_username(user_username)
        if user is None:
            return {"message": "invalid! no user found"}, 404
        user_details = UDS_ins.get_user_details_dict_by_username(user_username)
        if user_details is None:
            return {"message": "invalid! no userdetails found"}, 404
        user_details.pop('user_username')
        user['user_details_obj'] = user_details
        return user
        
        
