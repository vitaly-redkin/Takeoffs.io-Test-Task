from flask import Flask
from flask_restful import Resource, Api

from takeoff_api import TakeoffApi
from util_api import UtilApi

app = Flask(__name__)
app.config.from_pyfile('config.py')
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

api.add_resource(TakeoffApi, '/upload_file')
api.add_resource(UtilApi, '/util')
api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)