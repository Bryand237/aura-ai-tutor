"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full min-h-0 items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl p-8 text-center shadow-(--neu-raised)">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-(--neu-pressed)">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
        </div>
        <h1 className="mt-5 text-2xl font-bold">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-(--neu-text-muted)">
          Réessaie, ou reviens plus tard si le problème persiste.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-(--neu-raised-sm)"
          >
            <RotateCcw className="h-4 w-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold shadow-(--neu-raised-sm) no-underline"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
