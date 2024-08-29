from flask import session
from flask_restful import abort
from functools import wraps

def require_user_session(f):
    @wraps(f)
    def wrapper(self, *args, **kwargs):
        if 'user_email' not in session:
            abort(401, message="Not logged in")
        return f(self, *args, **kwargs) 
    return wrapper