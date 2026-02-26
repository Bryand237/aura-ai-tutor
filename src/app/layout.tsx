import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/fonts";

export const metadata: Metadata = {
  title: "Aura AI | Tuteur Inteligent",
  description: "Application Web de tutorat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${poppins.className} antialiased`}>{children}</body>
    </html>
  );
}
