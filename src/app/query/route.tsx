import { NextResponse } from "next/server";
import { Pool } from "pg";

const CREATE_SCHEMA_SQL = `
BEGIN;

CREATE TABLE IF NOT EXISTS utilisateur (
  id_utilisateur BIGSERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mot_de_passe TEXT NOT NULL,
  date_inscription TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cours (
  id_cours BIGSERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE
);

DO $$
BEGIN
  CREATE TYPE type_document AS ENUM ('PDF', 'DOCX');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS document (
  id_document BIGSERIAL PRIMARY KEY,
  nom_fichier TEXT NOT NULL,
  chemin_fichier TEXT NOT NULL,
  type_document type_document NOT NULL,
  date_upload TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contenu_texte TEXT,
  id_cours BIGINT NOT NULL REFERENCES cours(id_cours) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS conversation (
  id_conversation BIGSERIAL PRIMARY KEY,
  date_debut TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_fin TIMESTAMPTZ,
  id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
  id_cours BIGINT NOT NULL REFERENCES cours(id_cours) ON DELETE CASCADE
);

DO $$
BEGIN
  CREATE TYPE auteur_message AS ENUM ('utilisateur', 'ia');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS message (
  id_message BIGSERIAL PRIMARY KEY,
  contenu TEXT NOT NULL,
  date_heure TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  auteur auteur_message NOT NULL,
  id_conversation BIGINT NOT NULL REFERENCES conversation(id_conversation) ON DELETE CASCADE
);

DO $$
BEGIN
  CREATE TYPE type_questionnaire AS ENUM ('qcm', 'flashcard', 'mixte');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS questionnaire (
  id_questionnaire BIGSERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT,
  date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type_questionnaire type_questionnaire NOT NULL,
  id_cours BIGINT NOT NULL REFERENCES cours(id_cours) ON DELETE CASCADE,
  genere_par_ia BOOLEAN NOT NULL DEFAULT FALSE
);

DO $$
BEGIN
  CREATE TYPE type_question AS ENUM ('qcm', 'flashcard');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS question (
  id_question BIGSERIAL PRIMARY KEY,
  texte TEXT NOT NULL,
  explication TEXT,
  type_question type_question NOT NULL,
  id_questionnaire BIGINT NOT NULL REFERENCES questionnaire(id_questionnaire) ON DELETE CASCADE,
  genere_par_ia BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS proposition (
  id_proposition BIGSERIAL PRIMARY KEY,
  texte TEXT NOT NULL,
  est_correcte BOOLEAN NOT NULL DEFAULT FALSE,
  id_question BIGINT NOT NULL REFERENCES question(id_question) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS session_entrainement (
  id_session BIGSERIAL PRIMARY KEY,
  date_debut TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  date_fin TIMESTAMPTZ,
  id_utilisateur BIGINT NOT NULL REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
  id_questionnaire BIGINT NOT NULL REFERENCES questionnaire(id_questionnaire) ON DELETE CASCADE
);

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

CREATE INDEX IF NOT EXISTS idx_cours_id_utilisateur ON cours(id_utilisateur);
CREATE INDEX IF NOT EXISTS idx_document_id_cours ON document(id_cours);
CREATE INDEX IF NOT EXISTS idx_conversation_id_cours ON conversation(id_cours);
CREATE INDEX IF NOT EXISTS idx_conversation_id_utilisateur ON conversation(id_utilisateur);
CREATE INDEX IF NOT EXISTS idx_message_id_conversation ON message(id_conversation);
CREATE INDEX IF NOT EXISTS idx_questionnaire_id_cours ON questionnaire(id_cours);
CREATE INDEX IF NOT EXISTS idx_question_id_questionnaire ON question(id_questionnaire);
CREATE INDEX IF NOT EXISTS idx_proposition_id_question ON proposition(id_question);
CREATE INDEX IF NOT EXISTS idx_session_id_utilisateur ON session_entrainement(id_utilisateur);
CREATE INDEX IF NOT EXISTS idx_session_id_questionnaire ON session_entrainement(id_questionnaire);
CREATE INDEX IF NOT EXISTS idx_reponse_id_session ON reponse_session(id_session);
CREATE INDEX IF NOT EXISTS idx_reponse_id_question ON reponse_session(id_question);

COMMIT;
`;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL env var");
  }
  return new Pool({ connectionString });
}

export async function GET() {
  return NextResponse.json({ sql: CREATE_SCHEMA_SQL });
}

export async function POST() {
  const pool = getPool();
  try {
    await pool.query(CREATE_SCHEMA_SQL);
    return NextResponse.json({ ok: true });
  } finally {
    await pool.end();
  }
}
