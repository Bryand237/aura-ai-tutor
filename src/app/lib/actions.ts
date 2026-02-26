'use server';

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
} from './data';

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
} from './definitions';

export async function createUtilisateurAction(input: CreateUtilisateurInput) {
  return utilisateurData.create(input);
}

export async function updateUtilisateurAction(id_utilisateur: number, patch: UpdateUtilisateurInput) {
  return utilisateurData.update(id_utilisateur, patch);
}

export async function deleteUtilisateurAction(id_utilisateur: number) {
  return utilisateurData.remove(id_utilisateur);
}

export async function createCoursAction(input: CreateCoursInput) {
  return coursData.create(input);
}

export async function updateCoursAction(id_cours: number, patch: UpdateCoursInput) {
  return coursData.update(id_cours, patch);
}

export async function deleteCoursAction(id_cours: number) {
  return coursData.remove(id_cours);
}

export async function createDocumentAction(input: CreateDocumentInput) {
  return documentData.create(input);
}

export async function updateDocumentAction(id_document: number, patch: UpdateDocumentInput) {
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

export async function updateMessageAction(id_message: number, patch: UpdateMessageInput) {
  return messageData.update(id_message, patch);
}

export async function deleteMessageAction(id_message: number) {
  return messageData.remove(id_message);
}

export async function createQuestionnaireAction(input: CreateQuestionnaireInput) {
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

export async function updateQuestionAction(id_question: number, patch: UpdateQuestionInput) {
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

export async function createSessionAction(input: CreateSessionEntrainementInput) {
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

export async function updateReponseAction(id_reponse: number, patch: UpdateReponseSessionInput) {
  return reponseData.update(id_reponse, patch);
}

export async function deleteReponseAction(id_reponse: number) {
  return reponseData.remove(id_reponse);
}
