"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../../auth";
import bcrypt from "bcrypt";
import {
  coursData,
  conversationData,
  documentData,
  messageData,
  propositionData,
  questionData,
  questionnaireData,
  reponseData,
  sessionData,
  utilisateurData,
} from "./data";

import type {
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
} from "./definitions";
import { z } from "zod";

export async function createUtilisateurAction(input: CreateUtilisateurInput) {
  return utilisateurData.create(input);
}

export async function updateUtilisateurAction(
  id_utilisateur: number,
  patch: UpdateUtilisateurInput,
) {
  return utilisateurData.update(id_utilisateur, patch);
}

export async function deleteUtilisateurAction(id_utilisateur: number) {
  return utilisateurData.remove(id_utilisateur);
}

export async function createCoursAction(input: CreateCoursInput) {
  return coursData.create(input);
}

export async function updateCoursAction(
  id_cours: number,
  patch: UpdateCoursInput,
) {
  return coursData.update(id_cours, patch);
}

export async function deleteCoursAction(id_cours: number) {
  return coursData.remove(id_cours);
}

export async function createDocumentAction(input: CreateDocumentInput) {
  return documentData.create(input);
}

export async function updateDocumentAction(
  id_document: number,
  patch: UpdateDocumentInput,
) {
  return documentData.update(id_document, patch);
}

export async function deleteDocumentAction(id_document: number) {
  return documentData.remove(id_document);
}

export async function createConversationAction(input: CreateConversationInput) {
  return conversationData.create(input);
}

export async function updateConversationAction(
  id_conversation: number,
  patch: UpdateConversationInput,
) {
  return conversationData.update(id_conversation, patch);
}

export async function deleteConversationAction(id_conversation: number) {
  return conversationData.remove(id_conversation);
}

export async function createMessageAction(input: CreateMessageInput) {
  return messageData.create(input);
}

export async function updateMessageAction(
  id_message: number,
  patch: UpdateMessageInput,
) {
  return messageData.update(id_message, patch);
}

export async function deleteMessageAction(id_message: number) {
  return messageData.remove(id_message);
}

export async function createQuestionnaireAction(
  input: CreateQuestionnaireInput,
) {
  return questionnaireData.create(input);
}

export async function updateQuestionnaireAction(
  id_questionnaire: number,
  patch: UpdateQuestionnaireInput,
) {
  return questionnaireData.update(id_questionnaire, patch);
}

export async function deleteQuestionnaireAction(id_questionnaire: number) {
  return questionnaireData.remove(id_questionnaire);
}

export async function createQuestionAction(input: CreateQuestionInput) {
  return questionData.create(input);
}

export async function updateQuestionAction(
  id_question: number,
  patch: UpdateQuestionInput,
) {
  return questionData.update(id_question, patch);
}

export async function deleteQuestionAction(id_question: number) {
  return questionData.remove(id_question);
}

export async function createPropositionAction(input: CreatePropositionInput) {
  return propositionData.create(input);
}

export async function updatePropositionAction(
  id_proposition: number,
  patch: UpdatePropositionInput,
) {
  return propositionData.update(id_proposition, patch);
}

export async function deletePropositionAction(id_proposition: number) {
  return propositionData.remove(id_proposition);
}

export async function createSessionAction(
  input: CreateSessionEntrainementInput,
) {
  return sessionData.create(input);
}

export async function updateSessionAction(
  id_session: number,
  patch: UpdateSessionEntrainementInput,
) {
  return sessionData.update(id_session, patch);
}

export async function deleteSessionAction(id_session: number) {
  return sessionData.remove(id_session);
}

export async function createReponseAction(input: CreateReponseSessionInput) {
  return reponseData.create(input);
}

export async function updateReponseAction(
  id_reponse: number,
  patch: UpdateReponseSessionInput,
) {
  return reponseData.update(id_reponse, patch);
}

export async function deleteReponseAction(id_reponse: number) {
  return reponseData.remove(id_reponse);
}

export async function authenticate(
  prevState: string | null | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function register(
  prevState: string | null | undefined,
  formData: FormData,
) {
  const parsed = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
    })
    .safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

  if (!parsed.success) {
    return "Invalid signup form.";
  }

  if (parsed.data.password !== parsed.data.confirmPassword) {
    return "Passwords do not match.";
  }

  try {
    const existing = await utilisateurData.getByEmail(parsed.data.email);
    if (existing) {
      return "Email is already in use.";
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10);
    const created = await utilisateurData.create({
      nom: parsed.data.name,
      email: parsed.data.email,
      mot_de_passe: hashed,
    });

    const loginData = new FormData();
    loginData.set("email", parsed.data.email);
    loginData.set("password", parsed.data.password);
    loginData.set("redirectTo", `/${created.id_utilisateur}/dashboard`);

    await signIn("credentials", loginData);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    if (error instanceof AuthError) {
      return "Failed to sign in.";
    }
    console.error("[register] Failed", error);
    return "Failed to create account.";
  }
}
