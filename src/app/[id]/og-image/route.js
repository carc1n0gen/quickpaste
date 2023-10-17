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

        .hljs {
          color: #d1d9e1;
        }

        pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#474949;color:#d1d9e1}.hljs-comment,.hljs-quote{color:#969896;font-style:italic}.hljs-addition,.hljs-keyword,.hljs-literal,.hljs-selector-tag,.hljs-type{color:#c9c}.hljs-number,.hljs-selector-attr,.hljs-selector-pseudo{color:#f99157}.hljs-doctag,.hljs-regexp,.hljs-string{color:#8abeb7}.hljs-built_in,.hljs-name,.hljs-section,.hljs-title{color:#b5bd68}.hljs-class .hljs-title,.hljs-selector-id,.hljs-template-variable,.hljs-title.class_,.hljs-variable{color:#fc6}.hljs-name,.hljs-section,.hljs-strong{font-weight:700}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-subst,.hljs-symbol{color:#f99157}.hljs-deletion{color:#dc322f}.hljs-formula{background:#eee8d5}.hljs-attr,.hljs-attribute{color:#81a2be}.hljs-emphasis{font-style:italic}
      </style>
      <pre><code class="hljs">${highlightedCode}</code></pre>
    `,
  });
  return new Response(image);
}
