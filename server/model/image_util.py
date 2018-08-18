import io
import base64
from PIL import Image

import util
import config

class ImageUtil:
    @staticmethod
    def extract_pages(base64_content):
        """
        Extracts pages from the given Base64 encoded file.
        For the test purposes treats the encoded file as a PNG image
        and rotates it by 90, 180 and 270 degrees.
        Returns list of TakeoffPage objects
        :param string base64_content: Base64 encoded file
        """
        image = ImageUtil.image_from_base64(base64_content)

        # "Original" image
        bboxes = ImageUtil._generate_bboxes(image)
        page = TakeoffPage(base64_content, bboxes)
        result = [page]

        rotations = [90, 180, 270]
        for angle in rotations:
            rotated_image = image.rotate(angle, expand=1)
            rotated_base64 = ImageUtil.image_to_base64(rotated_image)
            bboxes = ImageUtil._generate_bboxes(rotated_image)
            page = TakeoffPage(rotated_base64, bboxes)
            result.append(page)
            rotated_image.save('%s/%s.png' % (config.DEBUG_OUTPUT_FOLDER, angle))

        return result

    @staticmethod
    def _generate_bboxes(image):
        w = image.width
        h = image.height
        bw = round(w / 5)
        bh = round(w / 2)
        box1 = [round(w / 5), round(h / 4), bw, bh]
        box2 = [round(w / 5 * 3) , round(h / 4), bw, bh]
        return [box1, box2]

    @staticmethod
    def get_image_region(base64_content, bbox):
        image = ImageUtil.image_from_base64(base64_content)
        box = (bbox[0], bbox[1], bbox[0] + bbox[2], bbox[1] + bbox[3])
        region_image = image.crop(box)
        return region_image

    @staticmethod
    def generate_mask(image):
        w = image.width
        h = image.height
        mw = round(w * 2 / 3)
        mh = round(h * 2 / 3)
        mx = round(w / 6)
        my = round(h / 6)
        mask = Image.new('1', (w, h), 0)
        return mask

    @staticmethod
    def image_from_base64(base64_content):
        byte_content = base64.b64decode(base64_content)
        image = Image.open(io.BytesIO(byte_content))
        return image

    @staticmethod
    def image_to_base64(image):
        buffer = io.BytesIO()
        image.save(buffer, 'PNG')
        byte_content = buffer.getvalue()
        base64_content = util.base64_encode(byte_content)
        return base64_content


class TakeoffPage:
    def __init__(self, data, bboxes):
        self.data = data
        self.bboxes = bboxes
