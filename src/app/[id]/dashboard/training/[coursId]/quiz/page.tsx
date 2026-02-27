import { Metadata } from "next";
import Link from "next/link";
import { coursData } from "@/app/lib/data";
import { notFound } from "next/navigation";
import {
  propositions,
  questions,
  questionnaires,
  reponses,
  sessions,
} from "@/app/lib/placeholder-data";
import QuizClient from "./QuizClient";
import styles from "../../training.module.css";

export const metadata: Metadata = {
  title: "Quiz",
  description: "Quiz (QCM) pour tester vos connaissances.",
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
    <div
      className={`${styles.page} flex h-full min-h-0 p-4 flex-col gap-6 overflow-hidden`}
    >
      <header className={`p-6 ${styles.headerCard}`}>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quiz</h1>
            <p className={`mt-1 text-sm ${styles.muted}`}>{cours.titre}</p>
          </div>
          <Link
            href={`/${userId}/dashboard/training/${id_cours}`}
            className="rounded-full px-4 py-2 text-sm shadow-(--neu-raised-sm) no-underline"
          >
            Retour
          </Link>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <QuizClient
          userId={userId}
          coursId={id_cours}
          questionnaires={questionnaires}
          questions={questions}
          propositions={propositions}
          sessions={sessions}
          reponses={reponses}
        />
      </div>
    </div>
  );
}
