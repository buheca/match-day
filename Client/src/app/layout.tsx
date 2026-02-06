import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatchDay - Tinder for Football",
  description: "Find football matches and players near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}