import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "./ui/fonts";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | Aura AI",
    default: "Aura AI | Tuteur Intelligent",
  },
  description: "Tuteur implemente avec l'IA pour l'aide a l'apprentissage",
  metadataBase: new URL("https://aura-ai-tutor.versel.app"),
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
