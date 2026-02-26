import Link from "next/link";
import styles from "@/app/ui/home.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer_neu}>
      <div className="container mx-auto max-w-5xl px-4 text-center text-sm text-(--neu-text-muted)">
        <p className="mb-0">
          © 2025 Aura AI - Projet IUT, Université de Ngaoundéré, Cameroun
        </p>
        <div className="mt-2 flex justify-center gap-4">
          <Link
            href="/about"
            className="text-(--neu-text-muted) hover:text-(--emeraude)"
          >
            À propos
          </Link>
          <Link
            href="/help"
            className="text-(--neu-text-muted) hover:text-(--emeraude)"
          >
            Aide
          </Link>
          <Link
            href="/login"
            className="text-(--neu-text-muted) hover:text-(--emeraude)"
          >
            Connexion
          </Link>
        </div>
      </div>
    </footer>
  );
}
