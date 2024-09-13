from app.model.m_Admin import Admin

class AdminService:
    def get_admin_by_username(self, username:str):
        return Admin.query.filter_by(user_username=username).first()