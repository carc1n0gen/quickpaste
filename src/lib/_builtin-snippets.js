export const notFound = `# Not Found

**There doesn't seem to be anything here.**`;

export const about = `# Quickpaste

A dead simple code snippet sharing.

## Features

**Syntax highlighting**

Optionally select a language to get nice syntax highlighting once the snippet
is saved.

**Line highlighting**

Click on a line number to highlight and target the line with the # part of the
URL, and click it again to un-highlight and un-target it.

**Does not totally break without JavaScript**

No JavaScript is required to use the basic features of pasting code, saving it,
copying the link to share or targeting lines. But Shift-Clicking to highlight
lines without targeting, and un-highlighting lines (for example if someone
shared a link with you pre-highlighted) will not work.

**CLI Script**

[Here is a cli script for creating pastes from the command line.](https://quickpaste.net/cli?lang="mjs)

## FAQ

**How long are snippets kept for?**

Snippets are kept from 1 - 7 days. Default is 7.

**Is the code available?**

[github project](https://github.com/carc1n0gen/quickpaste)`;

export const cli = `#!/usr/bin/env node

import { parseArgs } from "util";
import readline from "readline";

const QUICKPASTE_URL = process.env.QUICKPASTE_URL || "https://quickpaste.net";

const options = {
  lang: {
    type: "string",
    short: "l",
    default: "",
  },
  deleteAfter: {
    type: "string",
    short: "d",
    default: "7",
  },
};

const {
  values: { lang, deleteAfter },
} = parseArgs({ options });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let text = "";
for await (const line of rl) {
  text += \`\${line}\\n\`;
}

const body = new FormData();
body.append("text", text.trim());
body.append("lang", lang);
body.append("deleteAfter", deleteAfter);

const response = await fetch(\`\${QUICKPASTE_URL}/save\`, {
  method: "POST",
  headers: {
    Accept: "text/plain",
  },
  body,
});

console.log(await response.text());`;
