import { getSql } from "./db";
import type { ParameterOrJSON } from "postgres";
import type {
  Cours,
  Conversation,
  CreateCoursInput,
  CreateConversationInput,
  CreateDocumentInput,
  CreateMessageInput,
  CreatePropositionInput,
  CreateQuestionInput,
  CreateQuestionnaireInput,
  CreateReponseSessionInput,
  CreateSessionEntrainementInput,
  CreateUtilisateurInput,
  Document,
  Message,
  Proposition,
  Question,
  Questionnaire,
  ReponseSession,
  SessionEntrainement,
  UpdateCoursInput,
  UpdateConversationInput,
  UpdateDocumentInput,
  UpdateMessageInput,
  UpdatePropositionInput,
  UpdateQuestionInput,
  UpdateQuestionnaireInput,
  UpdateReponseSessionInput,
  UpdateSessionEntrainementInput,
  UpdateUtilisateurInput,
  Utilisateur,
} from "./definitions";

function sql() {
  return getSql();
}

function mapRowDates<T extends Record<string, unknown>>(
  row: T,
  keys: (keyof T)[],
) {
  const out: Record<string, unknown> = { ...row };
  for (const k of keys) {
    const v = out[k as string];
    if (typeof v === "string" || v instanceof Date) {
      out[k as string] = new Date(v);
    }
  }
  return out as T;
}

async function queryOne<T>(text: string, values: unknown[] = []) {
  const rows = (await sql().unsafe(
    text,
    values as unknown as ParameterOrJSON<never>[],
  )) as unknown as T[];
  return (rows[0] ?? null) as T | null;
}

async function queryMany<T>(text: string, values: unknown[] = []) {
  const rows = (await sql().unsafe(
    text,
    values as unknown as ParameterOrJSON<never>[],
  )) as unknown as T[];
  return rows;
}

export const utilisateurData = {
  async list(): Promise<Utilisateur[]> {
    const rows = await queryMany<Utilisateur>(
      "SELECT * FROM utilisateur ORDER BY id_utilisateur ASC",
      [],
    );
    return rows.map((r) => mapRowDates(r, ["date_inscription"]));
  },

  async getByEmail(email: string): Promise<Utilisateur | null> {
    const row = await queryOne<Utilisateur>(
      "SELECT * FROM utilisateur WHERE email = $1",
      [email],
    );
    return row ? mapRowDates(row, ["date_inscription"]) : null;
  },

  async getById(id_utilisateur: number): Promise<Utilisateur | null> {
    const row = await queryOne<Utilisateur>(
      "SELECT * FROM utilisateur WHERE id_utilisateur = $1",
      [id_utilisateur],
    );
    return row ? mapRowDates(row, ["date_inscription"]) : null;
  },

  async create(input: CreateUtilisateurInput): Promise<Utilisateur> {
    const row = await queryOne<Utilisateur>(
      `INSERT INTO utilisateur (nom, email, mot_de_passe, date_inscription)
       VALUES ($1, $2, $3, COALESCE($4, NOW()))
       RETURNING *`,
      [
        input.nom,
        input.email,
        input.mot_de_passe,
        input.date_inscription ?? null,
      ],
    );
    if (!row) throw new Error("Failed to create utilisateur");
    return mapRowDates(row, ["date_inscription"]);
  },

  async update(
    id_utilisateur: number,
    patch: UpdateUtilisateurInput,
  ): Promise<Utilisateur | null> {
    const row = await queryOne<Utilisateur>(
      `UPDATE utilisateur
       SET nom = COALESCE($2, nom),
           email = COALESCE($3, email),
           mot_de_passe = COALESCE($4, mot_de_passe)
       WHERE id_utilisateur = $1
       RETURNING *`,
      [
        id_utilisateur,
        patch.nom ?? null,
        patch.email ?? null,
        patch.mot_de_passe ?? null,
      ],
    );
    return row ? mapRowDates(row, ["date_inscription"]) : null;
  },

  async remove(id_utilisateur: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM utilisateur WHERE id_utilisateur = $1 RETURNING 1 as ok",
      [id_utilisateur],
    );
    return !!row;
  },
};

export const coursData = {
  async listByUtilisateur(id_utilisateur: number): Promise<Cours[]> {
    const rows = await queryMany<Cours>(
      "SELECT * FROM cours WHERE id_utilisateur = $1 ORDER BY id_cours ASC",
      [id_utilisateur],
    );
    return rows.map((r) => mapRowDates(r, ["date_creation"]));
  },

  async getById(id_cours: number): Promise<Cours | null> {
    const row = await queryOne<Cours>(
      "SELECT * FROM cours WHERE id_cours = $1",
      [id_cours],
    );
    return row ? mapRowDates(row, ["date_creation"]) : null;
  },

  async create(input: CreateCoursInput): Promise<Cours> {
    const row = await queryOne<Cours>(
      `INSERT INTO cours (titre, description, date_creation, id_utilisateur)
       VALUES ($1, $2, COALESCE($3, NOW()), $4)
       RETURNING *`,
      [
        input.titre,
        input.description ?? null,
        input.date_creation ?? null,
        input.id_utilisateur,
      ],
    );
    if (!row) throw new Error("Failed to create cours");
    return mapRowDates(row, ["date_creation"]);
  },

  async update(
    id_cours: number,
    patch: UpdateCoursInput,
  ): Promise<Cours | null> {
    const row = await queryOne<Cours>(
      `UPDATE cours
       SET titre = COALESCE($2, titre),
           description = COALESCE($3, description)
       WHERE id_cours = $1
       RETURNING *`,
      [id_cours, patch.titre ?? null, patch.description ?? null],
    );
    return row ? mapRowDates(row, ["date_creation"]) : null;
  },

  async remove(id_cours: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM cours WHERE id_cours = $1 RETURNING 1 as ok",
      [id_cours],
    );
    return !!row;
  },
};

export const documentData = {
  async listByCours(id_cours: number): Promise<Document[]> {
    const rows = await queryMany<Document>(
      "SELECT * FROM document WHERE id_cours = $1 ORDER BY id_document ASC",
      [id_cours],
    );
    return rows.map((r) => mapRowDates(r, ["date_upload"]));
  },

  async getById(id_document: number): Promise<Document | null> {
    const row = await queryOne<Document>(
      "SELECT * FROM document WHERE id_document = $1",
      [id_document],
    );
    return row ? mapRowDates(row, ["date_upload"]) : null;
  },

  async create(input: CreateDocumentInput): Promise<Document> {
    const row = await queryOne<Document>(
      `INSERT INTO document (nom_fichier, chemin_fichier, type_document, date_upload, contenu_texte, id_cours)
       VALUES ($1, $2, $3, COALESCE($4, NOW()), $5, $6)
       RETURNING *`,
      [
        input.nom_fichier,
        input.chemin_fichier,
        input.type_document,
        input.date_upload ?? null,
        input.contenu_texte ?? null,
        input.id_cours,
      ],
    );
    if (!row) throw new Error("Failed to create document");
    return mapRowDates(row, ["date_upload"]);
  },

  async update(
    id_document: number,
    patch: UpdateDocumentInput,
  ): Promise<Document | null> {
    const row = await queryOne<Document>(
      `UPDATE document
       SET nom_fichier = COALESCE($2, nom_fichier),
           chemin_fichier = COALESCE($3, chemin_fichier),
           type_document = COALESCE($4, type_document),
           contenu_texte = COALESCE($5, contenu_texte)
       WHERE id_document = $1
       RETURNING *`,
      [
        id_document,
        patch.nom_fichier ?? null,
        patch.chemin_fichier ?? null,
        patch.type_document ?? null,
        patch.contenu_texte ?? null,
      ],
    );
    return row ? mapRowDates(row, ["date_upload"]) : null;
  },

  async remove(id_document: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM document WHERE id_document = $1 RETURNING 1 as ok",
      [id_document],
    );
    return !!row;
  },
};

export const conversationData = {
  async listByCours(id_cours: number): Promise<Conversation[]> {
    const rows = await queryMany<Conversation>(
      "SELECT * FROM conversation WHERE id_cours = $1 ORDER BY id_conversation ASC",
      [id_cours],
    );
    return rows.map((r) => mapRowDates(r, ["date_debut", "date_fin"]));
  },

  async getById(id_conversation: number): Promise<Conversation | null> {
    const row = await queryOne<Conversation>(
      "SELECT * FROM conversation WHERE id_conversation = $1",
      [id_conversation],
    );
    return row ? mapRowDates(row, ["date_debut", "date_fin"]) : null;
  },

  async create(input: CreateConversationInput): Promise<Conversation> {
    const row = await queryOne<Conversation>(
      `INSERT INTO conversation (date_debut, date_fin, id_utilisateur, id_cours)
       VALUES (COALESCE($1, NOW()), $2, $3, $4)
       RETURNING *`,
      [
        input.date_debut ?? null,
        input.date_fin ?? null,
        input.id_utilisateur,
        input.id_cours,
      ],
    );
    if (!row) throw new Error("Failed to create conversation");
    return mapRowDates(row, ["date_debut", "date_fin"]);
  },

  async update(
    id_conversation: number,
    patch: UpdateConversationInput,
  ): Promise<Conversation | null> {
    const row = await queryOne<Conversation>(
      `UPDATE conversation
       SET date_fin = COALESCE($2, date_fin)
       WHERE id_conversation = $1
       RETURNING *`,
      [id_conversation, patch.date_fin ?? null],
    );
    return row ? mapRowDates(row, ["date_debut", "date_fin"]) : null;
  },

  async remove(id_conversation: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM conversation WHERE id_conversation = $1 RETURNING 1 as ok",
      [id_conversation],
    );
    return !!row;
  },
};

export const messageData = {
  async listByConversation(id_conversation: number): Promise<Message[]> {
    const rows = await queryMany<Message>(
      "SELECT * FROM message WHERE id_conversation = $1 ORDER BY id_message ASC",
      [id_conversation],
    );
    return rows.map((r) => mapRowDates(r, ["date_heure"]));
  },

  async getById(id_message: number): Promise<Message | null> {
    const row = await queryOne<Message>(
      "SELECT * FROM message WHERE id_message = $1",
      [id_message],
    );
    return row ? mapRowDates(row, ["date_heure"]) : null;
  },

  async create(input: CreateMessageInput): Promise<Message> {
    const row = await queryOne<Message>(
      `INSERT INTO message (contenu, date_heure, auteur, id_conversation)
       VALUES ($1, COALESCE($2, NOW()), $3, $4)
       RETURNING *`,
      [
        input.contenu,
        input.date_heure ?? null,
        input.auteur,
        input.id_conversation,
      ],
    );
    if (!row) throw new Error("Failed to create message");
    return mapRowDates(row, ["date_heure"]);
  },

  async update(
    id_message: number,
    patch: UpdateMessageInput,
  ): Promise<Message | null> {
    const row = await queryOne<Message>(
      `UPDATE message
       SET contenu = COALESCE($2, contenu),
           auteur = COALESCE($3, auteur)
       WHERE id_message = $1
       RETURNING *`,
      [id_message, patch.contenu ?? null, patch.auteur ?? null],
    );
    return row ? mapRowDates(row, ["date_heure"]) : null;
  },

  async remove(id_message: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM message WHERE id_message = $1 RETURNING 1 as ok",
      [id_message],
    );
    return !!row;
  },
};

export const questionnaireData = {
  async listByCours(id_cours: number): Promise<Questionnaire[]> {
    const rows = await queryMany<Questionnaire>(
      "SELECT * FROM questionnaire WHERE id_cours = $1 ORDER BY id_questionnaire ASC",
      [id_cours],
    );
    return rows.map((r) => mapRowDates(r, ["date_creation"]));
  },

  async getById(id_questionnaire: number): Promise<Questionnaire | null> {
    const row = await queryOne<Questionnaire>(
      "SELECT * FROM questionnaire WHERE id_questionnaire = $1",
      [id_questionnaire],
    );
    return row ? mapRowDates(row, ["date_creation"]) : null;
  },

  async create(input: CreateQuestionnaireInput): Promise<Questionnaire> {
    const row = await queryOne<Questionnaire>(
      `INSERT INTO questionnaire (titre, description, date_creation, type_questionnaire, id_cours, genere_par_ia)
       VALUES ($1, $2, COALESCE($3, NOW()), $4, $5, COALESCE($6, FALSE))
       RETURNING *`,
      [
        input.titre,
        input.description ?? null,
        input.date_creation ?? null,
        input.type_questionnaire,
        input.id_cours,
        input.genere_par_ia ?? null,
      ],
    );
    if (!row) throw new Error("Failed to create questionnaire");
    return mapRowDates(row, ["date_creation"]);
  },

  async update(
    id_questionnaire: number,
    patch: UpdateQuestionnaireInput,
  ): Promise<Questionnaire | null> {
    const row = await queryOne<Questionnaire>(
      `UPDATE questionnaire
       SET titre = COALESCE($2, titre),
           description = COALESCE($3, description),
           type_questionnaire = COALESCE($4, type_questionnaire),
           genere_par_ia = COALESCE($5, genere_par_ia)
       WHERE id_questionnaire = $1
       RETURNING *`,
      [
        id_questionnaire,
        patch.titre ?? null,
        patch.description ?? null,
        patch.type_questionnaire ?? null,
        patch.genere_par_ia ?? null,
      ],
    );
    return row ? mapRowDates(row, ["date_creation"]) : null;
  },

  async remove(id_questionnaire: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM questionnaire WHERE id_questionnaire = $1 RETURNING 1 as ok",
      [id_questionnaire],
    );
    return !!row;
  },
};

export const questionData = {
  async listByQuestionnaire(id_questionnaire: number): Promise<Question[]> {
    const rows = await queryMany<Question>(
      "SELECT * FROM question WHERE id_questionnaire = $1 ORDER BY id_question ASC",
      [id_questionnaire],
    );
    return rows;
  },

  async getById(id_question: number): Promise<Question | null> {
    return queryOne<Question>("SELECT * FROM question WHERE id_question = $1", [
      id_question,
    ]);
  },

  async create(input: CreateQuestionInput): Promise<Question> {
    const row = await queryOne<Question>(
      `INSERT INTO question (texte, explication, type_question, id_questionnaire, genere_par_ia)
       VALUES ($1, $2, $3, $4, COALESCE($5, FALSE))
       RETURNING *`,
      [
        input.texte,
        input.explication ?? null,
        input.type_question,
        input.id_questionnaire,
        input.genere_par_ia ?? null,
      ],
    );
    if (!row) throw new Error("Failed to create question");
    return row;
  },

  async update(
    id_question: number,
    patch: UpdateQuestionInput,
  ): Promise<Question | null> {
    return queryOne<Question>(
      `UPDATE question
       SET texte = COALESCE($2, texte),
           explication = COALESCE($3, explication),
           type_question = COALESCE($4, type_question),
           genere_par_ia = COALESCE($5, genere_par_ia)
       WHERE id_question = $1
       RETURNING *`,
      [
        id_question,
        patch.texte ?? null,
        patch.explication ?? null,
        patch.type_question ?? null,
        patch.genere_par_ia ?? null,
      ],
    );
  },

  async remove(id_question: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM question WHERE id_question = $1 RETURNING 1 as ok",
      [id_question],
    );
    return !!row;
  },
};

export const propositionData = {
  async listByQuestion(id_question: number): Promise<Proposition[]> {
    return queryMany<Proposition>(
      "SELECT * FROM proposition WHERE id_question = $1 ORDER BY id_proposition ASC",
      [id_question],
    );
  },

  async getById(id_proposition: number): Promise<Proposition | null> {
    return queryOne<Proposition>(
      "SELECT * FROM proposition WHERE id_proposition = $1",
      [id_proposition],
    );
  },

  async create(input: CreatePropositionInput): Promise<Proposition> {
    const row = await queryOne<Proposition>(
      `INSERT INTO proposition (texte, est_correcte, id_question)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [input.texte, input.est_correcte, input.id_question],
    );
    if (!row) throw new Error("Failed to create proposition");
    return row;
  },

  async update(
    id_proposition: number,
    patch: UpdatePropositionInput,
  ): Promise<Proposition | null> {
    return queryOne<Proposition>(
      `UPDATE proposition
       SET texte = COALESCE($2, texte),
           est_correcte = COALESCE($3, est_correcte)
       WHERE id_proposition = $1
       RETURNING *`,
      [id_proposition, patch.texte ?? null, patch.est_correcte ?? null],
    );
  },

  async remove(id_proposition: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM proposition WHERE id_proposition = $1 RETURNING 1 as ok",
      [id_proposition],
    );
    return !!row;
  },
};

export const sessionData = {
  async listByUtilisateur(
    id_utilisateur: number,
  ): Promise<SessionEntrainement[]> {
    const rows = await queryMany<SessionEntrainement>(
      "SELECT * FROM session_entrainement WHERE id_utilisateur = $1 ORDER BY id_session ASC",
      [id_utilisateur],
    );
    return rows.map((r) => mapRowDates(r, ["date_debut", "date_fin"]));
  },

  async getById(id_session: number): Promise<SessionEntrainement | null> {
    const row = await queryOne<SessionEntrainement>(
      "SELECT * FROM session_entrainement WHERE id_session = $1",
      [id_session],
    );
    return row ? mapRowDates(row, ["date_debut", "date_fin"]) : null;
  },

  async create(
    input: CreateSessionEntrainementInput,
  ): Promise<SessionEntrainement> {
    const row = await queryOne<SessionEntrainement>(
      `INSERT INTO session_entrainement (date_debut, date_fin, id_utilisateur, id_questionnaire)
       VALUES (COALESCE($1, NOW()), $2, $3, $4)
       RETURNING *`,
      [
        input.date_debut ?? null,
        input.date_fin ?? null,
        input.id_utilisateur,
        input.id_questionnaire,
      ],
    );
    if (!row) throw new Error("Failed to create session_entrainement");
    return mapRowDates(row, ["date_debut", "date_fin"]);
  },

  async update(
    id_session: number,
    patch: UpdateSessionEntrainementInput,
  ): Promise<SessionEntrainement | null> {
    const row = await queryOne<SessionEntrainement>(
      `UPDATE session_entrainement
       SET date_fin = COALESCE($2, date_fin)
       WHERE id_session = $1
       RETURNING *`,
      [id_session, patch.date_fin ?? null],
    );
    return row ? mapRowDates(row, ["date_debut", "date_fin"]) : null;
  },

  async remove(id_session: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM session_entrainement WHERE id_session = $1 RETURNING 1 as ok",
      [id_session],
    );
    return !!row;
  },
};

export const reponseData = {
  async listBySession(id_session: number): Promise<ReponseSession[]> {
    return queryMany<ReponseSession>(
      "SELECT * FROM reponse_session WHERE id_session = $1 ORDER BY id_reponse ASC",
      [id_session],
    );
  },

  async getById(id_reponse: number): Promise<ReponseSession | null> {
    return queryOne<ReponseSession>(
      "SELECT * FROM reponse_session WHERE id_reponse = $1",
      [id_reponse],
    );
  },

  async create(input: CreateReponseSessionInput): Promise<ReponseSession> {
    const row = await queryOne<ReponseSession>(
      `INSERT INTO reponse_session (reponse_texte, est_correcte, id_session, id_question, id_proposition)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        input.reponse_texte ?? null,
        input.est_correcte ?? null,
        input.id_session,
        input.id_question,
        input.id_proposition ?? null,
      ],
    );
    if (!row) throw new Error("Failed to create reponse_session");
    return row;
  },

  async update(
    id_reponse: number,
    patch: UpdateReponseSessionInput,
  ): Promise<ReponseSession | null> {
    return queryOne<ReponseSession>(
      `UPDATE reponse_session
       SET reponse_texte = COALESCE($2, reponse_texte),
           est_correcte = COALESCE($3, est_correcte),
           id_proposition = COALESCE($4, id_proposition)
       WHERE id_reponse = $1
       RETURNING *`,
      [
        id_reponse,
        patch.reponse_texte ?? null,
        patch.est_correcte ?? null,
        patch.id_proposition ?? null,
      ],
    );
  },

  async remove(id_reponse: number): Promise<boolean> {
    const row = await queryOne<{ ok: number }>(
      "DELETE FROM reponse_session WHERE id_reponse = $1 RETURNING 1 as ok",
      [id_reponse],
    );
    return !!row;
  },
};
