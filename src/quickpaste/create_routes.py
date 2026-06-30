from quickpaste.views import (
    paste_delete,
    paste_download,
    paste_edit,
    paste_raw,
    paste_show,
    social_banner,
)


def create_routes(app):
    app.add_url_rule("/", view_func=paste_edit, endpoint="paste.edit", methods=["GET", "POST"])

    app.add_url_rule("/<string:id>", view_func=paste_show, endpoint="paste.show", methods=["GET"])
    app.add_url_rule("/<string:id>.<string:extension>", "paste.show")

    app.add_url_rule("/raw/<string:id>", view_func=paste_raw, endpoint="paste.raw", methods=["GET"])
    app.add_url_rule("/raw/<string:id>.<string:extension>", "paste.raw", methods=["GET"])

    app.add_url_rule("/download/<string:id>", view_func=paste_download, endpoint="paste.download", methods=["GET"])
    app.add_url_rule("/download/<string:id>.<string:extension>", "paste.download", methods=["GET"])

    app.add_url_rule("/delete/<string:id>", view_func=paste_delete, endpoint="paste.delete", methods=["POST"])

    app.add_url_rule(
        "/social-banner/<string:id>.jpg", view_func=social_banner, endpoint="paste.social_banner", methods=["GET"]
    )
    app.add_url_rule(
        "/social-banner/<string:id>.<string:extension>.jpg",
        endpoint="paste.social_banner",
        methods=["GET"],
    )
