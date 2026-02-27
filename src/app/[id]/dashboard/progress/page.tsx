import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Flame,
  LineChart,
  Trophy,
  ArrowLeft,
  Microscope,
  Dna,
  Atom,
  Calculator,
} from "lucide-react";
import {
  coursData,
  documentData,
  questionnaireData,
  sessionData,
} from "@/app/lib/data";
import styles from "./progress.module.css";

export const metadata: Metadata = {
  title: "Progression",
  description: "Progression de l'utilisateur.",
};

function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function masteryLevel(pct: number) {
  if (pct >= 80) return { label: "Expert", tone: "text-emerald-600" };
  if (pct >= 60) return { label: "Avancé", tone: "text-blue-600" };
  if (pct >= 40) return { label: "Intermédiaire", tone: "text-amber-700" };
  return { label: "Débutant", tone: "text-slate-500" };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isFinite(userId)) {
    return (
      <div className={styles.page}>
        <div className={`p-6 ${styles.headerCard}`}>
          <h1 className="text-2xl font-bold">Progression</h1>
          <p className={`mt-2 text-sm ${styles.muted}`}>
            Utilisateur invalide.
          </p>
        </div>
      </div>
    );
  }

  const cours = await coursData.listByUtilisateur(userId);
  const allQuestionnaires = (
    await Promise.all(
      cours.map((c) => questionnaireData.listByCours(c.id_cours)),
    )
  ).flat();

  const sessions = await sessionData.listByUtilisateur(userId);
  const sessionsByQuestionnaire = new Map<number, number>();
  for (const s of sessions) {
    sessionsByQuestionnaire.set(
      s.id_questionnaire,
      (sessionsByQuestionnaire.get(s.id_questionnaire) ?? 0) + 1,
    );
  }

  const docsCounts = await Promise.all(
    cours.map(async (c) => {
      const docs = await documentData.listByCours(c.id_cours);
      return docs.length;
    }),
  );

  const documentsImported = docsCounts.reduce((a, b) => a + b, 0);
  const subjectsStudied = cours.length;
  const totalSessions = sessions.length;
  const quizzesDone = sessions.filter((s) => {
    const q = allQuestionnaires.find(
      (qq) => qq.id_questionnaire === s.id_questionnaire,
    );
    return q?.type_questionnaire === "qcm";
  }).length;

  const xpTotal = totalSessions * 120;
  const streakDays = Math.min(14, Math.max(0, totalSessions));

  const masteryRows = cours.map((c, idx) => {
    const qcms = allQuestionnaires.filter(
      (q) => q.id_cours === c.id_cours && q.type_questionnaire === "qcm",
    );
    const count = qcms.reduce(
      (acc, q) => acc + (sessionsByQuestionnaire.get(q.id_questionnaire) ?? 0),
      0,
    );

    const pct = clampPct(Math.min(100, 20 + count * 20 + idx * 7));
    const level = masteryLevel(pct);
    return { cours: c, pct, level };
  });

  const weekly = [75, 90, 55, 95, 70, 85, 60];
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const goalsQuizTarget = 5;
  const goalsDocsTarget = Math.max(1, cours.length);

  const weeklyQuizDone = Math.min(goalsQuizTarget, quizzesDone);
  const weeklyDocsDone = Math.min(
    goalsDocsTarget,
    cours.filter((_, i) => docsCounts[i] > 0).length,
  );

  const goalsQuizPct = clampPct((weeklyQuizDone / goalsQuizTarget) * 100);
  const goalsDocsPct = clampPct((weeklyDocsDone / goalsDocsTarget) * 100);

  const icons = [Microscope, Dna, Atom, Calculator];

  return (
    <div
      className={`${styles.page} flex h-full min-h-0 p-4 flex-col gap-6 overflow-hidden`}
    >
      <header className={`p-6 ${styles.headerCard}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${userId}/dashboard`}
              className="rounded-full p-2 shadow-(--neu-raised-sm)"
              aria-label="Retour"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Progression</h1>
              <p className={`mt-1 text-sm ${styles.muted}`}>
                Statistiques complètes de ton apprentissage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 text-sm ${styles.badge}`}>
              <LineChart className="mr-2 inline h-4 w-4" />
              {totalSessions} sessions
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <section className="min-h-0 overflow-hidden p-4 lg:col-span-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{subjectsStudied}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>
                  Sujets étudiés
                </div>
              </div>

              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{documentsImported}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>
                  Documents importés
                </div>
              </div>

              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <Trophy className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">
                  {xpTotal.toLocaleString("fr-FR")}
                </div>
                <div className={`mt-1 text-sm ${styles.muted}`}>XP total</div>
              </div>

              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <Flame className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{streakDays}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>
                  Jours de streak
                </div>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-col gap-6 overflow-hidden p-4 lg:col-span-8">
            <div
              className={`p-6 ${styles.card} flex min-h-0 flex-col overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Maîtrise par sujet</h2>
                <div className={`px-3 py-1 text-xs ${styles.badge}`}>
                  {masteryRows.length}
                </div>
              </div>

              <div
                className={`mt-5 flex-1 min-h-0 rounded-xl p-2 ${styles.scrollArea} space-y-3 pr-1`}
              >
                {masteryRows.length === 0 ? (
                  <p className={`text-sm ${styles.muted}`}>
                    Aucun cours pour le moment.
                  </p>
                ) : (
                  masteryRows.map((r, idx) => {
                    const Icon = icons[idx % icons.length];
                    return (
                      <div
                        key={r.cours.id_cours}
                        className={`${styles.row} ${styles.cardHover}`}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className={styles.iconBox}>
                              <Icon className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold">
                                {r.cours.titre}
                              </div>
                              <div className={`mt-1 text-xs ${styles.muted}`}>
                                Taux d&apos;apprentissage : {r.pct}%
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 md:min-w-[260px] md:max-w-[360px] md:flex-1">
                            <div className={`flex-1 ${styles.bar}`}>
                              <div
                                className={styles.barFill}
                                style={{ width: `${r.pct}%` }}
                              />
                            </div>
                            <div
                              className={`text-xs font-semibold ${r.level.tone}`}
                            >
                              {r.level.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-col p-4 gap-6 overflow-hidden lg:col-span-4">
            <div
              className={`p-6 ${styles.card} flex min-h-0 flex-col overflow-hidden`}
            >
              <h2 className="text-sm font-semibold">Activité hebdomadaire</h2>
              <div className="mt-4 flex-1 min-h-0">
                <div className="flex h-48 items-end justify-between gap-2">
                  {weekly.map((h, idx) => (
                    <div
                      key={weekDays[idx]}
                      className="flex w-full flex-col items-center gap-2"
                    >
                      <div
                        className="w-8 rounded-t-xl"
                        style={{
                          height: `${h}%`,
                          background:
                            idx % 2 === 0
                              ? "var(--emeraude)"
                              : "var(--blue-electric)",
                        }}
                      />
                      <div className={`text-[11px] ${styles.muted}`}>
                        {weekDays[idx]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-6 ${styles.card} flex flex-col gap-4`}>
              <h2 className="text-sm font-semibold">Objectifs de la semaine</h2>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Quiz complétés</span>
                  <span className="font-semibold">
                    {weeklyQuizDone}/{goalsQuizTarget}
                  </span>
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${goalsQuizPct}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Documents étudiés</span>
                  <span className="font-semibold">
                    {weeklyDocsDone}/{goalsDocsTarget}
                  </span>
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${goalsDocsPct}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
