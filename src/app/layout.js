import GoogleAnalytics from "#components/GoogleAnalytics";
import Header from "#components/Header";
import ToastList from "#components/ToastList";
import { AppProvider } from "#components/contexts/AppContext";
import { getBaseUrl } from "#lib/functions";

import "./globals.css";

export const metadata = {
  metadataBase: getBaseUrl(),
  title: "Quickpaste - dead simple code snippet sharing",
};

export default function RootLayout({ children }) {
  return (
    <AppProvider>
      <html lang="en">
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <body className="bg-zinc-700 edit-height-fix">
          <Header />
          {children}
          <ToastList />
          <GoogleAnalytics />
        </body>
      </html>
    </AppProvider>
  );
}
