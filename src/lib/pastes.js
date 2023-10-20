import highlightCss from '!!css-loader?{"sourceMap":false,"exportType":"string"}!highlight.js/styles/rainbow.css';
import hljs from "highlight.js";
import nodeHtmlToImage from "node-html-to-image";
import path from "path";

import * as snippets from "./_builtin-snippets";
import { makeId } from "./ids";
import { getCollection } from "./mongodb";

export async function savePaste(updates) {
  const pastes = await getCollection("pastes");
  const defaults = {
    _id: makeId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const merged = {
    ...defaults,
    ...updates,
  };

  // We are performing an upsert, so a new record is created if an existing
  // one is not found.  This let's us call this function for saving new
  // records, or updating exiting ones.
  return await pastes.updateOne(
    { _id: merged._id },
    { $set: merged },
    { upsert: true }
  );
}

export async function generateImage(id, text, lang = "txt") {
  const highlightedCode = hljs.highlight(text, {
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
          background-color: rgb(63 63 70);
          color: #d1d9e1;
        }

        ${highlightCss}

        .hljs {
          color: #d1d9e1;
          background-color: transparent;
        }
      </style>
      <pre><code class="hljs">${highlightedCode}</code></pre>
    `,
    type: "jpeg",
    quality: 50,
    output: path.join(process.cwd(), "public", "generated", `${id}.jpg`),
  });
}

export async function getPaste(id) {
  if (snippets[id]) {
    return {
      text: snippets[id],
    };
  }

  const pastes = await getCollection("pastes");
  const result = await pastes.findOne({ _id: id });

  if (!result) {
    return null;
  }

  return result;
}
