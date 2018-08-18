from flask import request
from flask_restful import Resource

from util import dict_get
from model.takeoff import Takeoff
import base_api

class TakeoffApi(base_api.BaseApi):
    def post(self):
        json_data = request.get_json(force=True)
        filename = dict_get(json_data, 'filename', '')
        content = dict_get(json_data, 'content', '')
        takeoff = Takeoff.create_from_file(filename, content)
        return {'takeoff_id': takeoff.takeoff_id}

    def get(self, takeoff_id):
        result = Takeoff.get_status(takeoff_id)
        return self.check_takeoff(result, takeoff_id)
