from quickpaste.database import pastes
from quickpaste.helpers import abort_if


def paste_raw(id, extension=None):
    paste = pastes.get_paste(id)
    abort_if(paste is None, 404)

    return (
        paste["text"],
        200,
        {
            "Content-type": "text/plain; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
        },
    )
