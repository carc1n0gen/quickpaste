from werkzeug.datastructures import MultiDict

from quickpaste.forms import EditForm


def test_should_fail_validation_when_all_required_missing(app):
    with app.app_context():
        form = EditForm()
        assert form.validate() is False
        assert len(form.errors) == 2


def test_should_fail_validation_when_some_required_missing(app):
    with app.app_context():
        form = EditForm(MultiDict([("text", "abcde"), ("delete_after", "4")]))
        assert form.validate() is False
        assert len(form.errors) == 1


def test_should_fail_validation_when_text_is_too_long(app):
    app.config["PASTE_MAX_LENGTH"] = 4
    with app.app_context():
        form = EditForm(MultiDict([("text", "abcde"), ("extension", ""), ("delete_after", "4")]))
        assert form.validate() is False
        assert len(form.errors) == 1
        assert form.text.errors[0] == "Your snippet is too long.  Max 4 characters."
