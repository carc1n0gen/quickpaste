import highlightCss from '!!css-loader?{"sourceMap":false,"exportType":"string"}!highlight.js/styles/rainbow.css';
import hljs from "highlight.js";
import { notFound } from "next/navigation";
import nodeHtmlToImage from "node-html-to-image";

import { getPaste } from "@/lib/pastes";

export async function GET(request, { params: { id } }) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get("lang") || "txt";
  const paste = await getPaste(id);

  if (!paste) {
    return notFound();
  }

  const highlightedCode = hljs.highlight(paste.text, {
    language: lang,
  }).value;

  const image = await nodeHtmlToImage({
    // TODO: Find a better way to get the hljs styles in to this instead of just pasting the css here 😭
    selector: "pre",
    html: `
      <style>
        body {
          display: table; /* this makes the body width match the longest code line */
          padding: 10px;
          background-color: rgb(63 63 70 );
          color: #d1d9e1;
        }

        ${highlightCss}
        
        .hljs {
          color: #d1d9e1;
          background: transparent;
        }
      </style>
      <pre><code class="hljs">${highlightedCode}</code></pre>
    `,
  });
  return new Response(image);
}
