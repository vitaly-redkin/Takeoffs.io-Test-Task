import io
import base64
from PIL import Image

import util

class ImageUtil:
    @staticmethod
    def extract_images(base64_content):
        """
        Extracts images from the given Base64 encoded file.
        For the test purposes treats the encoded file as a PNG image
        and rotates it by 90, 180 and 270 degrees.
        Returns list of FloorPlan objects
        :param string base64_content: Base64 encoded file
        """
        byte_content = base64.b64decode(base64_content)
        image = Image.open(io.BytesIO(byte_content))

        # "Original" image
        bboxes = ImageUtil._generate_bboxes(image)
        floor_plan = FloorPlan(base64_content, bboxes)
        result = [floor_plan]

        rotations = [90, 180, 270]
        for angle in rotations:
            rotated_image = image.rotate(angle, expand=1)

            buffer = io.BytesIO()
            rotated_image.save(buffer, 'PNG')
            rotated_byte_content = buffer.getvalue()
            rotated_base64 = util.base64_encode(rotated_byte_content)

            bboxes = ImageUtil._generate_bboxes(rotated_image)
            floor_plan = FloorPlan(rotated_base64, bboxes)
            result.append(floor_plan)

            rotated_image.save('d:/temp/%s.png' % angle)

        return result

    @staticmethod
    def _generate_bboxes(image):
        w = image.width
        h = image.height
        box_width = round(w / 5)
        box_height = round(w / 2)
        box1 = [round(w / 5), round(h / 4), box_width, box_height]
        box2 = [round(w / 5 * 3) , round(h / 4), box_width, box_height]
        return [box1, box2]

class FloorPlan:
    def __init__(self, data, bboxes):
        self.data = data
        self.bboxes = bboxes