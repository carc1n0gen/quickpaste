export function getBaseUrl() {
  return process.env.BASE_URL || `http://127.0.0.1:${process.env.PORT}`;
}
