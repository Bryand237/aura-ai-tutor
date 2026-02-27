"use client";

import { useMemo, useState } from "react";
import styles from "../../training.module.css";
import type {
  Question,
  Questionnaire,
  ReponseSession,
  SessionEntrainement,
} from "@/app/lib/definitions";

export default function FlashcardClient({
  userId,
  coursId,
  questionnaires,
  questions,
  sessions,
  reponses,
}: {
  userId: number;
  coursId: number;
  questionnaires: Questionnaire[];
  questions: Question[];
  sessions: SessionEntrainement[];
  reponses: ReponseSession[];
}) {
  const deck = useMemo(() => {
    return questionnaires.find(
      (q) => q.type_questionnaire === "flashcard" && q.id_cours === coursId,
    );
  }, [questionnaires, coursId]);

  const deckQuestions = useMemo(() => {
    if (!deck) return [];
    return questions.filter(
      (q) => q.id_questionnaire === deck.id_questionnaire,
    );
  }, [questions, deck]);

  const history = useMemo(() => {
    if (!deck) return [];

    const questionIds = new Set(deckQuestions.map((q) => q.id_question));

    return sessions
      .filter(
        (s) =>
          String(s.id_utilisateur) === String(userId) &&
          s.id_questionnaire === deck.id_questionnaire,
      )
      .map((s) => {
        const sessionResponses = reponses.filter(
          (r) => r.id_session === s.id_session,
        );
        const done = sessionResponses.filter((r) =>
          questionIds.has(r.id_question),
        ).length;
        const total = deckQuestions.length;
        return { session: s, done, total };
      })
      .sort(
        (a, b) => Number(b.session.date_debut) - Number(a.session.date_debut),
      );
  }, [deck, deckQuestions, sessions, reponses, userId]);

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = deckQuestions[index] ?? null;

  function next() {
    const nextIndex = (index + 1) % Math.max(deckQuestions.length, 1);
    setIndex(nextIndex);
    setFlipped(false);
  }

  if (!deck) {
    return (
      <div className={`p-6 ${styles.panel}`}>
        <p className={`text-sm ${styles.muted}`}>
          Aucun deck de flashcards n&apos;est disponible pour ce cours dans les
          données mock.
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.twoCols} min-h-0`}>
      <section
        className={`${styles.panel} flex min-h-0 flex-col overflow-hidden`}
      >
        <div className={`${styles.panelHeader} p-5`}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Historique</h2>
              <p className={`mt-1 text-xs ${styles.muted}`}>{deck.titre}</p>
            </div>
            <div className={`px-3 py-1 text-xs ${styles.badge}`}>
              {history.length}
            </div>
          </div>
        </div>

        <div className={`flex-1 p-5 ${styles.scrollArea} space-y-3`}>
          {history.length === 0 ? (
            <p className={`text-sm ${styles.muted}`}>
              Aucune session pour le moment.
            </p>
          ) : (
            history.map((h) => (
              <div
                key={h.session.id_session}
                className={`p-4 ${styles.option}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">
                    Session #{h.session.id_session}
                  </div>
                  <div className={`px-3 py-1 text-xs ${styles.badge}`}>
                    {h.done}/{h.total}
                  </div>
                </div>
                <div className={`mt-1 text-xs ${styles.muted}`}>
                  {h.session.date_debut.toLocaleDateString("fr-FR")}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section
        className={`${styles.panel} flex min-h-0 flex-col overflow-hidden`}
      >
        <div className={`${styles.panelHeader} p-5`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Flashcards</h2>
              <p className={`mt-1 text-xs ${styles.muted}`}>
                Carte {deckQuestions.length === 0 ? 0 : index + 1}/
                {deckQuestions.length}
              </p>
            </div>
            <button
              type="button"
              onClick={next}
              className="rounded-full px-4 py-2 text-xs shadow-(--neu-raised-sm)"
              disabled={deckQuestions.length === 0}
            >
              Suivant
            </button>
          </div>
        </div>

        <div
          className={`flex-1 p-5 ${styles.scrollArea} flex items-center justify-center`}
        >
          {!current ? (
            <p className={`text-sm ${styles.muted}`}>
              Aucune carte disponible.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              className={`w-full max-w-xl p-8 text-left ${styles.flashcard} ${flipped ? styles.flashcardPressed : ""}`}
            >
              <div className={`text-xs ${styles.muted}`}>
                {flipped ? "Réponse" : "Question"}
              </div>
              <div className="mt-3 text-base font-semibold">
                {flipped
                  ? (current.explication ?? "(Aucune réponse)")
                  : current.texte}
              </div>
              <div className={`mt-6 text-xs ${styles.muted}`}>
                Clique pour retourner la carte.
              </div>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
