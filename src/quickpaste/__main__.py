import click
from waitress import serve as waitress_serve

from quickpaste import create_app


@click.command(help="Run quickpaste using the Waitress WSGI server.")
@click.option("--host", default="0.0.0.0", show_default=True, help="The host to bind to.")
@click.option("--port", default=8000, show_default=True, help="The port to bind to.")
def main(host, port):
    app = create_app()
    click.echo(f"Starting quickpaste on {host}:{port}...")
    waitress_serve(app, host=host, port=port)


if __name__ == "__main__":
    main()
