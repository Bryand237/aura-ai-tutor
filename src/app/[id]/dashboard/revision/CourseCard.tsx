"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import type { Cours } from "@/app/lib/definitions";
import { deleteCoursFromForm } from "@/app/lib/cours-actions";
import { useRouter } from "next/navigation";
import styles from "./revision.module.css";

export default function CourseCard({
  userId,
  cours,
  createdAt,
}: {
  userId: number;
  cours: Cours;
  createdAt: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const href = useMemo(() => {
    return `/${userId}/dashboard/revision/${cours.id_cours}/conversation`;
  }, [cours.id_cours, userId]);

  return (
    <>
      <article className={`p-6 ${styles.courseCard}`}>
        <div className={styles.courseHeader}>
          <Link href={href} className="block flex-1 no-underline">
            <h2 className="text-lg font-semibold text-(--neu-text)">
              {cours.titre}
            </h2>
          </Link>

          <button
            type="button"
            className={styles.iconButton}
            onClick={() => setIsOpen(true)}
            aria-label="Supprimer le cours"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <Link href={href} className="block no-underline">
          <p className={`mt-2 text-sm ${styles.muted}`}>
            {cours.description || "Aucune description."}
          </p>

          <div className={`mt-4 text-xs ${styles.muted}`}>Créé le {createdAt}</div>
        </Link>
      </article>

      {isOpen && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Confirmation de suppression"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className={styles.modal}>
            <h3 className="text-lg font-bold text-(--neu-text)">
              Supprimer ce cours ?
            </h3>
            <p className={`mt-2 text-sm ${styles.muted}`}>
              Cette action est irréversible. Les documents, conversations et messages
              associés seront aussi supprimés.
            </p>

            <div className="mt-5">
              <p className="text-sm font-semibold text-(--neu-text)">
                {cours.titre}
              </p>
              <p className={`mt-1 text-xs ${styles.muted}`}>
                {cours.description || "Aucune description."}
              </p>
            </div>

            <div className={`mt-6 ${styles.modalActions}`}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                Annuler
              </button>
              <button
                type="button"
                className={styles.dangerButton}
                disabled={isPending}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("userId", String(userId));
                  fd.set("coursId", String(cours.id_cours));

                  startTransition(async () => {
                    await deleteCoursFromForm(fd);
                    setIsOpen(false);
                    router.refresh();
                  });
                }}
              >
                {isPending ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
