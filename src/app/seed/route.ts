import postgres from "postgres";
import bcrypt from "bcrypt";
import { utilisateurs as placeholderUsers } from "../lib/placeholder-data";

async function ensureSchema(tx: unknown) {
  const q = tx as unknown as ReturnType<typeof postgres>;
  await q`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  await q`
    CREATE TABLE IF NOT EXISTS utilisateur (
      id_utilisateur BIGSERIAL PRIMARY KEY,
      nom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mot_de_passe TEXT NOT NULL,
      date_inscription TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await q`
    CREATE TABLE IF NOT EXISTS cours (
      id_cours BIGSERIAL PRIMARY KEY,
      titre TEXT NOT NULL,
      description TEXT,
      date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
      CONSTRAINT cours_unique_utilisateur_titre UNIQUE (id_utilisateur, titre)
    );
  `;

  await q`
    DO $$
    BEGIN
      CREATE TYPE type_document AS ENUM ('PDF', 'DOCX');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `;

  await q`
    CREATE TABLE IF NOT EXISTS document (
      id_document BIGSERIAL PRIMARY KEY,
      nom_fichier TEXT NOT NULL,
      chemin_fichier TEXT NOT NULL,
      type_document type_document NOT NULL,
      date_upload TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      contenu_texte TEXT,
      id_cours BIGINT NOT NULL REFERENCES cours(id_cours) ON DELETE CASCADE
    );
  `;

  await q`
    CREATE TABLE IF NOT EXISTS conversation (
      id_conversation BIGSERIAL PRIMARY KEY,
      date_debut TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      date_fin TIMESTAMPTZ,
      id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
      id_cours BIGINT NOT NULL REFERENCES cours(id_cours) ON DELETE CASCADE
    );
  `;

  await q`
    DO $$
    BEGIN
      CREATE TYPE auteur_message AS ENUM ('utilisateur', 'ia');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `;

  await q`
    CREATE TABLE IF NOT EXISTS message (
      id_message BIGSERIAL PRIMARY KEY,
      contenu TEXT NOT NULL,
      date_heure TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      auteur auteur_message NOT NULL,
      id_conversation BIGINT NOT NULL REFERENCES conversation(id_conversation) ON DELETE CASCADE
    );
  `;

  await q`
    DO $$
    BEGIN
      CREATE TYPE type_questionnaire AS ENUM ('qcm', 'flashcard', 'mixte');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `;

  await q`
    CREATE TABLE IF NOT EXISTS questionnaire (
      id_questionnaire BIGSERIAL PRIMARY KEY,
      titre TEXT NOT NULL,
      description TEXT,
      date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      type_questionnaire type_questionnaire NOT NULL,
      id_cours BIGINT NOT NULL REFERENCES cours(id_cours) ON DELETE CASCADE,
      genere_par_ia BOOLEAN NOT NULL DEFAULT FALSE,
      CONSTRAINT questionnaire_unique_cours_titre UNIQUE (id_cours, titre)
    );
  `;

  await q`
    DO $$
    BEGIN
      CREATE TYPE type_question AS ENUM ('qcm', 'flashcard');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `;

  await q`
    CREATE TABLE IF NOT EXISTS question (
      id_question BIGSERIAL PRIMARY KEY,
      texte TEXT NOT NULL,
      explication TEXT,
      type_question type_question NOT NULL,
      id_questionnaire BIGINT NOT NULL REFERENCES questionnaire(id_questionnaire) ON DELETE CASCADE,
      genere_par_ia BOOLEAN NOT NULL DEFAULT FALSE
    );
  `;

  await q`
    CREATE TABLE IF NOT EXISTS proposition (
      id_proposition BIGSERIAL PRIMARY KEY,
      texte TEXT NOT NULL,
      est_correcte BOOLEAN NOT NULL DEFAULT FALSE,
      id_question BIGINT NOT NULL REFERENCES question(id_question) ON DELETE CASCADE
    );
  `;

  await q`
    CREATE TABLE IF NOT EXISTS session_entrainement (
      id_session BIGSERIAL PRIMARY KEY,
      date_debut TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      date_fin TIMESTAMPTZ,
      id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
      id_questionnaire BIGINT NOT NULL REFERENCES questionnaire(id_questionnaire) ON DELETE CASCADE
    );
  `;

  await q`
    CREATE TABLE IF NOT EXISTS reponse_session (
      id_reponse BIGSERIAL PRIMARY KEY,
      reponse_texte TEXT,
      est_correcte BOOLEAN,
      id_session BIGINT NOT NULL REFERENCES session_entrainement(id_session) ON DELETE CASCADE,
      id_question BIGINT NOT NULL REFERENCES question(id_question) ON DELETE CASCADE,
      id_proposition BIGINT REFERENCES proposition(id_proposition) ON DELETE SET NULL,
      CONSTRAINT reponse_qcm_exclusive CHECK (
        (id_proposition IS NULL) OR (reponse_texte IS NULL)
      )
    );
  `;

  await q`CREATE INDEX IF NOT EXISTS idx_cours_id_utilisateur ON cours(id_utilisateur)`;
  await q`CREATE INDEX IF NOT EXISTS idx_document_id_cours ON document(id_cours)`;
  await q`CREATE INDEX IF NOT EXISTS idx_conversation_id_cours ON conversation(id_cours)`;
  await q`CREATE INDEX IF NOT EXISTS idx_conversation_id_utilisateur ON conversation(id_utilisateur)`;
  await q`CREATE INDEX IF NOT EXISTS idx_message_id_conversation ON message(id_conversation)`;
  await q`CREATE INDEX IF NOT EXISTS idx_questionnaire_id_cours ON questionnaire(id_cours)`;
  await q`CREATE INDEX IF NOT EXISTS idx_question_id_questionnaire ON question(id_questionnaire)`;
  await q`CREATE INDEX IF NOT EXISTS idx_proposition_id_question ON proposition(id_question)`;
  await q`CREATE INDEX IF NOT EXISTS idx_session_id_utilisateur ON session_entrainement(id_utilisateur)`;
  await q`CREATE INDEX IF NOT EXISTS idx_session_id_questionnaire ON session_entrainement(id_questionnaire)`;
  await q`CREATE INDEX IF NOT EXISTS idx_reponse_id_session ON reponse_session(id_session)`;
  await q`CREATE INDEX IF NOT EXISTS idx_reponse_id_question ON reponse_session(id_question)`;
}

async function seedMockData(tx: unknown) {
  const q = tx as unknown as ReturnType<typeof postgres>;
  const utilisateursSeed = placeholderUsers.map((u) => ({
    nom: u.nom,
    email: u.email,
    mot_de_passe: u.mot_de_passe,
  }));

  const utilisateurIds: number[] = [];
  for (const u of utilisateursSeed) {
    const hashedPassword = await bcrypt.hash(u.mot_de_passe, 10);
    const rows = await q<{ id_utilisateur: bigint }[]>`
      INSERT INTO utilisateur (nom, email, mot_de_passe)
      VALUES (${u.nom}, ${u.email}, ${hashedPassword})
      ON CONFLICT (email) DO UPDATE SET
        nom = EXCLUDED.nom,
        mot_de_passe = EXCLUDED.mot_de_passe
      RETURNING id_utilisateur;
    `;
    utilisateurIds.push(Number(rows[0]!.id_utilisateur));
  }

  const coursIds: number[] = [];
  for (const id_utilisateur of utilisateurIds) {
    const coursSeed = [
      {
        titre: "Mathématiques",
        description: "Fonctions, dérivées, intégrales.",
      },
      {
        titre: "Physique",
        description: "Mécanique, énergie, électricité.",
      },
    ];

    for (const c of coursSeed) {
      const rows = await q<{ id_cours: bigint }[]>`
        INSERT INTO cours (titre, description, id_utilisateur)
        VALUES (${c.titre}, ${c.description}, ${id_utilisateur})
        ON CONFLICT (id_utilisateur, titre) DO UPDATE SET
          description = EXCLUDED.description
        RETURNING id_cours;
      `;
      coursIds.push(Number(rows[0]!.id_cours));
    }
  }

  for (const id_cours of coursIds) {
    await q`
      INSERT INTO document (nom_fichier, chemin_fichier, type_document, contenu_texte, id_cours)
      VALUES
        (${`cours_${id_cours}_intro.pdf`}, ${`/mock/cours_${id_cours}_intro.pdf`}, 'PDF', 'Introduction au cours et notions clés.', ${id_cours}),
        (${`cours_${id_cours}_exercices.docx`}, ${`/mock/cours_${id_cours}_exercices.docx`}, 'DOCX', 'Exercices et corrections.', ${id_cours})
      ON CONFLICT DO NOTHING;
    `;
  }

  const conversationIds: number[] = [];
  for (let i = 0; i < Math.min(coursIds.length, utilisateurIds.length); i++) {
    const id_cours = coursIds[i]!;
    const id_utilisateur = utilisateurIds[i]!;

    const rows = await q<{ id_conversation: bigint }[]>`
      INSERT INTO conversation (id_utilisateur, id_cours)
      VALUES (${id_utilisateur}, ${id_cours})
      RETURNING id_conversation;
    `;
    conversationIds.push(Number(rows[0]!.id_conversation));
  }

  for (const id_conversation of conversationIds) {
    await q`
      INSERT INTO message (contenu, auteur, id_conversation)
      VALUES
        ('Peux-tu me résumer le cours ?', 'utilisateur', ${id_conversation}),
        ('Bien sûr. Voici un résumé des points principaux et des notions importantes.', 'ia', ${id_conversation}),
        ('Donne-moi un exemple simple.', 'utilisateur', ${id_conversation}),
        ('Voici un exemple pas à pas pour illustrer la notion.', 'ia', ${id_conversation})
      ON CONFLICT DO NOTHING;
    `;
  }

  const questionnaireIds: number[] = [];
  for (const id_cours of coursIds) {
    const rowsQcm = await q<{ id_questionnaire: bigint }[]>`
      INSERT INTO questionnaire (titre, description, type_questionnaire, id_cours, genere_par_ia)
      VALUES (${`QCM - Bases (${id_cours})`}, 'QCM pour réviser les bases.', 'qcm', ${id_cours}, FALSE)
      ON CONFLICT (id_cours, titre) DO UPDATE SET
        description = EXCLUDED.description,
        type_questionnaire = EXCLUDED.type_questionnaire
      RETURNING id_questionnaire;
    `;

    const rowsFlash = await q<{ id_questionnaire: bigint }[]>`
      INSERT INTO questionnaire (titre, description, type_questionnaire, id_cours, genere_par_ia)
      VALUES (${`Flashcards - Définitions (${id_cours})`}, 'Flashcards pour mémoriser.', 'flashcard', ${id_cours}, FALSE)
      ON CONFLICT (id_cours, titre) DO UPDATE SET
        description = EXCLUDED.description,
        type_questionnaire = EXCLUDED.type_questionnaire
      RETURNING id_questionnaire;
    `;

    questionnaireIds.push(Number(rowsQcm[0]!.id_questionnaire));
    questionnaireIds.push(Number(rowsFlash[0]!.id_questionnaire));
  }

  const questionIds: number[] = [];
  for (const id_questionnaire of questionnaireIds) {
    const qType = await q<{ type_questionnaire: string }[]>`
      SELECT type_questionnaire FROM questionnaire WHERE id_questionnaire = ${id_questionnaire};
    `;

    const type = qType[0]?.type_questionnaire;

    if (type === "qcm") {
      const rows = await q<{ id_question: bigint }[]>`
        INSERT INTO question (texte, explication, type_question, id_questionnaire, genere_par_ia)
        VALUES
          ('Quelle est la dérivée de x^2 ?', 'La dérivée de x^2 est 2x.', 'qcm', ${id_questionnaire}, FALSE),
          ('Quelle est l''unité de la force ?', 'L''unité SI de la force est le Newton (N).', 'qcm', ${id_questionnaire}, FALSE)
        RETURNING id_question;
      `;
      questionIds.push(
        ...rows.map((r: { id_question: bigint }) => Number(r.id_question)),
      );
    } else {
      const rows = await q<{ id_question: bigint }[]>`
        INSERT INTO question (texte, explication, type_question, id_questionnaire, genere_par_ia)
        VALUES
          ('Définition: énergie cinétique', 'E_c = 1/2 m v^2', 'flashcard', ${id_questionnaire}, FALSE),
          ('Définition: fonction affine', 'f(x) = ax + b', 'flashcard', ${id_questionnaire}, FALSE)
        RETURNING id_question;
      `;
      questionIds.push(
        ...rows.map((r: { id_question: bigint }) => Number(r.id_question)),
      );
    }
  }

  const qcmQuestionIds = await q<{ id_question: bigint }[]>`
    SELECT id_question FROM question WHERE type_question = 'qcm' ORDER BY id_question ASC;
  `;

  for (const r of qcmQuestionIds) {
    const id_question = Number(r.id_question);
    await q`
      INSERT INTO proposition (texte, est_correcte, id_question)
      VALUES
        ('2x', TRUE, ${id_question}),
        ('x', FALSE, ${id_question}),
        ('x^2', FALSE, ${id_question}),
        ('Aucune de ces réponses', FALSE, ${id_question})
      ON CONFLICT DO NOTHING;
    `;
  }

  const sessionIds: number[] = [];
  for (let i = 0; i < utilisateurIds.length; i++) {
    const id_utilisateur = utilisateurIds[i]!;
    const id_questionnaire = questionnaireIds[i % questionnaireIds.length]!;

    const rows = await q<{ id_session: bigint }[]>`
      INSERT INTO session_entrainement (id_utilisateur, id_questionnaire)
      VALUES (${id_utilisateur}, ${id_questionnaire})
      RETURNING id_session;
    `;
    sessionIds.push(Number(rows[0]!.id_session));
  }

  for (const id_session of sessionIds) {
    const session = await q<{ id_questionnaire: bigint }[]>`
      SELECT id_questionnaire FROM session_entrainement WHERE id_session = ${id_session};
    `;
    const id_questionnaire = Number(session[0]!.id_questionnaire);

    const questions = await q<{ id_question: bigint; type_question: string }[]>`
      SELECT id_question, type_question
      FROM question
      WHERE id_questionnaire = ${id_questionnaire}
      ORDER BY id_question ASC
      LIMIT 2;
    `;

    for (const questionRow of questions) {
      const id_question = Number(questionRow.id_question);
      if (questionRow.type_question === "qcm") {
        const prop = await q<{ id_proposition: bigint }[]>`
          SELECT id_proposition
          FROM proposition
          WHERE id_question = ${id_question} AND est_correcte = TRUE
          ORDER BY id_proposition ASC
          LIMIT 1;
        `;
        const id_proposition = prop[0] ? Number(prop[0].id_proposition) : null;

        await q`
          INSERT INTO reponse_session (reponse_texte, est_correcte, id_session, id_question, id_proposition)
          VALUES (NULL, TRUE, ${id_session}, ${id_question}, ${id_proposition})
          ON CONFLICT DO NOTHING;
        `;
      } else {
        await q`
          INSERT INTO reponse_session (reponse_texte, est_correcte, id_session, id_question, id_proposition)
          VALUES ('Réponse libre (mock)', NULL, ${id_session}, ${id_question}, NULL)
          ON CONFLICT DO NOTHING;
        `;
      }
    }
  }

  return {
    utilisateurs: utilisateurIds.length,
    cours: coursIds.length,
    conversations: conversationIds.length,
    questionnaires: questionnaireIds.length,
    sessions: sessionIds.length,
  };
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  try {
    const connectionString =
      process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
    if (!connectionString) {
      return Response.json(
        { error: "Missing POSTGRES_URL or DATABASE_URL env var" },
        { status: 500 },
      );
    }

    const sql = postgres(connectionString, { ssl: "require", prepare: false });
    const results = await sql.begin(async (tx) => {
      await ensureSchema(tx);
      return await seedMockData(tx);
    });

    return Response.json({ ok: true, ...results });
  } catch (error) {
    console.error("[seed] Failed", error);
    return Response.json({ error: "Seeding failed" }, { status: 500 });
  }
}
