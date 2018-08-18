from flask_restful import Resource, abort


class BaseApi(Resource):
    """
    Base class for APIs.
    """

    def check_takeoff(self, takeoff, takeoff_id, message=None):
        """
        Checks if takeoff API call returned a real object.
        if None is returned calls abort(404).

        :param object takeoff: object to check if it is not None
        :param string takeoff_id: ID of the takeoff
        :param string message: error message. If absent composes a default one.
        :return: takeoff object if it is not None or calls abort(404) otherwise
        """
        if takeoff is not None:
            return takeoff
        else:
            error_message = \
                'No Takeoff with ID=%s exists' % takeoff_id if message is None else message
            abort(404, message=error_message)
