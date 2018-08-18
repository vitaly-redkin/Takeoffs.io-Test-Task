from flask import request, abort

from model.takeoff import Takeoff
import base_api
from util import dict_get

class TakeoffFloorPlanApi(base_api.BaseApi):
    def get(self, takeoff_id):
        result = Takeoff.get_floor_plans(takeoff_id)
        return self.check_takeoff(result, takeoff_id)

    def put(self, takeoff_id, floor_plan_number):
        json_data = request.get_json(force=True)
        tiled_mask = dict_get(json_data, 'tiled_mask', None)
        if tiled_mask is None:
            abort(400, 'No tiled_mask field supplied')

        result = Takeoff.set_takeoff_floor_plan_tiled_mask(takeoff_id, floor_plan_number, tiled_mask)
        return self.check_takeoff(
            result, takeoff_id,
            'No Takeoff with ID=%s or floor plan #%s exists' % (takeoff_id, floor_plan_number)
        )
