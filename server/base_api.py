from flask_restful import Resource, abort

class BaseApi(Resource):
    def check_takeoff(self, takeoff, takeoff_id, message=None):
        if takeoff != None:
            return takeoff
        else:
            error_message =\
                'No Takeoff with ID=%s exists' % takeoff_id if message is None else message
            abort(404, message=error_message)
