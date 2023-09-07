import { notFound } from "next/navigation";
import { savePaste, getPaste } from "@/lib/pastes";
import { NextResponse } from "next/server";

function validateReq(fn) {
  return async function (req) {
    const formData = await req.formData();
    const id = formData.get("id");
    const text = formData.get("text");
    const lang = formData.get("lang");
    const deleteAfterDays = parseInt(formData.get("deleteAfterDays"), 10);
    const errors = [];

    if (!text.trim()) {
      errors.push("text is required.");
    }

    if (isNaN(deleteAfterDays) || deleteAfterDays < 1 || deleteAfterDays > 7) {
      errors.push("deleteAfterDays must be an integer between 1 and 7.");
    }

    return fn(req, {
      errors,
      data: { id, text, lang, deleteAfterDays },
    });
  };
}

export const POST = validateReq(
  async (req, { errors, data: { id, text, lang, deleteAfterDays } }) => {
    const url = new URL(req.url);

    if (errors.length) {
      return NextResponse.json(
        { url, errors },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const deleteAfterDate = new Date(
      new Date().setDate(new Date().getDate() + deleteAfterDays)
    );

    let codeDocument;
    if (id) {
      codeDocument = await getPaste(id);
      if (!codeDocument) return notFound();
      codeDocument.text = text;
      codeDocument.deleteAfter = deleteAfterDate;
    } else {
      codeDocument = {
        text,
        deleteAfter: deleteAfterDate,
      };
    }

    const { upsertedId } = await savePaste(codeDocument);

    if (req.headers.get("Accept") === "text/plain") {
      return new Response(
        `${url.origin}/${upsertedId}${lang ? `?lang=${lang}` : ""}`
      );
    }

    return Response.redirect(
      `${url.origin}/${upsertedId}${lang ? `?lang=${lang}` : ""}`
    );
  }
);
