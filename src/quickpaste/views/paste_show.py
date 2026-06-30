from datetime import UTC, datetime
from urllib.parse import urlencode

from flask import render_template, request

from quickpaste.database import pastes
from quickpaste.helpers import abort_if, highlight


def paste_show(id, extension=None):
    paste = pastes.get_paste(id)
    abort_if(paste is None, 404)

    # TODO: revisit highlihted lines
    # highlighted = request.args.get('h')
    # if highlighted:
    #     highlighted = highlighted.split(' ')

    if paste["delete_at"] is None:
        title = f"{request.path}{urlencode(request.args)}"
        seconds_left = None
    else:
        title = f"{request.path}{urlencode(request.args)}"
        seconds_left = (paste["delete_at"] - datetime.now(UTC)).total_seconds()

    return render_template(
        "paste_show.html",
        id=id,
        text=highlight(paste["text"], extension),
        text_raw=paste["text"],
        seconds_left=seconds_left,
        extension=extension,
        lines=paste["text"].count("\n") + 1,
        title=title,
        title_link=request.url,
    )
