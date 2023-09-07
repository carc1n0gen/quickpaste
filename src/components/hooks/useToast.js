import { useCallback, useContext } from "react";
import { AppContext } from "@/components/contexts/AppContext";

export default function useToast() {
  const { toasts, setToasts } = useContext(AppContext);

  const addToast = useCallback(
    ({ message, type, autoRemoveAfter }) => {
      setToasts((prevToasts) => [
        ...prevToasts,
        { id: Date.now(), message, type, autoRemoveAfter },
      ]);
    },
    [setToasts]
  );

  const removeToast = useCallback(
    (id) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    },
    [setToasts]
  );

  return { toasts, addToast, removeToast };
}
