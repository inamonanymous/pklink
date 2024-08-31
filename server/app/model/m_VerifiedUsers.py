from app.model import db, get_uuid, dt, aliased
from app.model.m_Users import Users

class VerifiedUsers(db.Model):
    __tablename__ = 'verified_users'
    id = db.Column(db.String(32), primary_key=True, default=get_uuid)
    user_email = db.Column(db.String(255), db.ForeignKey('users.email'), unique=True, nullable=False)
    date_verified = db.Column(db.DateTime, default=dt.datetime.now())

    @classmethod
    def insert_verified_user(cls, email) -> object:
        #check if that email already in <VerifiedUsers> table 
        check_v_user = cls.query.filter_by(
            user_email=email
        ).first() is not None

        #check if that email is not in the <Users> table
        check_user = Users.query.filter_by(
            email=email
        ).first() is None

        if check_v_user or check_user: 
            return None
        user_entry = cls(
            user_email=email.strip()
        )
        db.session.add(user_entry)
        db.session.commit()
        return user_entry
    
    @classmethod
    def get_all_users_with_verification(cls):
        #fetch all rows from <Users> table 
        # COMBINED WITH rows inside <VerifiedUsers> table 
        # IF email registered in <VerifiedUsers> table
        query = db.session.query(
            Users,
            cls.date_verified
        ).outerjoin(
            Users, Users.email == cls.user_email
        ).order_by(Users.lastname.asc()).all()

        users = [{
            'status': 'verified',
            'user_id': i[0].id,
            'user_email': i[0].email,
            'user_firstname': i[0].firstname,
            'user_middlename': i[0].middlename,
            'user_lastname': i[0].lastname,
            'user_date_created': i[0].date_created.isoformat(),
            'user_verified': i[1] is not None,
            'date_verified': i[1].isoformat() if i[1] else None
        } for i in query] #index 0 = <Users> table | index 1 = <VerifiedUsers> table 
        
        return users
    
    @classmethod
    def get_all_unverified_users(cls):
        #fetch all rows from <Users> table 
        # IF email 
        # NOT registered in <VerifiedUsers> table
        verified_alias = aliased(cls)

        # Perform the query
        query = db.session.query(Users).outerjoin(
            verified_alias, Users.email == verified_alias.user_email
        ).filter(
            verified_alias.user_email == None
        ).all()

        # Format the results
        users = [{
            'status': 'unverified',
            'user_id': i.id,
            'user_email': i.email,
            'user_firstname': i.firstname,
            'user_middlename': i.middlename,
            'user_lastname': i.lastname,
            'user_date_created': i.date_created.isoformat()
        } for i in query]

        return users

    @classmethod
    def get_verified_user_by_email(cls, email:str):
        return cls.query.filter_by(user_email=email).first()
    