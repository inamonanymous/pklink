from app.resource import abort, session, US_ins, RTS_ins, AS_ins
from app.ext import db
from functools import wraps
USER_FOLDER = f"uploads/users"

#decorator in routes checking user session if active
def require_user_session(f):
    """
    Decorator to ensure a user session is active before accessing certain routes.

    Args:
        f (function): The original route function to wrap.
    
    Returns:
        function: Wrapped function that checks if 'user_username' exists in session.
    
    Raises:
        401: If the user is not logged in, it aborts the request with a 401 Unauthorized status.
    """
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        if 'user_username' not in session:
            abort(401, message="Not logged in")
        return f(self, *args, **kwargs) 
    return wrapper

def get_current_user_privilege() -> dict:
    """
    Retrieves the current user's privilege based on their role (admin or resident).

    - Fetches the user's data using the username stored in the session.
    - Depending on whether the user is an admin or a resident, assigns specific privileges.

    Returns:
        dict: 
            -Returns dictionary of the current user's privileges, which includes:
                - 'username': Username of the current user.
                - 'resident_id': ID of the resident linked to the user.
                - 'type_name': The type of the user (either 'ADMIN' or the resident type name).
                - 'view_accounts', 'control_accounts', 'add_announcement', etc.: Boolean flags representing the user's access rights.
            - Returns an empty dictionary if the user or resident type cannot be found
    """
    user = US_ins.get_user_dict_by_username(get_current_user_username())
    user_privileges = None
    resident_type = RTS_ins.get_resident_type_dict_by_id(user['resident_id'])
    if AS_ins.get_admin_by_user_id(user['user_id']): # If the user is an admin, provide full access
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
    elif resident_type: # If the user is a resident, assign specific privileges based on their type
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
        user_privileges = {
            'username': user['user_username'],
            'resident_id': None,
            'type_name': "Unverified Resident",
            'view_accounts': False,
            'control_accounts': False,
            'add_announcement': False,
            'manage_announcement': False,
            'add_event': False,
            'manage_event': False,
            'add_post': False,
            'manage_post': False,
        }
    return user_privileges

def get_current_user_username() -> str:
    """
    Retrieves the current username from the session.

    Returns:
        str: The username of the currently logged-in user, extracted from the session.
    """
    return str(session.get('user_username'))
