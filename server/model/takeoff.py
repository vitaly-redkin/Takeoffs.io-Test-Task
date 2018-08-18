from .mongo_util import MongoUtil
from .image_util import ImageUtil

class Takeoff:
    @staticmethod
    def create_from_file(filename, content):
        takeoff = Takeoff(MongoUtil.get_new_id('Takeoff'), filename, content)
        takeoff._add()
        return takeoff

    def __init__(self, id, filename, content):
        self.id = id
        self.filename = filename
        self.content = content
        self.floor_plans = []

    def _add(self):
        self._extract_floor_plans()

        MongoUtil.takeoff_collection().insert_one(
            {
                '_id': self.id,
                'filename': self.filename,
                'content': self.content,
                'floor_plans': self.floor_plans
            }
        )

    def _extract_floor_plans(self):
        plans = ImageUtil.extract_images(self.content)
        self.floor_plans.clear()
        for i in range(0, len(plans)):
            page_number = i + 1
            page_data = plans[i].data
            bboxes = plans[i].bboxes
            self.floor_plans.append(
                {
                    'page_number': page_number,
                    'page_data': page_data,
                    'bboxes': bboxes
                }
            )
