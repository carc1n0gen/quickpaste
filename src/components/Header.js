"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import useToasts from "@/components/hooks/useToasts";

export default function Header() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { addToast } = useToasts();

  const title = useMemo(() => {
    return params.id
      ? `${params.id}${
          searchParams.get("lang") ? `.${searchParams.get("lang")}` : ""
        }`
      : "quickpaste";
  }, [params.id, searchParams]);

  const onClick = useCallback(async () => {
    await navigator.clipboard.writeText(location);
    addToast({
      message: "Link copied to clipboard!",
      type: "success",
      autoRemoveAfter: 5000,
    });
  }, [addToast]);

  return (
    <header className="flex flex-col md:flex-row bg-zinc-800 text-zinc-200 pt-1 pr-3 pb-3 pl-3 border-b border-b-zinc-600">
      <span
        onClick={onClick}
        className="cursor-pointer mb-3 md:mb-0 underline decoration-blue-500 text-4xl font-bold text-center md:text-left"
      >
        {title}
      </span>
      <nav className="ml-auto mr-auto md:mr-0 text-2xl mt-2">
        <Link href="/about?lang=md">About</Link>
        <Link href="https://github.com/carc1n0gen/quickpaste" className="ml-7">
          Github
        </Link>
        {title !== "quickpaste" && (
          <Link
            href="/"
            className="ml-7 bg-blue-500 text-white border border-blue-400 rounded-md px-4 hover:bg-blue-700"
          >
            New Paste
          </Link>
        )}
      </nav>
    </header>
  );
}
