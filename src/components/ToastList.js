"use client";

import Toast from "./Toast";
import useToast from "./hooks/useToast";

export default function ToastList({}) {
  const { toasts } = useToast();
  return toasts.map((toast) => <Toast key={toast.id} toast={toast} />);
}
