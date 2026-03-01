"use server";

import { z } from "zod";
import { auth } from "../../../auth";
import { coursData } from "./data";
import { revalidatePath } from "next/cache";

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

export async function createCoursFromForm(formData: FormData) {
  const parsed = z
    .object({
      userId: z.coerce.number().int().positive(),
      titre: z
        .string()
        .transform((v) => v.trim())
        .pipe(z.string().min(1).max(120)),
      description: z
        .string()
        .transform((v) => v.trim())
        .optional()
        .nullable(),
    })
    .safeParse({
      userId: formData.get("userId"),
      titre: formData.get("titre"),
      description: formData.get("description"),
    });

  if (!parsed.success) {
    return { ok: false as const, message: "Formulaire invalide." };
  }

  const { userId, titre, description } = parsed.data;
  try {
    await assertUserAccess(userId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("unauthorized")) {
      return { ok: false as const, message: "Tu dois être connecté." };
    }
    if (message.toLowerCase().includes("forbidden")) {
      return { ok: false as const, message: "Accès interdit." };
    }
    return { ok: false as const, message: "Action non autorisée." };
  }

  try {
    const created = await coursData.create({
      id_utilisateur: userId,
      titre,
      description: description && description.length > 0 ? description : null,
    });

    revalidatePath(`/${userId}/dashboard/revision`);

    return {
      ok: true as const,
      coursId: created.id_cours,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("unique")) {
      return {
        ok: false as const,
        message: "Tu as déjà un cours avec ce titre.",
      };
    }

    return {
      ok: false as const,
      message: "Impossible de créer le cours. Réessaie dans un instant.",
    };
  }
}

export async function deleteCoursFromForm(formData: FormData) {
  const parsed = z
    .object({
      userId: z.coerce.number().int().positive(),
      coursId: z.coerce.number().int().positive(),
    })
    .safeParse({
      userId: formData.get("userId"),
      coursId: formData.get("coursId"),
    });

  if (!parsed.success) {
    return { ok: false as const, message: "Requête invalide." };
  }

  const { userId, coursId } = parsed.data;
  try {
    await assertUserAccess(userId);
    await assertCoursOwnership(userId, coursId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("unauthorized")) {
      return { ok: false as const, message: "Tu dois être connecté." };
    }
    if (message.toLowerCase().includes("forbidden")) {
      return { ok: false as const, message: "Accès interdit." };
    }
    return { ok: false as const, message: "Suppression impossible." };
  }

  const removed = await coursData.remove(coursId);
  revalidatePath(`/${userId}/dashboard/revision`);

  return { ok: removed as boolean };
}
