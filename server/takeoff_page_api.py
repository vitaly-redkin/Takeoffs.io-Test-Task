from flask import request, abort

from model.takeoff import Takeoff
import base_api
from util import dict_get

class TakeoffPageApi(base_api.BaseApi):
    def get(self, takeoff_id):
        result = Takeoff.get_pages(takeoff_id)
        return self.check_takeoff(result, takeoff_id)

    def put(self, takeoff_id, page_number):
        json_data = request.get_json(force=True)
        bboxes = dict_get(json_data, 'bboxes', None)
        if bboxes is None:
            abort(400, 'No bbox field supplied')

        result = Takeoff.set_takeoff_page_bboxes(takeoff_id, page_number, bboxes)
        return self.check_takeoff(
            result, takeoff_id,
            'No Takeoff with ID=%s or page number %s exists' % (takeoff_id, page_number)
        )
