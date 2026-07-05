import random

# import threading
from flask import abort, current_app
from pygments import highlight as pygment_highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import TextLexer, _iter_lexerclasses, get_lexer_for_filename
from pygments.util import ClassNotFound


def abort_if(condition, status_code):
    if condition:
        abort(status_code)


def get_random_string(length, charset):
    r = random.SystemRandom()
    alphabet_len = len(charset)
    s = [charset[r.randrange(alphabet_len)] for i in range(length)]
    return "".join(s)


def make_id():
    length = current_app.config.get("PASTE_ID_LENGTH", 7)
    charset = current_app.config.get(
        "PASTE_ID_CHARSET",
        "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-",
    )
    return get_random_string(length, charset)


def find_best_lexer(text, min_confidence=0.85):
    """
    Like the built in pygments guess_lexer, except has a minimum confidence
    level.  If that is not met, it falls back to plain text to avoid bad
    highlighting.

    :returns: Lexer instance
    """
    current_best_confidence = 0.0
    current_best_lexer = TextLexer
    for lexer in _iter_lexerclasses():
        confidence = lexer.analyse_text(text)
        if confidence == 1.0:
            return lexer()
        elif confidence > current_best_confidence and confidence >= min_confidence:
            current_best_confidence = confidence
            current_best_lexer = lexer

    return current_best_lexer()


def highlight(text, extension=None, formatter=HtmlFormatter, **formatter_options):
    try:
        lexer = get_lexer_for_filename("foo.{}".format(extension))
    except ClassNotFound:
        lexer = find_best_lexer(text)

    return pygment_highlight(text, lexer, formatter(**formatter_options))


# def fire_and_forget(fn, **args):
#     thread = threading.Thread(target=fn, args=args)
#     thread.start()
