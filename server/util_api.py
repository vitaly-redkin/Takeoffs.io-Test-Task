from flask import request
from flask_restful import Resource

from util import dict_get
from model.mongo_util import MongoUtil


class UtilApi(Resource):
    """
    API for misc utiltty methods/
    """

    def post(self):
        """
        POST method.
        Uses action field in the payload JSON object to understand what to do.
        Right now only the drop_database action is supported.

        :return: {'success': success, 'error': error} dictionary
        """
        json_data = request.get_json(force=True)
        action = dict_get(json_data, 'action', '')

        success = True
        error = ''
        action_name = ''
        try:
            if action == 'drop_database':
                action_name = 'dropping MongoDB database'
                MongoUtil.drop_db()
            else:
                success = False
                error = '[%s] action is not supported' % action
        except Exception as e:
            success = False
            error = 'Error when %s : %s' % (action_name, e)

        return {'success': success, 'error': error}
