from quickpaste.database import pastes


def test_should_return_data_when_in_db(app, monkeypatch):
    with app.app_context():
        doc = pastes.get_paste("abcd")
        assert doc is not None
        assert doc["_id"] == "abcd"


def test_should_return_none_when_not_in_db(app, monkeypatch):
    with app.app_context():
        doc = pastes.get_paste("1234")
        assert doc is None
