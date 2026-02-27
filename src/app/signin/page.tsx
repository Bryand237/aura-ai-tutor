"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/lib/actions";

import styles from "./page.module.css";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "SignUp",
};

export default function Page() {
  const [errorMessage, formAction] = useActionState(register, undefined);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link href="/" className="block text-center no-underline">
          <div className={styles.logo} aria-hidden>
            <span className="text-3xl font-black">AI</span>
          </div>
          <h3 className="mb-1 font-bold text-slate-900">Aura AI</h3>
          <p className="text-sm text-slate-500">Créer un compte</p>
        </Link>

        <h4 className="mb-4 text-center text-xl font-bold text-slate-900">
          Inscription
        </h4>

        <form action={formAction}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={styles.input}
              placeholder="Jean Dupont"
              autoComplete="name"
              required
            />
          </div>

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
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="mb-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-(--emeraude)"
                required
              />
              <span className="text-sm text-slate-500">
                J&apos;accepte les conditions d&apos;utilisation et la politique
                de confidentialité
              </span>
            </label>
          </div>

          <button type="submit" className={styles.button}>
            Créer mon compte
          </button>
        </form>

        {typeof errorMessage === "string" && errorMessage.length > 0 && (
          <p className="mt-3 text-center text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <p className="mb-0 mt-3 text-center text-slate-500">
          Déjà un compte ?{" "}
          <Link href="/login" className={styles.link}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
