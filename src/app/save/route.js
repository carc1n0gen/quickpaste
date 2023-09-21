import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

import { getBaseUrl } from "@/lib/functions";
import { getPaste, savePaste } from "@/lib/pastes";

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
    const baseUrl = getBaseUrl(req);

    if (req.headers.get("Accept") === "text/plain") {
      return new Response(
        `${baseUrl}/${upsertedId}${lang ? `?lang=${lang}` : ""}`
      );
    }

    return Response.redirect(
      `${baseUrl}/${upsertedId}${lang ? `?lang=${lang}` : ""}`
    );
  }
);
