"use client";

import { useRef } from "react";

import useToastEffects from "./hooks/useToastEffects";

const bgMap = {
  success: "bg-green-100",
  info: "bg-blue-100",
  error: "bg-red-100",
};

const textMap = {
  success: "text-green-900",
  info: "text-blue-900",
  error: "text-red-900",
};

const emojiMap = {
  success: "✅",
  info: "ℹ️",
  error: "🆘",
};

export default function Toast({ toast }) {
  const ref = useRef();
  useToastEffects(ref, toast);

  return (
    <div
      ref={ref}
      role="alert"
      className={`m-4 p-4 rounded transition-opacity opacity-0
      ${bgMap[toast.type]} ${textMap[toast.type]}`}
    >
      <span aria-hidden="true" className="mr-3">
        {emojiMap[toast.type]}
      </span>
      {toast.message}
    </div>
  );
}
