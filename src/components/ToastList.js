"use client";

import Toast from "./Toast";
import useToast from "./hooks/useToast";

export default function ToastList() {
  const { toasts } = useToast();
  return (
    <div className="fixed right-0 bottom-0" aria-live="assertive">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
