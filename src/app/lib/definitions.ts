export type TypeDocument = 'PDF' | 'DOCX';

export type AuteurMessage = 'utilisateur' | 'ia';

export type TypeQuestionnaire = 'qcm' | 'flashcard' | 'mixte';

export type TypeQuestion = 'qcm' | 'flashcard';

export type Utilisateur = {
  id_utilisateur: number;
  nom: string;
  email: string;
  mot_de_passe: string;
  date_inscription: Date;
};

export type Cours = {
  id_cours: number;
  titre: string;
  description: string | null;
  date_creation: Date;
  id_utilisateur: number;
};

export type Document = {
  id_document: number;
  nom_fichier: string;
  chemin_fichier: string;
  type_document: TypeDocument;
  date_upload: Date;
  contenu_texte: string | null;
  id_cours: number;
};

export type Conversation = {
  id_conversation: number;
  date_debut: Date;
  date_fin: Date | null;
  id_utilisateur: number;
  id_cours: number;
};

export type Message = {
  id_message: number;
  contenu: string;
  date_heure: Date;
  auteur: AuteurMessage;
  id_conversation: number;
};

export type Questionnaire = {
  id_questionnaire: number;
  titre: string;
  description: string | null;
  date_creation: Date;
  type_questionnaire: TypeQuestionnaire;
  id_cours: number;
  genere_par_ia: boolean;
};

export type Question = {
  id_question: number;
  texte: string;
  explication: string | null;
  type_question: TypeQuestion;
  id_questionnaire: number;
  genere_par_ia: boolean;
};

export type Proposition = {
  id_proposition: number;
  texte: string;
  est_correcte: boolean;
  id_question: number;
};

export type SessionEntrainement = {
  id_session: number;
  date_debut: Date;
  date_fin: Date | null;
  id_utilisateur: number;
  id_questionnaire: number;
};

export type ReponseSession = {
  id_reponse: number;
  reponse_texte: string | null;
  est_correcte: boolean | null;
  id_session: number;
  id_question: number;
  id_proposition: number | null;
};

export type CreateUtilisateurInput = Omit<Utilisateur, 'id_utilisateur' | 'date_inscription'> & {
  date_inscription?: Date;
};

export type UpdateUtilisateurInput = Partial<Omit<Utilisateur, 'id_utilisateur' | 'date_inscription'>>;

export type CreateCoursInput = Omit<Cours, 'id_cours' | 'date_creation'> & { date_creation?: Date };
export type UpdateCoursInput = Partial<Omit<Cours, 'id_cours' | 'id_utilisateur' | 'date_creation'>>;

export type CreateDocumentInput = Omit<Document, 'id_document' | 'date_upload'> & { date_upload?: Date };
export type UpdateDocumentInput = Partial<Omit<Document, 'id_document' | 'id_cours' | 'date_upload'>>;

export type CreateConversationInput = Omit<Conversation, 'id_conversation'>;
export type UpdateConversationInput = Partial<Omit<Conversation, 'id_conversation' | 'id_utilisateur' | 'id_cours' | 'date_debut'>>;

export type CreateMessageInput = Omit<Message, 'id_message' | 'date_heure'> & { date_heure?: Date };
export type UpdateMessageInput = Partial<Omit<Message, 'id_message' | 'id_conversation' | 'date_heure'>>;

export type CreateQuestionnaireInput = Omit<Questionnaire, 'id_questionnaire' | 'date_creation' | 'genere_par_ia'> & {
  date_creation?: Date;
  genere_par_ia?: boolean;
};
export type UpdateQuestionnaireInput = Partial<Omit<Questionnaire, 'id_questionnaire' | 'id_cours' | 'date_creation'>>;

export type CreateQuestionInput = Omit<Question, 'id_question' | 'genere_par_ia'> & { genere_par_ia?: boolean };
export type UpdateQuestionInput = Partial<Omit<Question, 'id_question' | 'id_questionnaire'>>;

export type CreatePropositionInput = Omit<Proposition, 'id_proposition'>;
export type UpdatePropositionInput = Partial<Omit<Proposition, 'id_proposition' | 'id_question'>>;

export type CreateSessionEntrainementInput = Omit<SessionEntrainement, 'id_session'>;
export type UpdateSessionEntrainementInput = Partial<Omit<SessionEntrainement, 'id_session' | 'id_utilisateur' | 'id_questionnaire' | 'date_debut'>>;

export type CreateReponseSessionInput = Omit<ReponseSession, 'id_reponse'>;
export type UpdateReponseSessionInput = Partial<Omit<ReponseSession, 'id_reponse' | 'id_session' | 'id_question'>>;
