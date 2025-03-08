from app.resource import Resource, abort, reqparse, request, RTS_ins, US_ins, R_ins, ES_ins, UDS_ins, I_ins
from .r_functions import get_current_user_privilege, get_current_user_username, require_user_admin

class UserManagement(Resource):
    @require_user_admin
    def delete(self):
        user_id = request.args.get('req_user_id', None)
        if not user_id:
            return {"message": "user id is required"}, 400

        
        if not R_ins.delete_requests_by_user(user_id):
            return {"message": "error deleting user requests data"}, 400
        if not I_ins.delete_incidents_by_user(user_id):
            return {"message": "error deleting user requests data"}, 400
        if not ES_ins.delete_events_by_user(user_id):
            return {"message": "error deleting user events data"}, 400
        if not UDS_ins.delete_user_details_by_user(user_id):
            return {"message": "error deleting user details"}, 400
        if not US_ins.delete_user(user_id):
            return {"message": "error deleting user"}, 400
            

        return {"message": "User successfully deleted"}, 200

    @require_user_admin
    def put(self):
        put_parser = reqparse.RequestParser()
        put_parser.add_argument('req_user_id', type=str, required=True, help='ID is required')
        put_parser.add_argument('req_resident_type_id', type=str, required=False)
        put_parser.add_argument('req_alter_type', type=str, required=True, help='Alter type is required')
        args = put_parser.parse_args()
        
        if args['req_alter_type']=="assign":
            if not args['req_resident_type_id']:
                return {"message": 'Resident type ID is required'}, 400

            if not US_ins.assign_user_resident_type(args['req_user_id'], args['req_resident_type_id']):
                return {"message": "Error assigning resident to user"}, 400
            return {"message": "Successfully assigned resident type to user"}, 200
        elif args['req_alter_type']=="delete":
            if not US_ins.delete_user_resident_type(args['req_user_id']):
                return {"message": "Error deleting resident to user"}, 400
            return {"message": "Successfully deleted resident type to user"}, 200

        return {"message": "Alter type not recognized"}, 400


class ResidentTypeManagement(Resource):
    @require_user_admin
    def get(self):
        data = RTS_ins.get_all_resident_type()
        return data, 200

    #get individual data for resident type
    @require_user_admin
    def patch(self):
        patch_parser = reqparse.RequestParser()
        patch_parser.add_argument("req_resident_type_id", type=str, required=True, help="ID is required")
        args = patch_parser.parse_args()
        data = RTS_ins.get_resident_type_dict_by_id(args['req_resident_type_id'])
        if not data:
            return {"message": "Resident type not found"}, 404
        return data, 200

    @require_user_admin
    def post(self):
        post_parser = reqparse.RequestParser()
        post_parser.add_argument("req_resident_type_name", type=str, required=True, help="Name is required")
        post_parser.add_argument("req_manage_post", type=bool, default=False)
        post_parser.add_argument("req_add_post", type=bool, default=False)
        post_parser.add_argument("req_manage_event", type=bool, default=False)
        post_parser.add_argument("req_add_event", type=bool, default=False)
        post_parser.add_argument("req_manage_announcement", type=bool, default=False)
        post_parser.add_argument("req_add_announcement", type=bool, default=False)
        post_parser.add_argument("req_view_accounts", type=bool, default=False)
        post_parser.add_argument("req_control_accounts", type=bool, default=False)
        post_parser.add_argument("req_partial_admin", type=bool, default=False)
        post_parser.add_argument("req_manage_request", type=bool, default=False)

        current_user = US_ins.get_user_dict_by_username(get_current_user_username())
        args = post_parser.parse_args()

        new_resident_type = RTS_ins.insert_resident_type(
            name=args["req_resident_type_name"],
            user_id=current_user['user_id'],
            manage_post=args["req_manage_post"],
            add_post=args["req_add_post"],
            manage_event=args["req_manage_event"],
            add_event=args["req_add_event"],
            manage_announcement=args["req_manage_announcement"],
            add_announcement=args["req_add_announcement"],
            view_accounts=args["req_view_accounts"],
            control_accounts=args["req_control_accounts"],
            partial_admin=args["req_partial_admin"],
            manage_request=args["req_manage_request"]
        )

        if not new_resident_type:
            return {"message": "Failed to create resident type"}, 500

        return {"message": "Resident type created successfully"}, 201

    @require_user_admin
    def put(self):
        put_parser = reqparse.RequestParser()
        put_parser.add_argument("req_resident_type_id", type=str, required=True, help="Resident Type ID is required")
        put_parser.add_argument("req_resident_type_name", type=str, required=False)
        put_parser.add_argument("req_manage_post", type=bool, required=False)
        put_parser.add_argument("req_add_post", type=bool, required=False)
        put_parser.add_argument("req_manage_event", type=bool, required=False)
        put_parser.add_argument("req_add_event", type=bool, required=False)
        put_parser.add_argument("req_manage_announcement", type=bool, required=False)
        put_parser.add_argument("req_add_announcement", type=bool, required=False)
        put_parser.add_argument("req_view_accounts", type=bool, required=False)
        put_parser.add_argument("req_control_accounts", type=bool, required=False)
        put_parser.add_argument("req_partial_admin", type=bool, required=False)
        put_parser.add_argument("req_manage_request", type=bool, required=False)

        args = put_parser.parse_args()
        current_user = US_ins.get_user_dict_by_username(get_current_user_username())

        updated_resident_type = RTS_ins.edit_resident_type(
            id=args["req_resident_type_id"],
            name=args["req_resident_type_name"],
            manage_post=args["req_manage_post"],
            add_post=args["req_add_post"],
            manage_event=args["req_manage_event"],
            add_event=args["req_add_event"],
            manage_announcement=args["req_manage_announcement"],
            add_announcement=args["req_add_announcement"],
            view_accounts=args["req_view_accounts"],
            control_accounts=args["req_control_accounts"],
            partial_admin=args["req_partial_admin"],
            manage_request=args["req_manage_request"],
            user_id=current_user['user_id']
        )

        if not updated_resident_type:
            return {"message": "Resident type not found or failed to update"}, 404

        return {"message": "Resident type updated successfully"}, 200

    @require_user_admin
    def delete(self):
        resident_type_id = request.args.get('req_resident_type_id')
        if not resident_type_id:
            return {"message": "Resident Type ID is required"}, 400
        
        deleted = RTS_ins.delete_resident_type(resident_type_id)
        if not deleted:
            return {"message": "Resident type not found or failed to delete"}, 404

        return {"message": "Resident type deleted successfully"}, 200


class UserRegistrationStatsResource(Resource):
    def get(self):
        """ parser = reqparse.RequestParser()
        parser.add_argument("span", type=str, choices=["daily", "monthly", "yearly"], default="daily") """
        args = request.args.get('span')

        stats = US_ins.get_registration_stats(args)
        print(stats)
        return {"data": stats}, 200
    
class UsersByResidentTypeResource(Resource):
    def get(self):
        stats = US_ins.get_users_by_resident_type()
        print(stats)
        return {"data": stats}, 200
    
class RequestStatisticsResource(Resource):
    def get(self):
        stats = R_ins.get_request_counts()
        if stats is None:
            return {"error": "Failed to retrieve request statistics"}, 500
        print(stats)
        return {"data": stats}, 200