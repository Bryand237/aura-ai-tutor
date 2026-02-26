import Link from "next/link";

import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link href="/" className="block text-center no-underline">
          <div className={styles.logo} aria-hidden>
            <span className="text-4xl font-black">AI</span>
          </div>
          <h3 className="mb-1 font-bold text-slate-900">Aura AI</h3>
          <p className="text-sm text-slate-500">Tuteur Intelligent - IUT</p>
        </Link>

        <h4 className="mb-4 text-center text-xl font-bold text-slate-900">
          Connexion
        </h4>

        <form>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="ton@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="mb-4 flex items-center justify-between gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 accent-(--emeraude)" />
              <span className="text-sm text-slate-700">Se souvenir de moi</span>
            </label>

            <Link href="#" className={`${styles.link} text-sm`}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className={styles.button}>
            Se connecter
          </button>
        </form>

        <p className="mb-0 mt-3 text-center text-slate-500">
          Pas encore de compte ?{" "}
          <Link href="/signin" className={styles.link}>
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
