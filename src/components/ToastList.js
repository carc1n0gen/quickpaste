"use client";

import Toast from "./Toast";
import useToasts from "./hooks/useToasts";

export default function ToastList() {
  const { toasts } = useToasts();
  return (
    <div className="fixed right-0 bottom-0" aria-live="assertive">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
