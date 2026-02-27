import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  FileText,
  Flame,
  Microscope,
  Dna,
  Rocket,
} from "lucide-react";
import {
  coursData,
  documentData,
  questionnaireData,
  sessionData,
  utilisateurData,
} from "@/app/lib/data";
import styles from "./profile.module.css";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profil de l'utilisateur.",
};

function clampPct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getInitials(name: string) {
  const parts = name
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const second = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return `${first}${second}`.toUpperCase();
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
          <h1 className="text-2xl font-bold">Profil</h1>
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

  const displayName = user?.nom ?? `Utilisateur ${userId}`;
  const displayEmail = user?.email ?? "";

  const masteryCards = cours.slice(0, 6).map((c, idx) => {
    const pct = clampPct(
      Math.min(100, 35 + idx * 12 + (docsCounts[idx] ?? 0) * 6),
    );
    return { cours: c, pct };
  });

  const weekly = [60, 85, 45, 95];
  const weekDays = ["Lun", "Mar", "Mer", "Jeu"];

  const badges = [
    {
      title: "Maître du résumé",
      Icon: Award,
      tone: "text-amber-500",
      bg: styles.badgeGold,
      unlocked: xpTotal >= 300,
    },
    {
      title: "7 jours de streak",
      Icon: Flame,
      tone: "text-red-500",
      bg: styles.badgeRed,
      unlocked: sessions.length >= 7,
    },
    {
      title: "100% au Quiz final",
      Icon: Brain,
      tone: "text-blue-600",
      bg: styles.badgeBlue,
      unlocked: false,
    },
    {
      title: "Apprenti rapide",
      Icon: Rocket,
      tone: "text-emerald-600",
      bg: styles.badgeGreen,
      unlocked: sessions.length >= 3,
    },
  ];

  const icons = [Microscope, Dna, BookOpen, FileText];

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
              <h1 className="text-2xl font-bold">Profil</h1>
              <p className={`mt-1 text-sm ${styles.muted}`}>
                Gère ton profil et suis tes statistiques.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full min-h-0 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <section className="flex min-h-0 flex-col gap-6 p-4 overflow-hidden lg:col-span-4">
            <div className={`p-8 ${styles.card} text-center`}>
              <div className="mx-auto mb-5 w-fit">
                <div className={styles.avatar}>
                  <span className="text-2xl font-bold text-emerald-700">
                    {getInitials(displayName)}
                  </span>
                </div>
              </div>

              <div className="text-xl font-bold">{displayName}</div>
              <div className={`mt-1 text-sm ${styles.muted}`}>
                {displayEmail ? displayEmail : "Compte étudiant"} • Niveau{" "}
                {level}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-lg font-bold">{documentsImported}</div>
                  <div className={`text-xs ${styles.muted}`}>Docs</div>
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {xpTotal >= 1000
                      ? `${(xpTotal / 1000).toFixed(1)}k`
                      : xpTotal}
                  </div>
                  <div className={`text-xs ${styles.muted}`}>XP</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{quizzesDone}</div>
                  <div className={`text-xs ${styles.muted}`}>Quiz</div>
                </div>
              </div>
            </div>

            <div className={`p-6 ${styles.card} ${styles.cardHover}`}>
              <div className="text-sm font-semibold">Mes Badges</div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {badges.map((b) => (
                  <div
                    key={b.title}
                    className={`${styles.badgeItem} ${b.unlocked ? styles.badgeUnlocked : ""} ${b.unlocked ? b.bg : ""}`}
                    title={b.title}
                  >
                    <b.Icon className={`h-6 w-6 ${b.tone}`} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex min-h-0 p-4 flex-col gap-6 overflow-hidden lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {masteryCards.map((m, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={m.cours.id_cours}
                    className={`p-6 ${styles.card} ${styles.cardHover}`}
                  >
                    <div className={styles.iconBox}>
                      <Icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="mt-4 text-sm font-semibold">
                      {m.cours.titre}
                    </div>
                    <div className={`mt-1 text-xs ${styles.muted}`}>
                      Maîtrise estimée par l&apos;IA
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm font-semibold">
                      <span>{m.pct}%</span>
                    </div>
                    <div className={`mt-2 ${styles.bar}`}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={`p-6 ${styles.card} flex min-h-0 flex-col overflow-hidden`}
            >
              <div className="text-sm font-semibold">Activité de révision</div>
              <div className="mt-5 flex-1 min-h-0">
                <div className="flex h-48 items-end justify-between gap-3">
                  {weekly.map((h, idx) => (
                    <div
                      key={weekDays[idx]}
                      className="flex w-full flex-col items-center gap-2"
                    >
                      <div
                        className="w-10 rounded-t-xl"
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
          </section>
        </div>
      </div>
    </div>
  );
}
