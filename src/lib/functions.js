export function getBaseUrl(req) {
  if (process.env.REVERSE_PROXY) {
    return request.headers.get("origin");
  }

  const url = new URL(req.url);
  return url.origin;
}
