import "./globals.css";

import Header from "@/components/Header";
import ToastList from "@/components/ToastList";
import { AppProvider } from "@/components/contexts/AppContext";

export const metadata = {
  title: "Quickpaste - dead simple code snippet sharing",
};

export default function RootLayout({ children }) {
  return (
    <AppProvider>
      <html lang="en">
        <link rel="icon" href="/icon.png" />
        <body className="bg-zinc-700 edit-height-fix">
          <Header />
          {children}
          <ToastList />
        </body>
      </html>
    </AppProvider>
  );
}
