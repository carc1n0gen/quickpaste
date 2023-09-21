import { useEffect } from "react";

import useToasts from "./useToasts";

export default function useToastEffects(ref, toast) {
  const { removeToast } = useToasts();

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
  }, [ref, toast.id, toast.autoRemoveAfter, removeToast]);

  // fade in effect
  useEffect(() => {
    setTimeout(() => {
      ref?.current.classList.toggle("opacity-100");
    }, 100);
  }, [ref]);
}
