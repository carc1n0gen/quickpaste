from flask import current_app, flash, redirect, session, url_for

from quickpaste.database import pastes
from quickpaste.helpers import abort_if


def paste_delete(id, extension=None):
    if id in session.get("created_ids", []):
        result = pastes.delete_paste(id)
        abort_if(result.deleted_count != 1, 404)
        current_app.logger.debug(f"Deleted paste [{id}].")
        flash("Paste has been deleted.", category="success")
        return redirect(url_for("paste.edit"))

    current_app.logger.debug(f"Attempted to delete paste [{id}] that is not in session.")
    flash(f"You don't have permission to delete this paste [{id}].", category="error")
    return redirect(url_for("paste.show", id=id, extension=extension))
