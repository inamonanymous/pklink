from app.resource import abort, session
from app.ext import db
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_Admin import Admin
from app.model.m_ResidentType import ResidentType
from functools import wraps
import os
USER_FOLDER = f"uploads/users"

#decorator in routes checking user session if active
def require_user_session(f):
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        if 'user_username' not in session:
            abort(401, message="Not logged in")
        return f(self, *args, **kwargs) 
    return wrapper

def get_current_user_privilege():
    user = Users.get_user_by_username(get_current_user_username())
    if user is None:
        return None
    resident_type = ResidentType.get_resident_type_by_id(user['resident_id'])
    if resident_type is None:
        return None
    user_privileges = {
        'username': user['user_username'],
        'resident_id': user['resident_id'],
        'type_name': resident_type['resident_type_name'],
        'view_accounts': resident_type['resident_view_accounts'],
        'control_accounts': resident_type['resident_control_accounts'],
        'add_announcement': resident_type['resident_add_announcement'],
        'manage_announcement': resident_type['resident_manage_announcement'],
        'add_event': resident_type['resident_add_event'],
        'manage_event': resident_type['resident_manage_event'],
        'add_post': resident_type['resident_add_post'],
        'manage_post': resident_type['resident_manage_post'],
    }
    return user_privileges

def get_current_user_username():
    return str(session.get('user_username'))
