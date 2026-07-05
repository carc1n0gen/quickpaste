from flask_pymongo import PyMongo
from werkzeug.local import LocalProxy

mongo = PyMongo()


def get_database():
    assert mongo.db is not None, "PyMongo is not initialized"
    return mongo.db


db = LocalProxy(get_database)
