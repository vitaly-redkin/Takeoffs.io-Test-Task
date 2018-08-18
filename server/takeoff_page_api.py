from flask import request, abort

from model.takeoff import Takeoff
import base_api
from util import dict_get


class TakeoffPageApi(base_api.BaseApi):
    """
    API for Takeoffs pages.
    """

    def get(self, takeoff_id):
        """
        GET method.
        Returns takeoff page data.

        :param string takeoff_id: ID of the takeoff to use
        :return: list of take off pages data dictionaries
        """
        result = Takeoff.get_pages(takeoff_id)
        return self.check_takeoff(result, takeoff_id)

    def put(self, takeoff_id, page_number):
        """
        PUT method.
        Sets bboxes for the takeoff page with the given number.

        :param string takeoff_id: ID of the takeoff to use
        :param int page_number: number of the page to update
        :return: {'success': True} or None if takeoff or page not found
        """
        json_data = request.get_json(force=True)
        bboxes = dict_get(json_data, 'bboxes', None)
        if bboxes is None:
            abort(400, 'No bbox field supplied')

        result = Takeoff.set_takeoff_page_bboxes(takeoff_id, page_number, bboxes)
        return self.check_takeoff(
            result, takeoff_id,
            'No Takeoff with ID=%s or page number %s exists' % (takeoff_id, page_number)
        )
