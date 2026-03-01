"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { createCoursFromForm } from "@/app/lib/cours-actions";

type ActionState =
  | { ok: false; message: string }
  | { ok: true; coursId: number }
  | undefined;

export default function CreateCoursForm({ userId }: { userId: number }) {
  const router = useRouter();

  const isUserIdValid = Number.isFinite(userId) && userId > 0;

  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionState, formData: FormData) => {
      return createCoursFromForm(formData);
    },
    undefined,
  );

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      router.replace(
        `/${userId}/dashboard/revision/${state.coursId}/conversation`,
      );
    }
  }, [router, state, userId]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-(--neu-text)">
              Ajouter un cours
            </h1>
            <p className={`mt-1 text-sm ${styles.muted}`}>
              Crée un cours, puis ajoute tes documents (PDF/DOCX) pour démarrer la
              révision.
            </p>
          </div>

          <button
            type="button"
            className={`text-sm font-semibold ${styles.link}`}
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
                return;
              }
              router.push(`/${userId}/dashboard/revision`);
            }}
          >
            Retour
          </button>
        </div>

        {!isUserIdValid ? (
          <p className="mt-6 text-sm font-semibold text-red-600">
            Utilisateur invalide.
          </p>
        ) : (
          <form action={formAction} className="mt-6 space-y-4">
            <input type="hidden" name="userId" value={String(userId)} />

            <div>
              <label htmlFor="titre" className={styles.label}>
                Titre
              </label>
              <input
                id="titre"
                name="titre"
                type="text"
                className={styles.input}
                placeholder="Ex: Mathématiques - Analyse"
                required
                maxLength={120}
              />
            </div>

            <div>
              <label htmlFor="description" className={styles.label}>
                Description (optionnel)
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                placeholder="Ex: Limites, dérivées, intégrales et applications."
                rows={4}
                maxLength={600}
              />
            </div>

            {state && "ok" in state && !state.ok && (
              <p className="text-sm font-semibold text-red-600">
                {state.message}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className={styles.primaryButton}
                aria-disabled={isPending}
              >
                {isPending ? "Création..." : "Créer le cours"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
