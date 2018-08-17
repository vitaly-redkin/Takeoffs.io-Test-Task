from flask import request
from flask_restful import Resource

from util import dict_get
from model.takeoff import Takeoff

class TakeoffApi(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        filename = dict_get(json_data, 'filename', '')
        content = dict_get(json_data, 'content', '')
        takeoff = Takeoff.create_from_file(filename, content)
        return {'takeoff_id': takeoff.id}
