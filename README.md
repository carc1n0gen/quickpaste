Quickpaste
==========

dead simple code snippet sharing tool.

Requirements
------------

- Python 3.11+
- poetry
- MongoDB

Setup
-----

1. Clone the repo somewhere. `stable` branch _should_ always be stable, but you can checkout the latest tag from [releases]() if you wish. (Note: the default branch is `develop`, so make sure you switch to `stable`)

    git clone https://github.com/carc1n0gen/quickpaste.git

    (optional) cd quickpaste && git checkout <version>

2. Install.

    `poetry install`

3. Initialize the database.

    `poetry run flask --app quickpaste init-db`

4. Compile css/js/assets.

    `npm run build`

5. Run.

    **Development**: `poetry run flask --app quickpaste run`

    **Production**: 
        `poetry run python -m quickpaste` or `poetry run flask --app quickpaste serve`

Configuration
-------------

Copy the `quickpaste.toml.example` file to `quickpaste.toml` in the same directory, and edit as needed. Below is a copy of the latest example config.

```toml
SECRET_KEY = "change me!"

LOG_LEVEL = "INFO"

MONGO_URI = "mongodb://localhost:27017/quickpaste"

RATELIMIT_DEFAULT = "2 per second"

PASTE_MAX_LENGTH = 10240
PASTE_ID_LENGTH = 7
PASTE_ID_CHARSET = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-"
```

CLI
---

There are a few commands used for administrating a quickpaste instance.

`poetry run flask --app quickpaste serve` - Runs quickpaste in a production ready server

`poetry run flask --app quickpaste generate-key` - Generates a secret key for the config file

`poetry run flask --app quickpaste init-db` - For creating/updating indexes and permanent pastes

`poetry run flask --app quickpaste export-db` - Dumps the database as json lines to stdout

`poetry run flask --app quickpaste import-db` - Imports json lines from stdin to the database
