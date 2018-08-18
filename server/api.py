from flask import Flask
from flask_restful import Resource, Api

from takeoff_api import TakeoffApi
from takeoff_page_api import TakeoffPageApi
from takeoff_floor_plan_api import TakeoffFloorPlanApi
from util_api import UtilApi

app = Flask(__name__)
app.config.from_pyfile('config.py')
api = Api(app)

class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}

takeoff_routes = [
    '/upload_file',
    '/status/<string:takeoff_id>',
]

takeoff_page_routes = [
    '/status/<string:takeoff_id>/floor_plans',
    '/status/<string:takeoff_id>/floor_plans/<int:page_number>',
]

takeoff_floor_plan_routes = [
    '/status/<string:takeoff_id>/tiled_areas',
    '/status/<string:takeoff_id>/tiled_areas/<int:floor_plan_number>',
]

api.add_resource(TakeoffApi, *takeoff_routes)
api.add_resource(TakeoffPageApi, *takeoff_page_routes)
api.add_resource(TakeoffFloorPlanApi, *takeoff_floor_plan_routes)
api.add_resource(UtilApi, '/util')
api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)