import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

export const metadata: Metadata = {
  title: "airlabel",
  description: "Design beautiful personalized airline-style luggage tags",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect x='6' y='4' width='28' height='32' rx='3' fill='%23f5f5f4'/><circle cx='20' cy='10' r='3' fill='%231c1917'/><rect x='10' y='16' width='20' height='2' rx='1' fill='%231c1917' opacity='0.6'/><rect x='10' y='21' width='14' height='2' rx='1' fill='%231c1917' opacity='0.4'/><rect x='10' y='26' width='18' height='2' rx='1' fill='%231c1917' opacity='0.3'/><path d='M20 4 L20 0 M17 0 L23 0' stroke='%23f5f5f4' stroke-width='2' stroke-linecap='round'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="f3853e18-7d8d-4622-82e2-cdef416810b1"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
