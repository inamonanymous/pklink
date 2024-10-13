from flask import Flask, request, send_from_directory
from flask_restful import Api
from app.config import ApplicationConfig
from app.ext import sess, cors, db, migrate
from app.resource.r_user import UserAuth, UserRegistration, CheckSession, RegisteredVillages, RegisteredBrgyStreets, PostsData
from app.resource.r_partial_admin import UserVerification, UnverifiedUserData 

from app.model.m_Admin import Admin
from app.model.m_BrgyStreets import BrgyStreets
from app.model.m_ResidentType import ResidentType
from app.model.m_UserDetails import UserDetails
from app.model.m_Users import Users
from app.model.m_VerifiedUsers import VerifiedUsers 
from app.model.m_Villages import Villages


from app.model.m_EventAttendance import EventAttendance
from app.model.m_Events import Events
from app.model.m_FormAnswers import FormAnswers
from app.model.m_FormFields import FormFields
from app.model.m_FormResponses import FormResponses
from app.model.m_Forms import Forms
from app.model.m_PostComments import PostComments
from app.model.m_Announcements import Announcements
from app.model.m_Posts import Posts
from app.model.m_HealthSupportRequests import HealthSupportRequests
from app.model.m_DocumentRequest import DocumentRequests
from app.model.m_Requests import Requests
from app.model.m_Incidents import Incidents


def create_app():
    #create app instance
    app = Flask(__name__)
    app.config.from_object(ApplicationConfig)

    #objects initialization from app
    db.init_app(app)
    sess.init_app(app)
    api = Api(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    #api resource routes
    api.add_resource(UserAuth, '/api/user/auth')
    api.add_resource(UserRegistration, '/api/user/registration')
    api.add_resource(CheckSession, '/api/user/check_session')
    api.add_resource(RegisteredBrgyStreets, '/api/user/brgystreets')
    api.add_resource(RegisteredVillages, '/api/user/villages')
    api.add_resource(PostsData, '/api/user/posts')

    api.add_resource(UnverifiedUserData, '/api/partial_admin/unverified_users')
    api.add_resource(UserVerification, '/api/partial_admin/verify')

    with app.app_context():
        Users,
        ResidentType,
        Admin,
        VerifiedUsers,
        Incidents,
        BrgyStreets,
        Villages,
        UserDetails,
        EventAttendance,
        Events,
        PostComments,
        Announcements,
        Posts,
        FormAnswers,
        FormFields,
        FormResponses,
        Forms,
        DocumentRequests,
        HealthSupportRequests,
        Requests
        db.create_all()
    return app
    