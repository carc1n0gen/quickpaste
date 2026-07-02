import os
import tomllib
import uuid
from functools import lru_cache

from flask import Flask, g
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from werkzeug.middleware.proxy_fix import ProxyFix

from quickpaste.database import mongo

from .create_cli import create_cli
from .create_handlers import create_handlers
from .create_routes import create_routes


def create_app():
    app = Flask(__name__)

    app.config.from_file(os.path.join(os.getcwd(), "quickpaste.toml"), load=tomllib.load, text=False)
    app.logger.setLevel(app.config.get("LOG_LEVEL", "INFO"))

    Limiter(get_remote_address, app=app)
    CSRFProtect(app)
    mongo.init_app(app, tz_aware=True)

    if app.config.get("BEHIND_PROXY", False):
        app.wsgi_app = ProxyFix(app.wsgi_app)

    create_cli(app)
    create_routes(app)
    create_handlers(app)

    @app.after_request
    def after_request_func(response):
        if "csrf_token" in g:
            response.headers["CSRF_TOKEN"] = g.csrf_token
        return response

    @app.context_processor
    @lru_cache()
    def inject_globals():
        return dict(cache_buster=uuid.uuid4())

    return app
