"use client";

import Link from "next/link";
import { Suspense, useActionState, useEffect } from "react";
import { authenticate } from "@/app/lib/actions";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { CircleAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import { Metadata } from "next";

const metadata: Metadata = {
  title: "Login",
};
export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  useEffect(() => {
    if (status !== "authenticated") return;
    const id = session?.user?.id;
    if (!id) return;
    router.replace(`/${id}/dashboard`);
  }, [router, session?.user?.id, status]);

  if (status === "loading") {
    return null;
  }

  if (status === "authenticated" && session?.user?.id) {
    return null;
  }

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

        <form action={formAction} className="space-y-3">
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
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <button
            type="submit"
            className={styles.button}
            aria-disabled={isPending}
          >
            Se connecter
          </button>
        </form>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <CircleAlert className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>

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
