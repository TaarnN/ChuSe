import type { Metadata } from "next";
import "./globals.css";
import { fredoka } from "./utils/fonts";

export const metadata: Metadata = {
  title: "Churairat Search Engine",
  description: "A search engine based on google.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className} antialiased`}>{children}</body>
    </html>
  );
}
