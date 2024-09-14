from app.resource import abort, session, US_ins, RTS_ins, AS_ins
from app.ext import db
from functools import wraps
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
    user = US_ins.get_user_dict_by_username(get_current_user_username())
    user_privileges = None
    resident_type = RTS_ins.get_resident_type_dict_by_id(user['resident_id'])
    if AS_ins.get_admin_by_user_id(user['user_id']):
        user_privileges = {
            'username': user['user_username'],
            'resident_id': user['resident_id'],
            'type_name': 'ADMIN',
            'view_accounts': True,
            'control_accounts': True,
            'add_announcement': True,
            'manage_announcement': True,
            'add_event': True,
            'manage_event': True,
            'add_post': True,
            'manage_post': True,
        }
    elif resident_type:
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
    else:
        return None
    return user_privileges

def get_current_user_username():
    return str(session.get('user_username'))
