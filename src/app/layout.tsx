import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/fonts";
import Providers from "./providers";

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
      <body className={`${poppins.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
