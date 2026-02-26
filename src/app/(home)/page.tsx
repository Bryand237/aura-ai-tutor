import {
  Brain,
  FileUp,
  MessageCircle,
  HelpCircle,
  LineChart,
  Rocket,
  Info,
} from "lucide-react";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";

export default function Home() {
  return (
    <>
      {/* Hero section */}
      <section className={styles.hero_section}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span
                className={`${styles.neu_badge} mb-3 inline-block text-xs md:text-sm`}
              >
                IUT - Université de Ngaoundéré
              </span>
              <h1 className={styles.hero_title}>
                Apprends mieux avec{" "}
                <span className="text-(--emeraude)">l&apos;IA</span>
              </h1>
              <p className={styles.hero_subtitle}>
                Aura AI est ton tuteur intelligent. Importe tes cours (PDF,
                DOCX), pose des questions, génère des quiz et des flashcards
                pour maîtriser tes sujets difficiles.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/signin"
                  className={`${styles.neu_btn} ${styles.neu_btn_primary} flex items-center gap-2 text-sm md:text-base`}
                >
                  <Rocket className="h-4 w-4" />
                  Commencer gratuitement
                </Link>
                <Link
                  href="/about"
                  className={`${styles.neu_btn} flex items-center gap-2 text-sm md:text-base`}
                >
                  <Info className="h-4 w-4" />
                  En savoir plus
                </Link>
              </div>
            </div>

            <div className="mt-8 flex justify-center md:mt-0 md:justify-center">
              <div className={styles.ai_orb_hero}>
                <Brain className="h-16 w-16 text-(--emeraude)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-2xl font-bold text-(--neu-text) md:text-3xl">
              Comment ça marche ?
            </h2>
            <p className="text-base text-(--neu-text-muted)">
              Tout ce dont tu as besoin pour réussir tes examens
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <FileUp className="h-7 w-7" />
              </div>
              <h5 className="fw-bold text-base text-(--neu-text)">
                Import de cours
              </h5>
              <p className="mt-2 text-sm text-(--neu-text-muted)">
                Importe tes PDF et DOCX. L&apos;IA analyse et structure ton
                contenu.
              </p>
            </div>

            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <MessageCircle className="h-7 w-7" />
              </div>
              <h5 className="fw-bold text-base text-(--neu-text)">
                Chat avec l&apos;IA
              </h5>
              <p className="mt-2 text-sm text-(--neu-text-muted)">
                Pose des questions sur tes cours. Obtiens des réponses
                instantanées.
              </p>
            </div>

            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <HelpCircle className="h-7 w-7" />
              </div>
              <h5 className="fw-bold text-base text-(--neu-text)">
                Quiz &amp; Flashcards
              </h5>
              <p className="mt-2 text-sm text-(--neu-text-muted)">
                Génère des quiz et flashcards pour t&apos;entraîner
                efficacement.
              </p>
            </div>

            <div className={styles.feature_card}>
              <div className={styles.feature_icon}>
                <LineChart className="h-7 w-7" />
              </div>
              <h5 className="fw-bold text-base text-(--neu-text)">
                Suivi de progression
              </h5>
              <p className="mt-2 text-sm text-(--neu-text-muted)">
                Visualise ta maîtrise par sujet et améliore-toi chaque jour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className={`${styles.neu_card} p-12 text-center`}>
            <h3 className="mb-3 text-2xl font-bold text-(--neu-text)">
              Prêt à booster ton apprentissage ?
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-base text-(--neu-text-muted)">
              Rejoins les étudiants de l&apos;UIT qui utilisent Aura AI pour
              réussir.
            </p>
            <Link
              href="/signin"
              className={`${styles.neu_btn} ${styles.neu_btn_primary} ${styles.neu_btn_lg}`}
            >
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
