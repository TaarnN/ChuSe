import type { Metadata } from "next";
import "./globals.css";
import { fredoka } from "./utils/fonts";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Churairat SE",
  description: "Churairat Search Engine Version Beta 0.3.0|5oc24s2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description ?? ""} />
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={metadata.description ?? ""} />
        <meta property="og:image" content="./favicon.ico" />

        <title>{metadata.title as string}</title>
      </Head>
      <body className={`${fredoka.className} antialiased`}>{children}</body>
    </html>
  );
}
