export function getBaseUrl(request) {
  if (process.env.REVERSE_PROXY) {
    return request.headers.get("origin");
  }

  const url = new URL(request.url);
  return url.origin;
}
