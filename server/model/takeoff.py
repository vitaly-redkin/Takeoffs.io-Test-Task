from .mongo_util import MongoUtil

class Takeoff:
    @staticmethod
    def create_from_file(filename, content):
        takeoff = Takeoff(MongoUtil.get_new_id('Takeoff'), filename, content)
        takeoff.add()
        return takeoff

    def __init__(self, id, filename, content):
        self.id = id
        self.filename = filename
        self.content = content

    def add(self):
        MongoUtil.takeoff_collection().insert_one(
            {
                '_id': self.id,
                'filename': self.filename,
                'content': self.content}
        )
