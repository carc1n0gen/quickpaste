import { getPaste } from "#lib/pastes";

export async function GET(req, { params }) {
  const result = await getPaste(params.id);
  const response = new Response(result.text);
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}
