import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  GraduationCap,
  LineChart,
  MessageSquare,
  User,
} from "lucide-react";
import {
  coursData,
  documentData,
  questionnaireData,
  sessionData,
  utilisateurData,
} from "@/app/lib/data";
import styles from "./dashboard.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard de l'utilisateur.",
};

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
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className={`mt-2 text-sm ${styles.muted}`}>
            Utilisateur invalide.
          </p>
        </div>
      </div>
    );
  }

  const user = await utilisateurData.getById(userId);
  const cours = await coursData.listByUtilisateur(userId);
  const docsCounts = await Promise.all(
    cours.map(async (c) => (await documentData.listByCours(c.id_cours)).length),
  );
  const documentsImported = docsCounts.reduce((a, b) => a + b, 0);

  const questionnaires = (
    await Promise.all(
      cours.map((c) => questionnaireData.listByCours(c.id_cours)),
    )
  ).flat();
  const sessions = await sessionData.listByUtilisateur(userId);

  const quizzesDone = sessions.filter((s) => {
    const q = questionnaires.find(
      (qq) => qq.id_questionnaire === s.id_questionnaire,
    );
    return q?.type_questionnaire === "qcm";
  }).length;

  const xpTotal = sessions.length * 120;
  const level = Math.max(1, Math.floor(xpTotal / 500) + 1);

  const recentSessions = [...sessions]
    .sort((a, b) => Number(b.date_debut) - Number(a.date_debut))
    .slice(0, 6)
    .map((s) => {
      const questionnaire = questionnaires.find(
        (q) => q.id_questionnaire === s.id_questionnaire,
      );
      const coursForQ = questionnaire
        ? cours.find((c) => c.id_cours === questionnaire.id_cours)
        : null;
      return { session: s, questionnaire, cours: coursForQ };
    });

  const docsCoverage = cours.length
    ? Math.round(
        (cours.filter((_, idx) => docsCounts[idx] > 0).length / cours.length) *
          100,
      )
    : 0;

  const nextSteps: { title: string; description: string; href: string }[] = [];
  if (cours.length === 0) {
    nextSteps.push({
      title: "Créer ton premier cours",
      description: "Ajoute un cours pour commencer à importer des documents.",
      href: `/${userId}/dashboard/revision`,
    });
  }
  if (documentsImported === 0) {
    nextSteps.push({
      title: "Importer des documents",
      description:
        "Ajoute un PDF/DOCX pour que l'IA puisse répondre avec ton contenu.",
      href: `/${userId}/dashboard/revision`,
    });
  }
  if (quizzesDone === 0) {
    nextSteps.push({
      title: "Faire un quiz",
      description: "Teste-toi avec un QCM pour mesurer ta progression.",
      href: `/${userId}/dashboard/training`,
    });
  }

  const displayName = user?.nom ?? `Utilisateur ${userId}`;

  return (
    <div
      className={`${styles.page} flex h-full min-h-0 p-4 flex-col gap-6 overflow-hidden`}
    >
      <header className={`p-6 ${styles.headerCard}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {displayName}</h1>
            <p className={`mt-1 text-sm ${styles.muted}`}>
              Un aperçu rapide de tes cours, documents et entraînements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`px-4 py-2 text-sm ${styles.badge}`}>
              Niveau {level}
            </div>
            <div className={`px-4 py-2 text-sm ${styles.badge}`}>
              {docsCoverage}% cours avec documents
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <section className="min-h-0 p-4 overflow-hidden lg:col-span-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <BookOpen className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{cours.length}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>Cours</div>
              </div>

              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{documentsImported}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>Documents</div>
              </div>

              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{quizzesDone}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>
                  Quiz réalisés
                </div>
              </div>

              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className={`${styles.iconBox} mb-4`}>
                  <LineChart className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold">{xpTotal}</div>
                <div className={`mt-1 text-sm ${styles.muted}`}>XP</div>
              </div>
            </div>
          </section>

          <section className="flex min-h-0 p-4 flex-col gap-6 overflow-hidden lg:col-span-4">
            <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
              <div className="text-sm font-semibold">Accès rapide</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href={`/${userId}/dashboard/revision`}
                  className="rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                >
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                  <div className="mt-3 text-sm font-semibold">Révision</div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Chat IA + docs
                  </div>
                </Link>

                <Link
                  href={`/${userId}/dashboard/training`}
                  className="rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                >
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  <div className="mt-3 text-sm font-semibold">Entraînement</div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Quiz + cartes
                  </div>
                </Link>

                <Link
                  href={`/${userId}/dashboard/progress`}
                  className="rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                >
                  <LineChart className="h-5 w-5 text-emerald-600" />
                  <div className="mt-3 text-sm font-semibold">Progression</div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Stats + objectifs
                  </div>
                </Link>

                <Link
                  href={`/${userId}/dashboard/profile`}
                  className="rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                >
                  <User className="h-5 w-5 text-emerald-600" />
                  <div className="mt-3 text-sm font-semibold">Profil</div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Badges + niveau
                  </div>
                </Link>
              </div>
            </div>

            {nextSteps.length ? (
              <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
                <div className="text-sm font-semibold">Prochaines étapes</div>
                <div className="mt-4 space-y-3">
                  {nextSteps.slice(0, 3).map((s) => (
                    <Link
                      key={s.title}
                      href={s.href}
                      className="block rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                    >
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className={`mt-1 text-xs ${styles.muted}`}>
                        {s.description}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <section className="flex min-h-0 p-4 flex-col gap-6 overflow-hidden lg:col-span-8">
            <div
              className={`p-6 ${styles.card} flex min-h-0 flex-col overflow-hidden`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">Activité récente</div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Dernières sessions d&apos;entraînement.
                  </div>
                </div>
                <div className={`px-3 py-1 text-xs ${styles.badge}`}>
                  {recentSessions.length}
                </div>
              </div>

              <div
                className={`mt-5 flex-1 min-h-0 p-4 ${styles.scrollArea} space-y-3 pr-1`}
              >
                {recentSessions.length === 0 ? (
                  <div className={`p-6 ${styles.card}`}>
                    <p className={`text-sm ${styles.muted}`}>
                      Aucune session pour le moment.
                    </p>
                  </div>
                ) : (
                  recentSessions.map((r) => {
                    const date = r.session.date_debut;
                    const type = r.questionnaire?.type_questionnaire ?? "";
                    const title =
                      r.questionnaire?.titre ??
                      `Questionnaire #${r.session.id_questionnaire}`;
                    const courseTitle = r.cours?.titre ?? "Cours";
                    const color =
                      type === "flashcard"
                        ? "text-blue-600"
                        : "text-emerald-600";

                    return (
                      <div
                        key={r.session.id_session}
                        className="rounded-2xl p-4 shadow-(--neu-raised-sm)"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">{title}</div>
                            <div className={`mt-1 text-xs ${styles.muted}`}>
                              {courseTitle}
                            </div>
                          </div>
                          <div className={`text-xs font-semibold ${color}`}>
                            {type === "flashcard" ? "Flashcards" : "Quiz"}
                          </div>
                        </div>
                        <div className={`mt-2 text-xs ${styles.muted}`}>
                          {date.toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}{" "}
                          ·{" "}
                          {date.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {r.session.date_fin ? "" : " · en cours"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                <Link
                  href={`/${userId}/dashboard/training`}
                  className="rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                >
                  <div className="text-sm font-semibold">
                    Continuer l&apos;entraînement
                  </div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Reprends un quiz ou une série de flashcards.
                  </div>
                </Link>
                <Link
                  href={`/${userId}/dashboard/revision`}
                  className="rounded-2xl p-4 shadow-(--neu-raised-sm) no-underline"
                >
                  <div className="text-sm font-semibold">
                    Poser une question à l&apos;IA
                  </div>
                  <div className={`mt-1 text-xs ${styles.muted}`}>
                    Utilise tes documents comme contexte.
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
