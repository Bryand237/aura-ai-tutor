export default function Page() {
  return (
    <div className="py-10">
      <section className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-(--neu-text)">
          À propos d&apos;Aura AI
        </h1>
        <p className="text-base text-(--neu-text-muted)">
          Un tuteur intelligent conçu pour les étudiants de l&apos;UIT
        </p>
      </section>

      <section className="mb-8">
        <div className="grid gap-8 rounded-3xl bg-(--neu-bg) p-8 shadow-(--neu-raised) md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center">
          <div className="flex justify-center md:justify-start">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-(--neu-bg) text-3xl text-(--emeraude) shadow-(--neu-pressed)">
              M
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-(--neu-text)">
              Notre mission
            </h3>
            <p className="text-sm text-(--neu-text-muted) md:text-base">
              Aura AI a été développé au sein de l&apos;Unité d&apos;Innovation
              Technologique (UIT) de l&apos;Université de Ngaoundéré, au
              Cameroun. Notre objectif est d&apos;aider les étudiants à
              surmonter les difficultés d&apos;apprentissage en proposant un
              assistant IA personnalisé qui s&apos;adapte à leurs besoins. Que
              tu aies du mal avec un chapitre de biologie, des formules
              mathématiques ou des concepts de programmation, Aura AI est là
              pour t&apos;accompagner.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-(--neu-bg) p-6 shadow-(--neu-raised)">
          <h4 className="mb-3 text-lg font-bold text-(--neu-text)">
            Pour qui ?
          </h4>
          <p className="text-sm text-(--neu-text-muted) md:text-base">
            Aura AI s&apos;adresse à tous les étudiants de l&apos;Université de
            Ngaoundéré et au-delà. Que tu sois en médecine, en sciences, en
            lettres ou en informatique, notre plateforme t&apos;aide à
            comprendre, réviser et maîtriser tes cours.
          </p>
        </div>

        <div className="rounded-3xl bg-(--neu-bg) p-6 shadow-(--neu-raised)">
          <h4 className="mb-3 text-lg font-bold text-(--neu-text)">
            Comment ?
          </h4>
          <p className="text-sm text-(--neu-text-muted) md:text-base">
            Importe tes documents (PDF, DOCX), pose des questions en langage
            naturel, génère des quiz et des flashcards personnalisés. L&apos;IA
            analyse ton contenu et t&apos;accompagne pas à pas dans ta
            compréhension.
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-(--neu-bg) p-8 text-center shadow-(--neu-raised)">
        <h3 className="mb-3 text-xl font-bold text-(--neu-text)">
          Projet UIT - Université de Ngaoundéré
        </h3>
        <p className="mb-6 text-sm text-(--neu-text-muted) md:text-base">
          Ce projet a été réalisé dans le cadre des activités de
          l&apos;Unité d&apos;Innovation Technologique, qui vise à promouvoir
          l&apos;innovation et l&apos;utilisation des technologies au service de
          l&apos;éducation.
        </p>
      </section>
    </div>
  );
}
