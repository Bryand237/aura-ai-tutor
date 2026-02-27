import { Metadata } from "next";
import ConversationClient from "./ConversationClient";
import { getRevisionConversationBootstrap } from "@/app/lib/revision-actions";

export const metadata: Metadata = {
  title: "Révision | Conversation",
  description: "Conversation IA pour la révision du cours.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; coursId: string }>;
}) {
  const { id, coursId } = await params;
  const userId = Number(id);
  const coursIdNum = Number(coursId);

  if (!Number.isFinite(userId) || !Number.isFinite(coursIdNum)) {
    return <div>Paramètres invalides.</div>;
  }

  const { conversation, documents, messages } =
    await getRevisionConversationBootstrap(userId, coursIdNum);

  return (
    <ConversationClient
      userId={userId}
      coursId={coursIdNum}
      documents={documents}
      messages={messages}
      conversationId={conversation.id_conversation}
    />
  );
}
