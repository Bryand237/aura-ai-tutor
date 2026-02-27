import { Metadata } from "next";
import Link from "next/link";
import { coursData } from "@/app/lib/data";
import styles from "../training.module.css";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Entrainement",
  description: "Choisissez un mode d'entrainement.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; coursId: string }>;
}) {
  const { id, coursId } = await params;
  const userId = Number(id);
  const id_cours = Number(coursId);

  if (!Number.isFinite(userId) || !Number.isFinite(id_cours)) {
    notFound();
  }

  const cours = await coursData.getById(id_cours);

  if (!cours || String(cours.id_utilisateur) !== String(userId)) {
    notFound();
  }

  return (
    <div className={`${styles.page} space-y-6`}>
      <header className={`p-6 ${styles.headerCard}`}>
        <h1 className="text-2xl font-bold">Entrainement</h1>
        <p className={`mt-2 text-sm ${styles.muted}`}>{cours.titre}</p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link
          href={`/${userId}/dashboard/training/${id_cours}/quiz`}
          className="block no-underline"
        >
          <article className={`p-6 ${styles.card}`}>
            <h2 className="text-lg font-semibold">Quiz (QCM)</h2>
            <p className={`mt-2 text-sm ${styles.muted}`}>
              Réponds à des questions à choix multiples et suis ton score.
            </p>
          </article>
        </Link>

        <Link
          href={`/${userId}/dashboard/training/${id_cours}/flashcard`}
          className="block no-underline"
        >
          <article className={`p-6 ${styles.card}`}>
            <h2 className="text-lg font-semibold">Flashcards</h2>
            <p className={`mt-2 text-sm ${styles.muted}`}>
              Révise avec des cartes recto/verso. Clique pour révéler la
              réponse.
            </p>
          </article>
        </Link>
      </section>
    </div>
  );
}
