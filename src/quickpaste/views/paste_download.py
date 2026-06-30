from flask import current_app

from quickpaste.database import pastes
from quickpaste.helpers import abort_if


def paste_download(id, extension="txt"):
    paste = pastes.get_paste(id)
    abort_if(paste is None, 404)

    current_app.logger.debug(f"Downloading paste [{id}].")
    return (
        paste["text"],
        200,
        {
            "Content-Type": "text/plain; charset=utf-8",
            "Content-Disposition": f"attachment; filename={id}.{extension}",
        },
    )
