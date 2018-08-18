import sys
import glob
import os
import json
import unittest

import config
from api import app
import util


class TestIntegrations(unittest.TestCase):
    """
    API Integration Test Cases.
    """

    def setUp(self):
        """
        Test bed setup.
        Drops MongoDb database.
        """
        # print('setUp() started')
        self.app = app.test_client()
        self._cleanup()
        # print('setUp() completed')

    def test_flask(self):
        """
        Tests of Flask works.
        """
        print('test_flask() started')
        response = self.app.get('/')
        self.assertEqual(
            self._toJson(response),
            {'hello': 'world'},
            'Root endpoint returns "Hello, world"'
        )
        print('setUp() completed')

    def test_upload_file(self):
        """
        Tests for POST /upload_file end point.
        """
        print('test_upload_file() started')
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertIsNotNone(takeoff_id, 'Takeoff ID should be returned')
        print('test_upload_file() completed')

    def test_get_status(self):
        """
        Tests for GET /status/<takeoff_id> end point.
        """
        print('test_get_status() started')
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertIsNotNone(takeoff_id, 'Takeoff ID should be returned')

            response = self.app.get('/status/%s' % takeoff_id)
            result = self._toJson(response)
            self.assertEqual(len(result), 2, 'Each generated takeoff should have 2 steps')

            break

        print('test_get_status() completed')

    def test_get_pages(self):
        """
        Tests for GET /status/<takeoff_id>/floor_plans end point.
        """
        print('test_get_pages() started')
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertIsNotNone(takeoff_id, 'Takeoff ID should be returned')

            result = self._get_pages(takeoff_id)

            self.assertEqual(len(result), 4, 'Each takeoff should 4 generated pages')
            self.assertEqual(len(result[0]['bboxes']), 2, 'Each page should 2 bboxes')

            break

        print('test_get_pages() completed')

    def test_set_page_bboxes(self):
        """
        Tests for PUT /status/<takeoff_id>/floor_plans/<page_number> end point.
        """
        print('test_set_page_bboxes() started')
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertIsNotNone(takeoff_id, 'Takeoff ID should be returned')

            page_number = 2
            new_bboxes = [[666, 777, 888, 999], [10, 10, 20, 20]]
            payload = dict(bboxes=new_bboxes)
            response = self.app.put(
                '/status/%s/floor_plans/%s' % (takeoff_id, page_number),
                data=json.dumps(payload))
            result = self._toJson(response)
            self.assertEqual(
                result,
                {'success': True},
                'Update operation was successful'
            )

            result = self._get_pages(takeoff_id)
            bboxes = result[page_number - 1]['bboxes']
            self.assertEqual(
                bboxes, new_bboxes,
                'bboxes were set successfully in the database'
            )

            break

        print('test_set_page_bboxes() completed')

    def test_get_floor_plans(self):
        """
        Tests for GET /status/<takeoff_id>/tiled_areas end point.
        """
        print('test_get_floor_plans() started')
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertIsNotNone(takeoff_id, 'Takeoff ID should be returned')

            result = self._get_floor_plans(takeoff_id)

            self.assertEqual(len(result), 8, 'Each takeoff should 8 generated floor plans (4 pages * 2 bboxes)')
            self.assertTrue('plan' in result[0], 'Plan has plan field')
            self.assertTrue('tiled_mask' in result[0], 'Plan has tiled_mask field')

            break

        print('test_get_floor_plans() completed')

    def test_set_floor_plan_tiled_mask(self):
        """
        Tests for PUT /status/<takeoff_id>/tiled_areas/<floor_plan_number> end point.
        """
        print('test_set_floor_plan_tiled_mask() started')
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertIsNotNone(takeoff_id, 'Takeoff ID should be returned')

            floor_plan_number = 1
            new_tiled_mask = 'XXX'
            payload = dict(tiled_mask=new_tiled_mask)
            response = self.app.put(
                '/status/%s/tiled_areas/%s' % (takeoff_id, floor_plan_number),
                data=json.dumps(payload))
            result = self._toJson(response)
            self.assertEqual(
                result,
                {'success': True},
                'Update operation was successful'
            )

            result = self._get_floor_plans(takeoff_id)
            tiled_mask = result[floor_plan_number - 1]['tiled_mask']
            self.assertEqual(
                tiled_mask, tiled_mask,
                'tiled_mask were set successfully in the database'
            )

            break

        print('test_set_floor_plan_tiled_mask() completed')

    def _upload_file(self, infile):
        """
        Uploads the file with the given name.

        :param string infile: path to file
        :return: ID of the created Takeoff
        """
        with open(infile, 'rb') as f:
            byte_content = f.read()
        base64_content = util.base64_encode(byte_content)
        payload = dict(filename=infile, content=base64_content)
        response = self.app.post(
            '/upload_file',
            data=json.dumps(payload))
        result = self._toJson(response)
        takeoff_id = util.dict_get(result, 'takeoff_id', None)
        return takeoff_id

    def _get_pages(self, takeoff_id):
        """
        Calls GET /status/<takeoff_id>/floor_plans endpoint.

        :param string takeoff_id: ID of the takeoff
        :return: parsed JSON
        """
        response = self.app.get('/status/%s/floor_plans' % takeoff_id)
        result = self._toJson(response)
        return result

    def _get_floor_plans(self, takeoff_id):
        """
        Calls GET /status/<takeoff_id>/tiled_areas endpoint.

        :param string takeoff_id: ID of the takeoff
        :return: parsed JSON
        """
        response = self.app.get('/status/%s/tiled_areas' % takeoff_id)
        result = self._toJson(response)
        return result

    def _toJson(self, response):
        """
        Parses JSON response.

        :param response: response to parse
        :return: parsed JSON
        """
        return json.loads(response.get_data().decode(sys.getdefaultencoding()))

    def _cleanup(self):
        """
        Drops MongoDb database.
        """
        payload = dict(action="drop_database")
        response = self.app.post(
            '/util',
            data=json.dumps(payload))


if __name__ == "__main__":
    unittest.TestLoader.sortTestMethodsUsing = None
    unittest.main()
