import json
import secrets
from datetime import UTC, datetime

import click
import pymongo
from waitress import serve as waitress_serve

from quickpaste.database import mongo

# from quickpaste.database.mongo_operations import database
from quickpaste.permanent_pastes import about_text, cli_text


def configure_delete_index():
    # pastes = database["pastes"]

    try:
        mongo.db.pastes.drop_index("paste_ttl")
    except pymongo.errors.OperationFailure:
        pass

    mongo.db.pastes.create_index("delete_at", expireAfterSeconds=0, name="paste_ttl")


def create_or_update_permanent_pastes():
    mongo.db.pastes.update_one(
        {"_id": "about"},
        {"$set": {"_id": "about", "text": about_text, "created_at": datetime.now(UTC), "delete_at": None}},
        upsert=True,
    )

    mongo.db.pastes.update_one(
        {"_id": "cli"},
        {"$set": {"_id": "cli", "text": cli_text, "created_at": datetime.now(UTC), "delete_at": None}},
        upsert=True,
    )


def create_cli(app):
    @app.cli.command(help="Run the app using the Waitress WSGI server.")
    @click.option("--host", default="0.0.0.0", show_default=True, help="The host to bind to.")
    @click.option("--port", default=8000, show_default=True, help="The port to bind to.")
    def serve(host, port):
        waitress_serve(app, host=host, port=port)

    @app.cli.command(help="Generate a random secret key.")
    @click.option("--length", default=32, show_default=True, help="The length of the secret key in bytes.")
    def generate_key(length):
        print(secrets.token_hex(length))

    @app.cli.command(help="Initialize or update system db settings.")
    def init_db():
        configure_delete_index()
        create_or_update_permanent_pastes()
        print("Database successfully initialized.")

    @app.cli.command(help="Dump the database as json lines to stdout.")
    def export_db():
        cursor = mongo.db.pastes.find()
        for item in cursor:
            print(
                json.dumps(
                    {
                        "_id": item["_id"],
                        "text": item["text"],
                        "created_at": item["created_at"].timestamp(),
                        "delete_at": item["delete_at"].timestamp() if item["delete_at"] else None,
                    }
                )
            )

    @app.cli.command(help="Read json lines from stdin.")
    def import_db():
        stdin = click.get_text_stream("stdin")
        while line := stdin.readline():
            paste = json.loads(line)
            mongo.db.pastes.insert_one(
                {
                    "_id": paste["_id"],
                    "text": paste["text"],
                    "created_at": datetime.fromtimestamp(paste["created_at"], tz=UTC),
                    "delete_at": datetime.fromtimestamp(paste["delete_at"], tz=UTC) if paste["delete_at"] else None,
                }
            )
