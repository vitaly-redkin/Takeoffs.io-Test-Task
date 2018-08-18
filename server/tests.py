import sys
import glob
import os
import json
import unittest

import config
from api import app
import util

class TestIntegrations(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self._cleanup()

    def test_flask(self):
        response = self.app.get('/')
        self.assertEqual(
            self._toJson(response),
            {'hello': 'world'})

    def test_upload_file(self):
        for infile in glob.glob(os.path.join(config.TEST_FILES_FOLDER, '*.png')):
            takeoff_id = self._upload_file(infile)
            self.assertGreater(takeoff_id, 0)

    def _upload_file(self, infile):
        with open(infile, 'rb') as f: byte_content = f.read()
        base64_content = util.base64_encode(byte_content)
        payload = dict(filename=infile, content=base64_content)
        response = self.app.post(
            '/upload_file',
            data=json.dumps(payload))
        result = self._toJson(response)
        takeoff_id = util.dict_get(result, 'takeoff_id', -1)
        return takeoff_id


    def _toJson(self, response):
        return json.loads(response.get_data().decode(sys.getdefaultencoding()))

    def _cleanup(self):
        payload = dict(action="drop_database")
        response = self.app.post(
            '/util',
            data=json.dumps(payload))

if __name__ == "__main__":
    unittest.main()