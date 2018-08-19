from flask import request

from util import dict_get
from model.takeoff import Takeoff
import base_api


class TakeoffApi(base_api.BaseApi):
    """
    API for Takeoffs
    """

    def post(self):
        """
        POST method.
        Uploads the file anc creates the Takeoff.

        :return: {'takeoff_id': takeoff_id} dictionary
        """

        json_data = request.get_json(force=True)
        filename = dict_get(json_data, 'filename', '')
        content = dict_get(json_data, 'content', '')
        takeoff = Takeoff.create_from_file(filename, content)
        return {'takeoff_id': takeoff.takeoff_id}

        #return {'takeoff_id': 1}

    def get(self, takeoff_id):
        """
        GET method.
        Returns Takeoff status data.

        :param string takeoff_id: ID of the takeoff to use
        :return: list with Takeoff step status data
        """
        result = Takeoff.get_status(takeoff_id)
        return self.check_takeoff(result, takeoff_id)
