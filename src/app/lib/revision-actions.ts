"use server";

import { z } from "zod";
import { conversationData, coursData, documentData, messageData } from "./data";
import { auth } from "../../../auth";
import { put } from "@vercel/blob";
import pdf from "pdf-parse";
import mammoth from "mammoth";

async function assertUserAccess(userId: number) {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  if (!sessionUserId) throw new Error("Unauthorized");
  if (String(userId) !== String(sessionUserId)) {
    throw new Error("Forbidden");
  }
}

async function assertCoursOwnership(userId: number, coursId: number) {
  const cours = await coursData.getById(coursId);
  if (!cours) throw new Error("Cours not found");
  if (String(cours.id_utilisateur) !== String(userId)) {
    throw new Error("Forbidden");
  }
  return cours;
}

async function getOrCreateConversation(userId: number, coursId: number) {
  const conversations = await conversationData.listByCours(coursId);
  const existing = conversations.find(
    (c) => String(c.id_utilisateur) === String(userId),
  );
  if (existing) return existing;
  return conversationData.create({
    id_utilisateur: userId,
    id_cours: coursId,
    date_debut: new Date(),
    date_fin: null,
  });
}

export async function uploadCoursDocument(formData: FormData) {
  const parsed = z
    .object({
      userId: z.coerce.number().int().positive(),
      coursId: z.coerce.number().int().positive(),
    })
    .safeParse({
      userId: formData.get("userId"),
      coursId: formData.get("coursId"),
    });

  if (!parsed.success) throw new Error("Invalid upload form");
  const { userId, coursId } = parsed.data;

  await assertUserAccess(userId);
  await assertCoursOwnership(userId, coursId);

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Missing file");
  }

  const filename = file.name || "document";
  const ext = filename.split(".").pop()?.toLowerCase();
  const type_document = ext === "docx" ? "DOCX" : "PDF";

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const blobPath = `cours/${coursId}/${Date.now()}-${filename}`;

  let blob: Awaited<ReturnType<typeof put>>;
  try {
    blob = await put(blobPath, buffer, {
      access: "public",
      contentType: file.type || undefined,
      addRandomSuffix: false,
    } as unknown as Parameters<typeof put>[2]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('access must be "public"')) {
      throw new Error(
        "Vercel Blob configuration mismatch: this project is using a private Blob store (so uploads must use private access), but your BLOB_READ_WRITE_TOKEN appears to be for a public-access store. Fix by generating a new token for the private store, or switching the store access mode to public.",
      );
    }
    throw err;
  }

  let extractedText: string | null = null;
  try {
    if (type_document === "PDF") {
      const result = await pdf(buffer);
      extractedText = result.text?.trim() ? result.text.trim() : null;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value?.trim() ? result.value.trim() : null;
    }
  } catch {
    extractedText = null;
  }

  return documentData.create({
    id_cours: coursId,
    nom_fichier: filename,
    type_document,
    chemin_fichier: blob.url,
    contenu_texte: extractedText,
    date_upload: new Date(),
  });
}

export async function addCoursDocument(formData: FormData) {
  const parsed = z
    .object({
      userId: z.coerce.number().int().positive(),
      coursId: z.coerce.number().int().positive(),
      nom_fichier: z.string().min(1),
      type_document: z.enum(["PDF", "DOCX"]),
      contenu_texte: z.string().optional(),
    })
    .safeParse({
      userId: formData.get("userId"),
      coursId: formData.get("coursId"),
      nom_fichier: formData.get("nom_fichier"),
      type_document: formData.get("type_document"),
      contenu_texte: formData.get("contenu_texte"),
    });

  if (!parsed.success) throw new Error("Invalid document form");

  const { userId, coursId, nom_fichier, type_document, contenu_texte } =
    parsed.data;

  await assertUserAccess(userId);
  await assertCoursOwnership(userId, coursId);

  return documentData.create({
    id_cours: coursId,
    nom_fichier,
    type_document,
    chemin_fichier: `/uploads/${nom_fichier}`,
    contenu_texte: contenu_texte?.trim() ? contenu_texte.trim() : null,
    date_upload: new Date(),
  });
}

export async function deleteCoursDocument({
  userId,
  coursId,
  documentId,
}: {
  userId: number;
  coursId: number;
  documentId: number;
}) {
  await assertUserAccess(userId);
  await assertCoursOwnership(userId, coursId);

  const doc = await documentData.getById(documentId);
  if (!doc) return false;
  if (String(doc.id_cours) !== String(coursId)) throw new Error("Forbidden");

  return documentData.remove(documentId);
}

export async function sendCoursChatMessage(formData: FormData) {
  const parsed = z
    .object({
      userId: z.coerce.number().int().positive(),
      coursId: z.coerce.number().int().positive(),
      conversationId: z.coerce.number().int().positive(),
      content: z.string().min(1),
      contextDocumentId: z.coerce.number().int().positive().optional(),
    })
    .safeParse({
      userId: formData.get("userId"),
      coursId: formData.get("coursId"),
      conversationId: formData.get("conversationId"),
      content: formData.get("content"),
      contextDocumentId: formData.get("contextDocumentId") ?? undefined,
    });

  if (!parsed.success) throw new Error("Invalid message form");

  const { userId, coursId, conversationId, content, contextDocumentId } =
    parsed.data;

  await assertUserAccess(userId);
  await assertCoursOwnership(userId, coursId);

  const conversation = await conversationData.getById(conversationId);
  if (!conversation) throw new Error("Conversation not found");
  if (
    String(conversation.id_utilisateur) !== String(userId) ||
    String(conversation.id_cours) !== String(coursId)
  ) {
    throw new Error("Forbidden");
  }

  await messageData.create({
    id_conversation: conversationId,
    auteur: "utilisateur",
    contenu: content,
    date_heure: new Date(),
  });

  let contextText = "";
  if (contextDocumentId) {
    const doc = await documentData.getById(contextDocumentId);
    if (doc && String(doc.id_cours) === String(coursId) && doc.contenu_texte) {
      contextText = doc.contenu_texte;
    }
  } else {
    const docs = await documentData.listByCours(coursId);
    contextText = docs
      .map((d) =>
        d.contenu_texte ? `${d.nom_fichier}: ${d.contenu_texte}` : "",
      )
      .filter(Boolean)
      .join("\n\n");
  }

  const clipped = contextText.trim().slice(0, 1200);
  const aiReply = clipped
    ? `Réponse (placeholder) basée sur tes documents:\n\n${clipped}\n\nQuestion: ${content}`
    : `Réponse (placeholder): Je n'ai pas encore de contenu texte de document pour répondre.\n\nQuestion: ${content}`;

  await messageData.create({
    id_conversation: conversationId,
    auteur: "ia",
    contenu: aiReply,
    date_heure: new Date(),
  });

  return true;
}

export async function getRevisionConversationBootstrap(
  userId: number,
  coursId: number,
) {
  await assertUserAccess(userId);
  const cours = await assertCoursOwnership(userId, coursId);
  const conversation = await getOrCreateConversation(userId, coursId);
  const documents = await documentData.listByCours(coursId);
  const messages = await messageData.listByConversation(
    conversation.id_conversation,
  );

  return { cours, conversation, documents, messages };
}
