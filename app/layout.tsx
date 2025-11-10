import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reindeer Games",
  description: "Manage and view possible events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

