def test_should_return_image(client, monkeypatch):
    response = client.get("/social-banner/abcd.jpg")
    assert response.status_code == 200
    assert response.headers["Content-type"] == "image/jpeg"


def test_should_return_404(client, monkeypatch):
    response = client.get("/social-banner/1234.jpg")
    assert response.status_code == 404
    assert response.headers["Content-type"] == "text/html; charset=utf-8"
