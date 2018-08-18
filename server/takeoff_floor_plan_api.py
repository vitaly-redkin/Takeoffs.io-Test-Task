from flask import request, abort

from model.takeoff import Takeoff
import base_api
from util import dict_get


class TakeoffFloorPlanApi(base_api.BaseApi):
    """
    API for Takeoffs floor plans.
    """

    def get(self, takeoff_id):
        """
        GET method.
        Returns takeoff floor plan data.

        :param string takeoff_id: ID of the takeoff to use
        :return: list of take off floor plan data dictionaries
        """
        result = Takeoff.get_floor_plans(takeoff_id)
        return self.check_takeoff(result, takeoff_id)

    def put(self, takeoff_id, floor_plan_number):
        """
        PUT method.
        Sets tiled mask for the takeoff floor plan with the given number.

        :param string takeoff_id: ID of the takeoff to use
        :param int floor_plan_number: number of the floor plan to update
        :return: {'success': True} or None if takeoff or floor plan not found
        """
        json_data = request.get_json(force=True)
        tiled_mask = dict_get(json_data, 'tiled_mask', None)
        if tiled_mask is None:
            abort(400, 'No tiled_mask field supplied')

        result = Takeoff.set_takeoff_floor_plan_tiled_mask(takeoff_id, floor_plan_number, tiled_mask)
        return self.check_takeoff(
            result, takeoff_id,
            'No Takeoff with ID=%s or floor plan #%s exists' % (takeoff_id, floor_plan_number)
        )
