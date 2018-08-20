import io
import base64
from PIL import Image

import util
import config


class ImageUtil:
    """
    Class with static methods to work with images
    """

    @staticmethod
    def extract_pages(base64_content):
        """
        Extracts pages from the given Base64 encoded file.
        For the test purposes treats the encoded file as a PNG image
        and rotates it by 90, 180 and 270 degrees.

        :param string base64_content: Base64 encoded PNG file
        :return: list of TakeoffPage objects
        """
        image = ImageUtil.image_from_base64(base64_content)

        result = []
        rotations = [0, 90, 180, 270]
        for angle in rotations:
            rotated_image = image.rotate(angle, expand=1)
            rotated_base64 = ImageUtil.image_to_base64(rotated_image)
            bboxes = ImageUtil._generate_bboxes(rotated_image)
            page = TakeoffPage(rotated_base64, bboxes)
            result.append(page)
            #rotated_image.save('%s/%s.png' % (config.DEBUG_OUTPUT_FOLDER, angle))

        return result

    @staticmethod
    def _generate_bboxes(image):
        """
        Generates bboxes for the given image.

        :param PIL.Image image: Image to generate bboxes for
        :return: list with bboxes
        """
        w = image.width
        h = image.height
        bw = round(w / 5)
        bh = round(w / 2)
        box1 = [round(w / 5), round(h / 4), bw, bh]
        box2 = [round(w / 5 * 3), round(h / 4), bw, bh]
        return [box1, box2]

    @staticmethod
    def get_image_region(base64_content, bbox):
        """
        Takes image part defined by bbox

        :param string base64_content: Base64 encoded PNG file
        :param list bbox: [x, y, w, h] list
        :return: PIL.Image object with the part of an original image
        """
        image = ImageUtil.image_from_base64(base64_content)
        box = (bbox[0], bbox[1], bbox[0] + bbox[2], bbox[1] + bbox[3])
        region_image = image.crop(box)
        return region_image

    @staticmethod
    def generate_mask(image):
        """
        Generates mask image for the given image

        :param PIL.Image image: Image to generate mask for
        :return: PIL.Image with mask (B&W image)
        """
        w = image.width
        h = image.height
        mask = Image.new('1', (w, h), 0)
        return mask

    @staticmethod
    def image_from_base64(base64_content):
        """
        Converts Base64 string into image

        :param string base64_content: Base64-encoded string with image
        :return: PIL.Image converted from Base64 string
        """
        byte_content = base64.b64decode(base64_content)
        image = Image.open(io.BytesIO(byte_content))
        return image

    @staticmethod
    def image_to_base64(image):
        """
        Converts PIL.Image onto Base64-encoded string

        :param PIL.Image image: image to encode
        :return: Base64-encoded string with image
        """
        buffer = io.BytesIO()
        image.save(buffer, 'PNG')
        byte_content = buffer.getvalue()
        base64_content = util.base64_encode(byte_content)
        return base64_content


class TakeoffPage:
    """
    Takeoff page data class.
    """

    def __init__(self, data, bboxes):
        """
        Constructor.

        :param string data: base64-encoded image data
        :param list bboxes: list with bboxes ([x, y, w, h] lists)
        """
        self.data = data
        self.bboxes = bboxes
