from flask import session

def check_user_session():
    if 'user_email' not in session:
        return False
    return True