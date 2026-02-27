import { Metadata } from "next";
import { coursData } from "@/app/lib/data";
import Link from "next/link";
import styles from "./revision.module.css";

export const metadata: Metadata = {
  title: "Revision",
  description: "Revision de l'utilisateur.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const id_utilisateur = Number(id);

  if (!Number.isFinite(id_utilisateur)) {
    return (
      <div className={styles.page}>
        <div className={`p-6 ${styles.headerCard}`}>
          <h1 className="text-2xl font-bold">Révision</h1>
          <p className={`mt-2 text-sm ${styles.muted}`}>
            Utilisateur invalide.
          </p>
        </div>
      </div>
    );
  }

  const cours = await coursData.listByUtilisateur(id_utilisateur);

  return (
    <div className={`${styles.page} space-y-6`}>
      <header className={`p-6 ${styles.headerCard}`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Révision</h1>
            <p className={`mt-1 text-sm ${styles.muted}`}>
              Retrouvez vos cours et reprenez là où vous vous êtes arrêté.
            </p>
          </div>

          <div className={`px-4 py-2 text-sm ${styles.badge}`}>
            {cours.length} cours
          </div>
        </div>
      </header>

      {cours.length === 0 ? (
        <div className={`p-6 ${styles.courseCard}`}>
          <p className={`text-sm ${styles.muted}`}>
            Aucun cours trouvé pour le moment.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cours.map((c) => {
            const date =
              c.date_creation instanceof Date
                ? c.date_creation
                : new Date(c.date_creation);

            return (
              <Link
                key={c.id_cours}
                href={`/${id_utilisateur}/dashboard/revision/${c.id_cours}/conversation`}
                className="block no-underline"
              >
                <article className={`p-6 ${styles.courseCard}`}>
                  <h2 className="text-lg font-semibold">{c.titre}</h2>

                  <p className={`mt-2 text-sm ${styles.muted}`}>
                    {c.description || "Aucune description."}
                  </p>

                  <div className={`mt-4 text-xs ${styles.muted}`}>
                    Créé le{" "}
                    {date.toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    })}
                  </div>
                </article>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}
