"use client";

import { createContext, useMemo, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  return (
    <AppContext.Provider
      value={useMemo(() => ({ toasts, setToasts }), [toasts, setToasts])}
    >
      {children}
    </AppContext.Provider>
  );
}
