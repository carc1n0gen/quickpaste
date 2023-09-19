export function getBaseUrl(req) {
  const protocol = req.headers.get("X-Forwarded-Proto");
  const host = req.headers.get("Host");
  if (process.env.REVERSE_PROXY) {
    return `${protocol}://${host}`;
  }

  const url = new URL(req.url);
  return url.origin;
}
