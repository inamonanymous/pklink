from app.model import db, get_uuid, dt, check_password_hash, generate_password_hash

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(255), unique=True, nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    middlename = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.DateTime, default=dt.datetime.now())

    verified_users = db.relationship('VerifiedUsers', backref=db.backref('users'), cascade='all, delete-orphan')

    #verify user authentication 
    # IF email 
    # AND password matched a row inside <Users> table
    @classmethod
    def check_login(cls, email, password) -> object:
        user = cls.query.filter_by(
            email=email.strip()
        ).first()
        if not (user and check_password_hash(user.password, password.strip())):
            return None
        return user
    
    #insert user TO <Users> table
    @classmethod
    def insert_user(cls, email, firstname, middlename, lastname, password) -> object:
        check_user = cls.query.filter_by(email=email).first()
        if check_user:
            return None
        user_entry = cls(email=email.strip(),
                         firstname=firstname.strip(),
                         middlename=middlename.strip(),
                         lastname=lastname.strip(),
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
            'user_email': i.email,
            'user_firstname': i.firstname,
            'user_middlename': i.middlename,
            'user_lastname': i.lastname,
            'user_date_created': i.date_created.isoformat()
        } for i in query]

        return users
    
    