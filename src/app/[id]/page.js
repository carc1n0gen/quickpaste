import hljs from "highlight.js";
import { notFound } from "next/navigation";

import ShowCode from "@/components/ShowCode";
import { getPaste } from "@/lib/pastes";

export async function generateMetadata({
  params: { id },
  searchParams: { lang },
}) {
  return {
    title: `${id}${lang ? `.${lang}` : ""} - Quickpaste`,
    openGraph: {
      title: "Quickpaste",
      description:
        "Dead simple code sharing.  Paste some code, save, and share the generated link with a friend.",
      type: "website",
      url: `/${id}${lang ? `?lang=${lang}` : ""}`,
      images: [
        {
          url: `/${id}/og-image${lang ? `?lang=${lang}` : ""}`,
        },
      ],
    },
  };
}

export default async function ViewCode({ params, searchParams }) {
  const result = await getPaste(params.id);

  if (!result) {
    return notFound();
  }

  const highlightedCode = hljs.highlight(result.text, {
    language: searchParams.lang || "txt",
  }).value;

  return (
    <ShowCode
      id={params.id}
      highlightedCode={highlightedCode}
      rawCode={result.text}
      lang={searchParams.lang}
    />
  );
}
