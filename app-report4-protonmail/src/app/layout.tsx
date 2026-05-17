import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App Report 4 — Proton Mail iOS",
  description:
    "Companion microsite for ISIS-3510 App Report 4: a static-analysis audit of the Proton Mail iOS application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
