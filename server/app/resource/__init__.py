from flask_restful import Resource, abort, reqparse
from flask import session , jsonify, request
from app.service.s_Admin import AdminService
from app.service.s_BrgyStreet import BrgyStreetService
from app.service.s_ResidentType import ResidentTypeService
from app.service.s_UserDetails import UserDetailsService
from app.service.s_Users import UserService 
from app.service.s_VerifiedUsers import VerifiedUsersService
from app.service.s_Villages import VillagesService
from app.service.s_Posts import PostsService

AS_ins = AdminService()
BSS_ins = BrgyStreetService()
RTS_ins = ResidentTypeService()
UDS_ins = UserDetailsService()
US_ins = UserService()
VUS_ins = VerifiedUsersService()
VS_ins = VillagesService()
PS_ins = PostsService()