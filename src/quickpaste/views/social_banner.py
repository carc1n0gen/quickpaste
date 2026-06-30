from pygments.formatters.img import JpgImageFormatter
from pygments.styles.native import NativeStyle

from quickpaste.database import pastes
from quickpaste.helpers import abort_if, highlight


class QuickPasteStyle(NativeStyle):
    background_color = "rgb(63, 63, 70)"


def generate_social_image(doc, extension):
    return highlight(
        doc["text"],
        extension,
        JpgImageFormatter,
        # hl_lines=highlighted # TODO: revisit highlighting in the images
        style=QuickPasteStyle,
        line_pad=10,
        line_number_bg="rgb(63, 63, 70)",
        line_number_fg="#6f6f6f",
        line_number_pad=20,
        font_size=32,
    )


def social_banner(id, extension=None):
    paste = pastes.get_paste(id)
    abort_if(paste is None, 404)
    return generate_social_image(paste, extension), {"Content-Type": "image/jpeg"}
