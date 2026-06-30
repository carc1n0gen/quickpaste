from datetime import UTC, datetime

from quickpaste.database import db
from quickpaste.helpers import make_id


def upsert_paste(updates: dict):
    created_at = updated_at = datetime.now(UTC)
    defaults = {"_id": make_id(), "created_at": created_at}

    merged = {**defaults, **updates, "updated_at": updated_at}
    db.pastes.update_one({"_id": merged["_id"]}, {"$set": merged}, upsert=True)
    return merged["_id"]


def get_paste(id):
    return db.pastes.find_one({"_id": id})


def delete_paste(id):
    return db.pastes.delete_one({"_id": id})
