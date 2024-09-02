from app.ext import db
from app.model import get_uuid, dt, check_password_hash, generate_password_hash

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    resident_id = db.Column(db.String(32), db.ForeignKey('residenttype.id'), nullable=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    middlename = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    suffix = db.Column(db.String(255), nullable=True)
    gender = db.Column(db.String(255), nullable=False)
    photo_path = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    #verify user authentication 
    # IF username 
    # AND password matched a row inside <Users> table
    @classmethod
    def check_login(cls, username, password) -> object:
        user = cls.query.filter_by(
            username=username.strip()
        ).first()
        if not (user and check_password_hash(user.password, password.strip())):
            return None
        return user
    
    #insert user TO <Users> table
    @classmethod
    def insert_user(cls, username, password, firstname, middlename, lastname, suffix, gender, photo_path) -> object:
        check_user = cls.query.filter_by(username=username).first()
        if check_user:
            return None
        user_entry = cls(username=username.strip(),
                         firstname=firstname.strip(),
                         middlename=middlename.strip(),
                         lastname=lastname.strip(),
                         suffix=suffix.strip(),
                         gender=gender.strip(),
                         photo_path=photo_path.strip(),
                         password=generate_password_hash(password.strip()))
        db.session.add(user_entry)
        db.session.commit()
        return user_entry
    
    #fetch all rows from <Users> table
    @classmethod
    def get_all_user(cls):
        query = cls.query.order_by(cls.lastname.asc()).all()
        users = [{
            'user_id': i.id,
            'user_username': i.username,
            'user_firstname': i.firstname,
            'user_middlename': i.middlename,
            'user_lastname': i.lastname,
            'user_date_created': i.date_created.isoformat()
        } for i in query]

        return users
    
    