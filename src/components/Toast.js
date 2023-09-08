"use client";

import { useEffect, useRef } from "react";
import useToast from "@/components/hooks/useToast";

const colorMap = {
  success: "bg-green-400",
  info: "bg-yellow-400",
  error: "bg-red-400",
};

export default function Toast({ toast }) {
  const { removeToast } = useToast();
  const ref = useRef();

  // auto-remove the toast if configured to
  useEffect(() => {
    if (toast.autoRemoveAfter) {
      setTimeout(() => {
        // fade out effect
        ref?.current.classList.toggle("opacity-100");
        // actually delete the toast after the fade out
        setTimeout(() => {
          removeToast(toast.id);
        }, 1000);
      }, toast.autoRemoveAfter + 100);
    }
  }, [toast.id, toast.autoRemoveAfter, removeToast]);

  // fade in effect
  useEffect(() => {
    setTimeout(() => {
      ref?.current.classList.toggle("opacity-100");
    }, 100);
  }, []);

  return (
    <div
      ref={ref}
      role="alert"
      className={`m-4 p-4 rounded transition-opacity opacity-0 ${
        colorMap[toast.type]
      }`}
    >
      {toast.message}
    </div>
  );
}
