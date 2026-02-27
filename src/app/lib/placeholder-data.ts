import type {
  AuteurMessage,
  Cours,
  Conversation,
  Document,
  Message,
  Proposition,
  Question,
  Questionnaire,
  ReponseSession,
  SessionEntrainement,
  TypeDocument,
  TypeQuestion,
  TypeQuestionnaire,
  Utilisateur,
} from "./definitions";

export const utilisateurs: Utilisateur[] = [
  {
    id_utilisateur: 1,
    nom: "Amine Diallo",
    email: "amine.diallo@example.com",
    mot_de_passe: "$2b$10$placeholder_hash_amine",
    date_inscription: new Date("2025-09-10T08:30:00Z"),
  },
  {
    id_utilisateur: 2,
    nom: "Lina Martin",
    email: "lina.martin@example.com",
    mot_de_passe: "$2b$10$placeholder_hash_lina",
    date_inscription: new Date("2025-10-03T14:10:00Z"),
  },
  {
    id_utilisateur: 3,
    nom: "Youssef Benali",
    email: "youssef.benali@example.com",
    mot_de_passe: "$2b$10$placeholder_hash_youssef",
    date_inscription: new Date("2025-11-21T19:45:00Z"),
  },
];

export const cours: Cours[] = [
  {
    id_cours: 1,
    titre: "Mathématiques - Analyse",
    description: "Limites, dérivées, intégrales et applications.",
    date_creation: new Date("2025-12-01T10:00:00Z"),
    id_utilisateur: 1,
  },
  {
    id_cours: 2,
    titre: "Physique - Mécanique",
    description: "Cinématique, dynamique, énergie.",
    date_creation: new Date("2025-12-03T16:20:00Z"),
    id_utilisateur: 1,
  },
  {
    id_cours: 3,
    titre: "Histoire - XIXe siècle",
    description: "Révolutions industrielles et mouvements politiques.",
    date_creation: new Date("2025-12-05T09:15:00Z"),
    id_utilisateur: 2,
  },
];

export const documents: Document[] = [
  {
    id_document: 1,
    nom_fichier: "chapitre1_limites.pdf",
    chemin_fichier: "/uploads/chapitre1_limites.pdf",
    type_document: "PDF" as TypeDocument,
    date_upload: new Date("2025-12-01T11:00:00Z"),
    contenu_texte:
      "Définition des limites, propriétés, théorèmes de comparaison, continuité.",
    id_cours: 1,
  },
  {
    id_document: 2,
    nom_fichier: "fiche_integrales.docx",
    chemin_fichier: "/uploads/fiche_integrales.docx",
    type_document: "DOCX" as TypeDocument,
    date_upload: new Date("2025-12-02T08:05:00Z"),
    contenu_texte:
      "Primitives usuelles, intégration par parties, changement de variable.",
    id_cours: 1,
  },
  {
    id_document: 3,
    nom_fichier: "mecanique_energie.pdf",
    chemin_fichier: "/uploads/mecanique_energie.pdf",
    type_document: "PDF" as TypeDocument,
    date_upload: new Date("2025-12-03T18:30:00Z"),
    contenu_texte:
      "Travail, énergie cinétique, énergie potentielle, conservation.",
    id_cours: 2,
  },
];

export const conversations: Conversation[] = [
  {
    id_conversation: 1,
    date_debut: new Date("2025-12-02T19:00:00Z"),
    date_fin: null,
    id_utilisateur: 1,
    id_cours: 1,
  },
  {
    id_conversation: 2,
    date_debut: new Date("2025-12-06T12:00:00Z"),
    date_fin: new Date("2025-12-06T12:20:00Z"),
    id_utilisateur: 2,
    id_cours: 3,
  },
];

export const messages: Message[] = [
  {
    id_message: 1,
    contenu: "Peux-tu m'expliquer la définition formelle d'une limite ?",
    date_heure: new Date("2025-12-02T19:01:00Z"),
    auteur: "utilisateur" as AuteurMessage,
    id_conversation: 1,
  },
  {
    id_message: 2,
    contenu:
      "Oui. On dit que la limite de f(x) quand x tend vers a vaut L si, pour tout ε>0, il existe δ>0 tel que |x-a|<δ implique |f(x)-L|<ε.",
    date_heure: new Date("2025-12-02T19:01:30Z"),
    auteur: "ia" as AuteurMessage,
    id_conversation: 1,
  },
  {
    id_message: 3,
    contenu: "Donne-moi un exemple simple avec une fonction affine.",
    date_heure: new Date("2025-12-02T19:02:10Z"),
    auteur: "utilisateur" as AuteurMessage,
    id_conversation: 1,
  },
  {
    id_message: 4,
    contenu:
      "Par exemple f(x)=2x+1. Quand x→3, f(x)→7. Pour tout ε>0, choisir δ=ε/2 suffit.",
    date_heure: new Date("2025-12-02T19:02:40Z"),
    auteur: "ia" as AuteurMessage,
    id_conversation: 1,
  },
];

export const questionnaires: Questionnaire[] = [
  {
    id_questionnaire: 1,
    titre: "QCM - Limites (bases)",
    description: "Questions courtes sur la définition et les propriétés.",
    date_creation: new Date("2025-12-03T09:00:00Z"),
    type_questionnaire: "qcm" as TypeQuestionnaire,
    id_cours: 1,
    genere_par_ia: true,
  },
  {
    id_questionnaire: 2,
    titre: "Flashcards - Énergie mécanique",
    description: "Recto/verso pour les définitions clés.",
    date_creation: new Date("2025-12-04T08:00:00Z"),
    type_questionnaire: "flashcard" as TypeQuestionnaire,
    id_cours: 2,
    genere_par_ia: false,
  },
];

export const questions: Question[] = [
  {
    id_question: 1,
    texte: "Que signifie : lim_{x→a} f(x) = L ?",
    explication: "Condition ε-δ : |x-a| petit => |f(x)-L| petit.",
    type_question: "qcm" as TypeQuestion,
    id_questionnaire: 1,
    genere_par_ia: true,
  },
  {
    id_question: 2,
    texte: "Énoncer la propriété de la limite de la somme.",
    explication: "Si f→L et g→M, alors f+g→L+M.",
    type_question: "qcm" as TypeQuestion,
    id_questionnaire: 1,
    genere_par_ia: true,
  },
  {
    id_question: 3,
    texte: "Définition de l'énergie cinétique",
    explication: "Ec = 1/2 m v^2 (en joules).",
    type_question: "flashcard" as TypeQuestion,
    id_questionnaire: 2,
    genere_par_ia: false,
  },
];

export const propositions: Proposition[] = [
  {
    id_proposition: 1,
    texte: "Une définition ε-δ.",
    est_correcte: true,
    id_question: 1,
  },
  {
    id_proposition: 2,
    texte: "Une identité algébrique.",
    est_correcte: false,
    id_question: 1,
  },
  {
    id_proposition: 3,
    texte: "Une dérivée.",
    est_correcte: false,
    id_question: 1,
  },

  {
    id_proposition: 4,
    texte: "lim(f+g)=lim(f)+lim(g).",
    est_correcte: true,
    id_question: 2,
  },
  {
    id_proposition: 5,
    texte: "lim(f+g)=lim(f)×lim(g).",
    est_correcte: false,
    id_question: 2,
  },
  {
    id_proposition: 6,
    texte: "lim(f+g)=lim(f)-lim(g).",
    est_correcte: false,
    id_question: 2,
  },
];

export const sessions: SessionEntrainement[] = [
  {
    id_session: 1,
    date_debut: new Date("2025-12-03T20:00:00Z"),
    date_fin: new Date("2025-12-03T20:10:00Z"),
    id_utilisateur: 1,
    id_questionnaire: 1,
  },
  {
    id_session: 2,
    date_debut: new Date("2025-12-05T21:00:00Z"),
    date_fin: null,
    id_utilisateur: 1,
    id_questionnaire: 2,
  },
];

export const reponses: ReponseSession[] = [
  {
    id_reponse: 1,
    reponse_texte: null,
    est_correcte: true,
    id_session: 1,
    id_question: 1,
    id_proposition: 1,
  },
  {
    id_reponse: 2,
    reponse_texte: null,
    est_correcte: false,
    id_session: 1,
    id_question: 2,
    id_proposition: 5,
  },
  {
    id_reponse: 3,
    reponse_texte: "Ec = 1/2 m v^2",
    est_correcte: true,
    id_session: 2,
    id_question: 3,
    id_proposition: null,
  },
];
