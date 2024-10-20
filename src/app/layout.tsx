import type { Metadata } from "next";
import "./globals.css";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'], // Specify desired weights
});

export const metadata: Metadata = {
  title: "Churairat SE",
  description: "Churairat Search Engine Version Beta 0.5.0|20oct24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${kanit.className} antialiased`}>{children}</body>
    </html>
  );
}
