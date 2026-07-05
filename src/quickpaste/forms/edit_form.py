from flask import current_app
from flask_wtf import FlaskForm
from wtforms import HiddenField, SelectField, TextAreaField, ValidationError
from wtforms.validators import DataRequired

delete_after_choices = [
    ("1", "delete after 1 day"),
    ("2", "delete after 2 days"),
    ("3", "delete after 3 days"),
    ("4", "delete after 4 days"),
    ("5", "delete after 5 days"),
    ("6", "delete after 6 days"),
    ("7", "delete after 7 days"),
]

languages_choices = [
    ("", "auto-detect language"),
    ("ada", "Ada"),
    ("sh", "Bash"),
    ("c", "C"),
    ("cs", "C#"),
    ("cpp", "C++"),
    ("clj", "Clojure"),
    ("cljs", "ClojureScript"),
    ("coffee", "CoffeeScript"),
    ("cr", "Crystal"),
    ("css", "CSS"),
    ("d", "D"),
    ("dart", "Dart"),
    ("django", "Django Template"),
    ("ex", "Elixir"),
    ("erl", "Erlang"),
    ("fs", "F#"),
    ("fish", "Fish"),
    ("f", "Fortran"),
    ("go", "Go"),
    ("groovy", "Groovy"),
    ("haml", "Haml"),
    ("hbs", "Handlebars"),
    ("hs", "Haskell"),
    ("html", "HTML"),
    ("ini", "INI"),
    ("java", "Java"),
    ("jsp", "Java Server Page"),
    ("js", "JavaScript"),
    ("json", "JSON"),
    ("jinja", "Jinja Template"),
    ("kt", "Kotlin"),
    ("less", "Less"),
    ("liquid", "Liquid Template"),
    ("lua", "Lua"),
    ("md", "Markdown"),
    ("moon", "MoonScript"),
    ("nim", "Nim"),
    ("m", "Objective-C"),
    ("ml", "OCaml"),
    ("pl", "Perl"),
    ("php", "PHP"),
    ("txt", "Plain Text"),
    ("py", "Python"),
    ("rb", "Ruby"),
    ("rs", "Rust"),
    ("scss", "SASS"),
    ("sql", "SQL"),
    ("swift", "Swift"),
    ("toml", "TOML"),
    ("twig", "Twig Template"),
    ("ts", "TypeScript"),
    ("vala", "Vala"),
    ("xml", "XML"),
    ("yaml", "YAML"),
]


class EditForm(FlaskForm):
    id = HiddenField()
    text = TextAreaField("Code", [DataRequired("Some text is required.")])
    delete_after = SelectField("Delete After (days)", choices=delete_after_choices, default="7")
    extension = SelectField("Language", choices=languages_choices)

    def validate_text(self, field):
        maxlength = current_app.config.get("PASTE_MAX_LENGTH")
        if maxlength and len(field.data) > maxlength:
            raise ValidationError(f"Your snippet is too long.  Max {maxlength} characters.")

    def validate_delete_after(self, field):
        try:
            value = int(field.data)
            if value < 1 or value > 7:
                raise ValidationError("Delete after must be between 1 and 7.")
        except TypeError:
            raise ValidationError("Delete after must be between 1 and 7.")
