from app.resource import abort, session
from app.model import db
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers
from app.model.m_Admin import Admin
from functools import wraps

#returns -1 if user is not found
#returns 1 id user found in admin table
#returns 1024 id user found in admin table
def check_user_type(email:str):
    check_in_users = Users.query.filter_by(email=email).first() is not None
    
    if not check_in_users:
        return -1
    
    check_in_verified_users = VerifiedUsers.query.filter_by(user_email=email).first() is not None
    check_in_admin = Admin.query.filter_by(user_email=email).first() is not None
    
    user_role = 0
    
    if check_in_admin:
        user_role = 1024
    elif check_in_verified_users:
        user_role = 1
    else:
        return -1
    
    return user_role

#decorator in routes checking user session if active
def require_user_session(f):
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        if 'user_email' not in session:
            abort(401, message="Not logged in")
        return f(self, *args, **kwargs) 
    return wrapper

def get_current_user_email():
    return str(session.get('user_email'))