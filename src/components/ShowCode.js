"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import useToasts from "@/components/hooks/useToasts";

export default function ShowCode({ id, rawCode, highlightedCode, lang }) {
  const router = useRouter();
  const { addToast } = useToasts();

  const lineIds = useMemo(() => {
    return rawCode
      .split(/\r\n|\r|\n/)
      .map((_, idx) => [idx + 1, `L${idx + 1}`]);
  }, [rawCode]);

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(rawCode);
    addToast({
      message: "Code copied to clipboard!",
      type: "success",
      autoRemoveAfter: 5000,
    });
  }, [rawCode, addToast]);

  const onLineClick = useCallback(
    (e) => {
      e.preventDefault();
      const { id } = e.target;

      let newHash;
      if (location.hash === `#${id}`) {
        newHash = "";
      } else {
        newHash = `#${id}`;
      }

      const url = location.pathname + location.search + newHash;
      location.hash = newHash;
      router.push(url);
    },
    [router]
  );

  return (
    <>
      <div className="hidden md:flex bg-zinc-700 text-zinc-200 p-2 pb-2.5 border-b border-b-zinc-600">
        <Link
          href={`/${id}/download${lang ? `?lang=${lang}` : ""}`}
          className="underline"
          target="_blank"
        >
          download
        </Link>
        <Link href={`/${id}/plain`} className="ml-4 underline">
          view plain
        </Link>
        <button onClick={onCopy} className="ml-4 underline">
          copy text
        </button>
        <Link
          href={`/?clone=${id}${lang ? `&lang=${lang}` : ""}`}
          className="ml-4 underline"
        >
          clone & edit
        </Link>
      </div>
      <div className="flex flex-auto bg-zinc-700 text-zinc-200 overflow-x-hidden">
        <div className="text-right pr-2 text-zinc-400 border-r border-r-zinc-600 py-2 px-3">
          {lineIds.map(([lineNum, lineId]) => (
            <span key={lineId}>
              <Link
                href={`#${lineId}`}
                id={lineId}
                className={`line`}
                onClick={onLineClick}
              >
                {lineNum}
              </Link>
              <br />
            </span>
          ))}
        </div>
        <div className="m-2 overflow-x-auto">
          <pre>
            <code
              className="hljs"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            ></code>
          </pre>
        </div>
      </div>
    </>
  );
}
