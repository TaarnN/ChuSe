import type { Metadata } from "next";
import "./globals.css";
import { fredoka } from "./utils/fonts";

export const metadata: Metadata = {
  title: "Churairat SE",
  description: "Churairat Search Engine Version Beta 0.0.2|3oc24",
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
