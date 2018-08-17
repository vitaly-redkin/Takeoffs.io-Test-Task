from .mongo_util import get_new_id

class Takeoff:
    @staticmethod
    def create_from_file(filename, content):
        takeoff = Takeoff(get_new_id('Takeoff'), filename, content)
        return takeoff

    def __init__(self, id, filename, content):
        self.id = id
        self.filename = filename
        self.content = content
