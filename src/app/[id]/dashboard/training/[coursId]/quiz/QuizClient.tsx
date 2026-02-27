"use client";

import { useMemo, useState } from "react";
import styles from "../../training.module.css";
import type {
  Proposition,
  Question,
  Questionnaire,
  ReponseSession,
  SessionEntrainement,
} from "@/app/lib/definitions";

function formatScore(correct: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((correct / total) * 100)}%`;
}

export default function QuizClient({
  userId,
  coursId,
  questionnaires,
  questions,
  propositions,
  sessions,
  reponses,
}: {
  userId: number;
  coursId: number;
  questionnaires: Questionnaire[];
  questions: Question[];
  propositions: Proposition[];
  sessions: SessionEntrainement[];
  reponses: ReponseSession[];
}) {
  const quiz = useMemo(() => {
    return questionnaires.find(
      (q) => q.type_questionnaire === "qcm" && q.id_cours === coursId,
    );
  }, [questionnaires, coursId]);

  const quizQuestions = useMemo(() => {
    if (!quiz) return [];
    return questions.filter(
      (q) => q.id_questionnaire === quiz.id_questionnaire,
    );
  }, [questions, quiz]);

  const propsByQuestion = useMemo(() => {
    const map = new Map<number, Proposition[]>();
    for (const p of propositions) {
      const arr = map.get(p.id_question) ?? [];
      arr.push(p);
      map.set(p.id_question, arr);
    }
    return map;
  }, [propositions]);

  const history = useMemo(() => {
    if (!quiz) return [];

    const quizQuestionIds = new Set(quizQuestions.map((q) => q.id_question));

    return sessions
      .filter(
        (s) =>
          String(s.id_utilisateur) === String(userId) &&
          s.id_questionnaire === quiz.id_questionnaire,
      )
      .map((s) => {
        const sessionResponses = reponses.filter(
          (r) => r.id_session === s.id_session,
        );

        let correct = 0;
        let total = 0;

        for (const r of sessionResponses) {
          if (!quizQuestionIds.has(r.id_question)) continue;
          total += 1;
          if (r.est_correcte) correct += 1;
        }

        return { session: s, correct, total };
      })
      .sort(
        (a, b) => Number(b.session.date_debut) - Number(a.session.date_debut),
      );
  }, [quiz, quizQuestions, sessions, reponses, userId]);

  const [index, setIndex] = useState(0);
  const [selectedPropId, setSelectedPropId] = useState<number | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const current = quizQuestions[index] ?? null;
  const currentProps = current
    ? (propsByQuestion.get(current.id_question) ?? [])
    : [];

  const selectedProp =
    selectedPropId != null
      ? (currentProps.find((p) => p.id_proposition === selectedPropId) ?? null)
      : null;

  const isCorrect = selectedProp ? selectedProp.est_correcte : null;

  function next() {
    const nextIndex = (index + 1) % Math.max(quizQuestions.length, 1);
    setIndex(nextIndex);
    setSelectedPropId(null);
    setIsValidated(false);
  }

  if (!quiz) {
    return (
      <div className={`p-6 ${styles.panel}`}>
        <p className={`text-sm ${styles.muted}`}>
          Aucun quiz (QCM) n&apos;est disponible pour ce cours dans les données
          mock.
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
              <p className={`mt-1 text-xs ${styles.muted}`}>{quiz.titre}</p>
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
                    {formatScore(h.correct, h.total)}
                  </div>
                </div>
                <div className={`mt-1 text-xs ${styles.muted}`}>
                  {h.session.date_debut.toLocaleDateString("fr-FR")} ·{" "}
                  {h.correct}/{h.total} bonnes réponses
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
              <h2 className="text-lg font-semibold">Quiz (QCM)</h2>
              <p className={`mt-1 text-xs ${styles.muted}`}>
                Question {quizQuestions.length === 0 ? 0 : index + 1}/
                {quizQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={next}
                className="rounded-full px-4 py-2 text-xs shadow-(--neu-raised-sm)"
                disabled={quizQuestions.length === 0}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        <div className={`flex-1 p-5 ${styles.scrollArea} space-y-4`}>
          {!current ? (
            <p className={`text-sm ${styles.muted}`}>
              Aucune question disponible.
            </p>
          ) : (
            <>
              <div className={`p-6 ${styles.card}`}>
                <div className={`text-xs ${styles.muted}`}>Question</div>
                <div className="mt-2 text-base font-semibold">
                  {current.texte}
                </div>
              </div>

              <div className="space-y-3">
                {currentProps.map((p) => {
                  const selected = selectedPropId === p.id_proposition;
                  return (
                    <button
                      key={p.id_proposition}
                      type="button"
                      onClick={() => {
                        if (isValidated) return;
                        setSelectedPropId(p.id_proposition);
                      }}
                      className={`w-full text-left p-4 ${styles.option} ${selected ? styles.optionSelected : ""}`}
                      disabled={isValidated}
                    >
                      <div className="text-sm">{p.texte}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  onClick={() => setIsValidated(true)}
                  className="rounded-full px-4 py-2 text-sm font-medium shadow-(--neu-raised-sm) disabled:opacity-60"
                  disabled={selectedPropId == null || isValidated}
                >
                  Valider
                </button>

                {isValidated ? (
                  <div className={`text-sm ${styles.muted}`}>
                    {isCorrect ? "Bonne réponse." : "Mauvaise réponse."}
                  </div>
                ) : null}
              </div>

              {isValidated && current.explication ? (
                <div className={`p-5 ${styles.card}`}>
                  <div className={`text-xs ${styles.muted}`}>Explication</div>
                  <div className="mt-2 text-sm">{current.explication}</div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
