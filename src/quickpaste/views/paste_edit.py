import math
from datetime import UTC, datetime, timedelta

from flask import current_app, flash, redirect, render_template, request, session, url_for

from quickpaste.database import pastes
from quickpaste.forms import EditForm
from quickpaste.helpers import abort_if


def paste_edit():
    form = EditForm()
    if form.validate_on_submit():
        return post(form)
    return get(form)


def get(form):
    lang = request.args.get("lang")
    clone_id = request.args.get("clone")
    edit_id = request.args.get("edit")
    if edit_id and edit_id not in session.get("created_ids", []):
        current_app.logger.debug(f"Attempted to edit paste [{edit_id}] that is not in session.")
        flash(
            f"You don't have permission to edit this paste [{edit_id}].",
            category="error",
        )
        return redirect(url_for("paste.show", id=edit_id, extension=lang, _external=True))

    if edit_id:
        doc = pastes.get_paste(edit_id)
        abort_if(doc is None, 404)
    elif clone_id:
        doc = pastes.get_paste(clone_id)
        abort_if(doc is None, 404)
    else:
        doc = None

    if doc is not None and form.text.data is None:
        form.text.data = doc["text"]
        if doc["delete_at"]:
            form.delete_after.data = str(math.ceil((doc["delete_at"] - datetime.now(UTC)).total_seconds() / 86400))

        form.extension.data = lang
        form.id.data = edit_id if edit_id else None

    return render_template("paste_edit.html", form=form, title_link=request.url)


def post(form):
    id = form.id.data
    text = form.text.data
    delete_after_days = int(form.delete_after.data)
    extension = form.extension.data or None

    if id:
        paste = pastes.get_paste(id)
        abort_if(paste is None, 404)
        paste["text"] = text
        paste["delete_at"] = paste["created_at"] + timedelta(days=delete_after_days)
    else:
        paste = {
            "text": text,
            "delete_at": datetime.now(UTC) + timedelta(days=delete_after_days),
        }

    upserted_id = pastes.upsert_paste(paste)
    created_ids = session.get("created_ids", [])

    if upserted_id not in created_ids:
        created_ids.append(upserted_id)

    session["created_ids"] = created_ids

    accept = request.headers.get("Accept")
    if accept == "text/plain":
        return (
            url_for("paste.show", id=upserted_id, extension=extension, _external=True),
            200,
            {"Content-Type": "text/plain"},
        )
    return redirect(url_for("paste.show", id=upserted_id, extension=extension, _external=True))
