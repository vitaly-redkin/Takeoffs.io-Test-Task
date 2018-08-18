import random
import datetime

import config
from .mongo_util import MongoUtil
from .image_util import ImageUtil

class Takeoff:
    @staticmethod
    def create_from_file(filename, content):
        takeoff = Takeoff(MongoUtil.get_new_id('Takeoff'), filename, content)
        takeoff._add()
        return takeoff

    def __init__(self, takeoff_id, filename, content):
        self.takeoff_id = takeoff_id
        self.filename = filename
        self.content = content
        self.pages = []
        self.floor_plans = []
        self.step_status = []
        self.floor_plan_counter = 0

    def _add(self):
        self._generate_step_status()
        self._extract_pages()
        self._generate_floor_plans()

        MongoUtil.takeoff_collection().insert_one(
            {
                '_id': self.takeoff_id,
                'filename': self.filename,
                'content': self.content,
                'pages': self.pages,
                'floor_plans': self.floor_plans,
                'step_status': self.step_status,
                'floor_plan_counter': self.floor_plan_counter
            }
        )

    def _extract_pages(self):
        image_pages = ImageUtil.extract_pages(self.content)
        self.pages.clear()
        for i in range(0, len(image_pages)):
            self.pages.append(
                {
                    'page_number': i + 1,
                    'page_data': image_pages[i].data,
                    'bboxes': image_pages[i].bboxes
                }
            )

    def _generate_floor_plans(self):
        self.floor_plans.clear()
        for page in self.pages:
            page_number = page['page_number']
            page_data = page['page_data']
            bboxes = page['bboxes']
            for bbox in bboxes:
                self.floor_plan_counter += 1
                plan_image = ImageUtil.get_image_region(page_data, bbox)
                plan_base64 = ImageUtil.image_to_base64(plan_image)
                tiled_mask = ImageUtil.generate_mask(plan_image)
                tiled_mask_base64 = ImageUtil.image_to_base64(tiled_mask)
                self.floor_plans.append(
                    {
                        'page_number': page_number,
                        'floor_plan_number': self.floor_plan_counter,
                        'plan': plan_base64,
                        'tiled_mask': tiled_mask_base64
                    }
                )

                plan_image.save('%s/%s_%s_%s.png' % (config.DEBUG_OUTPUT_FOLDER, self.takeoff_id, page_number, bbox))
                tiled_mask.save('%s/%s_%s_%s_mask.png' % (config.DEBUG_OUTPUT_FOLDER, self.takeoff_id, page_number, bbox))


    def _generate_step_status(self):
        steps = ['Extracting Floor Plans', 'Calculating Tiled Area']
        self.step_status.clear()
        time_to_complete = 1
        for i in range(0, len(steps)):
            time_to_complete += round(random.random() * 3)
            complete_at = round(datetime.datetime.now().timestamp() + time_to_complete)
            self.step_status.append(
                {
                    'step_name': steps[i],
                    'complete_at': complete_at
                }
            )