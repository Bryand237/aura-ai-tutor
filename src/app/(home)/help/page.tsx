"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    question: "Comment importer mes cours ?",
    answer:
      "Va sur la page Cours (Dashboard), clique sur la zone de dépôt ou glisse-dépose ton fichier PDF ou DOCX. L'IA analysera automatiquement le contenu. Tu peux ensuite poser des questions via le chat.",
  },
  {
    question: "Quels formats de fichiers sont supportés ?",
    answer:
      "Nous supportons les fichiers PDF (.pdf) et les documents Word (.doc, .docx). Assure-toi que le texte est sélectionnable (pas une image scannée) pour une meilleure analyse.",
  },
  {
    question: "Comment générer des quiz et flashcards ?",
    answer:
      "Sur la page Entraînement, sélectionne un sujet ou une unité d'étude que tu as déjà importée. L'IA génèrera automatiquement des quiz à choix multiples et des flashcards basés sur le contenu de tes cours.",
  },
  {
    question: "Comment est calculée ma progression ?",
    answer:
      "Ta progression est calculée en fonction de tes interactions : questions posées, quiz réalisés, flashcards consultées. La page Progression détaillée affiche ton taux d'apprentissage et ton niveau de maîtrise par sujet.",
  },
  {
    question: "J'ai un problème technique, qui contacter ?",
    answer:
      "Contacte l'équipe UIT à l'Université de Ngaoundéré. Tu peux te rendre au bureau de l'UIT ou envoyer un email pour toute assistance technique.",
  },
];

export default function Page() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-10">
      <section className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-(--neu-text)">
          Centre d&apos;aide
        </h1>
        <p className="text-base text-(--neu-text-muted)">
          Trouve des réponses à tes questions
        </p>
      </section>

      <section className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-lg font-bold text-(--neu-text)">
          Questions fréquentes
        </h2>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={item.question}
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`w-full rounded-2xl bg-(--neu-bg) p-5 text-left shadow-(--neu-raised) transition hover:shadow-(--neu-hover) ${
                  isOpen ? "ring-1 ring-(--emeraude)" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-(--neu-text) md:text-base">
                    {item.question}
                  </span>
                  <span className="text-lg text-(--neu-text-muted)">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
                {isOpen && (
                  <p className="mt-3 text-sm text-(--neu-text-muted) md:text-base">
                    {item.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-3xl rounded-3xl bg-(--neu-bg) p-8 text-center shadow-(--neu-raised)">
        <h2 className="mb-3 text-xl font-bold text-(--neu-text)">
          Besoin d&apos;aide supplémentaire ?
        </h2>
        <p className="mb-6 text-sm text-(--neu-text-muted) md:text-base">
          Notre équipe est là pour t&apos;aider.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:support@aura-ai.uit-ngaoundere.cm"
            className="inline-flex items-center rounded-full bg-(--neu-bg) px-5 py-2 text-sm font-semibold text-(--neu-text) shadow-(--neu-raised-sm) hover:text-(--emeraude)"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </div>
  );
}
