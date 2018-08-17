from flask import request
from flask_restful import Resource

from util import dict_get
from model.mongo_util import MongoUtil

class UtilApi(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        action = dict_get(json_data, 'action', '')

        success = True
        error = ''
        action_name = ''
        try:
            if action == 'drop_database':
                action_name = 'dropping MongoDB database'
                MongoUtil.drop_db()
        except Exception as e:
            success = False
            error = 'Error when %s : %s' % (action_name, e)

        return {'success': success, 'error': error}
