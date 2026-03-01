import { Metadata } from "next";
import { coursData } from "@/app/lib/data";
import Link from "next/link";
import styles from "./revision.module.css";
import CourseCard from "./CourseCard";

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

  let cours: Awaited<ReturnType<typeof coursData.listByUtilisateur>> = [];
  let loadError: string | null = null;

  try {
    cours = await coursData.listByUtilisateur(id_utilisateur);
  } catch (error) {
    console.error("[revision] Failed to load cours", error);
    loadError = "Impossible de charger tes cours pour le moment.";
  }

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

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${id_utilisateur}/dashboard/revision/create`}
              className={`px-4 py-2 text-sm font-semibold no-underline ${styles.primaryButton}`}
            >
              Ajouter un cours
            </Link>

            <div className={`px-4 py-2 text-sm ${styles.badge}`}>
              {loadError ? "-" : cours.length} cours
            </div>
          </div>
        </div>
      </header>

      {loadError && (
        <div className={`p-6 ${styles.courseCard}`}>
          <p className={`text-sm ${styles.muted}`}>{loadError}</p>
        </div>
      )}

      {!loadError && cours.length === 0 ? (
        <div className={`p-6 ${styles.courseCard}`}>
          <p className={`text-sm ${styles.muted}`}>
            Aucun cours trouvé pour le moment.
          </p>
        </div>
      ) : !loadError ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cours.map((c) => {
            const date =
              c.date_creation instanceof Date
                ? c.date_creation
                : new Date(c.date_creation);

            return (
              <CourseCard
                key={c.id_cours}
                userId={id_utilisateur}
                cours={c}
                createdAt={date.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              />
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
