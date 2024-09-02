from flask_restful import Resource, abort, reqparse
from flask import session , jsonify

_ADMIN=1024
_VERIFIED=1