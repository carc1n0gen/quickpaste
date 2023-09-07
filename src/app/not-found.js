import ShowCode from "@/components/ShowCode";
import hljs from "highlight.js";

const notFoundText = `# Not Found

**There doesn't seem to be anything here.**`;

export default function NotFound() {
  const highlightedCode = hljs.highlight(notFoundText, {
    language: "md",
  }).value;

  return (
    <ShowCode
      id="not-found"
      highlightedCode={highlightedCode}
      rawCode={notFoundText}
      lang="md"
    />
  );
}
