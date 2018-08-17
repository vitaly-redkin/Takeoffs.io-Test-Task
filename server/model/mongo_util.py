import pymongo

import config

SEQ_COLLECTION = 'seq'

def get_new_id(entity_type):
    seq_coll = get_db()[SEQ_COLLECTION]
    doc = seq_coll.find_one_and_update(
        {'_id': entity_type},
        {'$inc': {'last_id': 1}},
        upsert=True,
        return_document=pymongo.ReturnDocument.AFTER)
    new_id = doc['last_id']
    return new_id

def drop_db():
    client = pymongo.MongoClient(config.MONGO_CONNECTION_STRING)
    client.drop_database(config.MONGO_DATABASE_NAME)

def get_db():
    client = pymongo.MongoClient(config.MONGO_CONNECTION_STRING)
    db = client[config.MONGO_DATABASE_NAME]
    return db
