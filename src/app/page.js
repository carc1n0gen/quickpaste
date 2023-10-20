import { getPaste } from "#lib/pastes";

const languages = {
  ada: "Ada",
  sh: "Bash",
  c: "C",
  cs: "C#",
  cpp: "C++",
  clj: "Clojure",
  cljs: "ClojureScript",
  coffee: "CoffeeScript",
  cr: "Crystal",
  css: "CSS",
  d: "D",
  dart: "Dart",
  django: "Django Template",
  ex: "Elixir",
  erl: "Erlang",
  fs: "F#",
  fish: "Fish",
  f: "Fortran",
  go: "Go",
  groovy: "Groovy",
  haml: "Haml",
  hbs: "Handlebars",
  hs: "Haskell",
  html: "HTML",
  ini: "INI",
  java: "Java",
  jsp: "Java Server Page",
  js: "JavaScript",
  json: "JSON",
  jinja: "Jinja Template",
  kt: "Kotlin",
  less: "Less",
  liquid: "Liquid Template",
  lua: "Lua",
  md: "Markdown",
  moon: "MoonScript",
  nim: "Nim",
  m: "Objective-C",
  ml: "OCaml",
  pl: "Perl",
  php: "PHP",
  py: "Python",
  rb: "Ruby",
  rs: "Rust",
  scss: "SASS",
  sql: "SQL",
  swift: "Swift",
  toml: "TOML",
  twig: "Twig Template",
  ts: "TypeScript",
  vala: "Vala",
  xml: "XML",
  yaml: "YAML",
};

export default async function Home({
  searchParams: { clone = null, lang = "" },
}) {
  let paste = {};
  if (clone) {
    paste = await getPaste(clone);
  }

  return (
    <form
      className="flex flex-1 flex-col text-zinc-200"
      method="POST"
      action="/save"
    >
      <div className="flex bg-zinc-700 text-zinc-200 p-2 border-b border-b-zinc-600">
        <select
          name="lang"
          defaultValue={lang}
          className="rounded-md bg-zinc-800 hidden md:block"
        >
          <option value="">no language selected</option>
          {Object.keys(languages).map((k) => (
            <option key={k} value={k}>
              {languages[k]}
            </option>
          ))}
        </select>
        <select
          name="deleteAfterDays"
          defaultValue="7"
          className="md:ml-2 mr-2 rounded-md bg-zinc-800 display-none"
        >
          <option value="1">delete after 1 days</option>
          <option value="2">delete after 2 days</option>
          <option value="3">delete after 3 days</option>
          <option value="4">delete after 4 days</option>
          <option value="5">delete after 5 days</option>
          <option value="6">delete after 6 days</option>
          <option value="7">delete after 7 days</option>
        </select>
        <button className="flex ml-auto bg-blue-500 text-white border border-blue-400 rounded-md px-8 py-2 hover:bg-blue-700">
          Save
        </button>
      </div>
      <textarea
        name="text"
        placeholder="type or paste some code"
        className="bg-zinc-700 border-transparent flex-auto focus:outline-0 font-mono"
        defaultValue={paste.text}
        required
      ></textarea>
    </form>
  );
}
