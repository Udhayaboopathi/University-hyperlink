import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Periyar University Hyperlink Portal",
  description: "Periyar University Hyperlink Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
