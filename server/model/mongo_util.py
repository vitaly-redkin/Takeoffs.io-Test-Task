import pymongo

import config

# MongoDB collection names
SEQ_COLLECTION = 'seq'
TAKEOFF_COLLECTION = 'takeoff'


class MongoUtil:
    """
    Class with MongoDB related utility methods
    """

    @staticmethod
    def get_new_id(entity_type):
        """
        Generate new ID to use as an entity PK

        :param string entity_type: type of entity to generate ID for
        :return: new integer ID
        """
        seq_coll = MongoUtil.get_db()[SEQ_COLLECTION]
        doc = seq_coll.find_one_and_update(
            {'_id': entity_type},
            {'$inc': {'last_id': 1}},
            upsert=True,
            return_document=pymongo.ReturnDocument.AFTER)
        new_id = doc['last_id']
        return new_id

    @staticmethod
    def drop_db():
        """
        Drops MongoDB database
        """
        client = pymongo.MongoClient(config.MONGO_CONNECTION_STRING)
        client.drop_database(config.MONGO_DATABASE_NAME)

    @staticmethod
    def get_db():
        """
        Returns application MongoDB database.
        """
        client = pymongo.MongoClient(config.MONGO_CONNECTION_STRING)
        db = client[config.MONGO_DATABASE_NAME]
        return db

    @staticmethod
    def takeoff_collection():
        """
        Returns MongoDB collection for Takeoffs.
        """
        return MongoUtil.get_db()[TAKEOFF_COLLECTION]
