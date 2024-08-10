from flask import session

def check_user_session():
    if 'user' not in session:
        return False
    return True