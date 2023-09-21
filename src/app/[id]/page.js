import hljs from "highlight.js";
import { notFound } from "next/navigation";

import ShowCode from "@/components/ShowCode";
import { getPaste } from "@/lib/pastes";

export async function generateMetadata({ params, searchParams }) {
  return {
    title: `${params.id}${
      searchParams.lang ? `.${searchParams.lang}` : ""
    } - Quickpaste`,
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
