import { getPaste } from "#lib/pastes";

export async function GET(req, { params }) {
  const { searchParams } = new URL(req.url);
  const result = await getPaste(params.id);

  let lang = searchParams.get("lang");
  if (!lang) {
    lang = "txt";
  }

  const response = new Response(result.text);
  response.headers.set(
    "Content-Disposition",
    `attachment; filename="${params.id}.${lang}`
  );
  return response;
}
