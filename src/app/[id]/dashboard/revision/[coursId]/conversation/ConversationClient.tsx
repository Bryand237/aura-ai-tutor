"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import styles from "./conversation.module.css";
import type { Document, Message } from "@/app/lib/definitions";
import {
  deleteCoursDocument,
  sendCoursChatMessage,
  uploadCoursDocument,
} from "@/app/lib/revision-actions";

export default function ConversationClient({
  userId,
  coursId,
  documents: initialDocuments,
  messages: initialMessages,
  conversationId,
}: {
  userId: number;
  coursId: number;
  documents: Document[];
  messages: Message[];
  conversationId: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedDocId, setSelectedDocId] = useState<string>("all");
  const [messageText, setMessageText] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [optimisticMessages, setOptimisticMessages] =
    useState<Message[]>(initialMessages);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const documents = initialDocuments;
  const messages = optimisticMessages;

  useEffect(() => {
    setOptimisticMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isSending]);

  const contextDocumentId = useMemo(() => {
    if (selectedDocId === "all") return null;
    const n = Number(selectedDocId);
    return Number.isFinite(n) ? n : null;
  }, [selectedDocId]);

  return (
    <div className={`${styles.layout} min-h-0`}>
      <section
        className={`${styles.panel} flex min-h-0 flex-col overflow-hidden`}
      >
        <div className={`${styles.panelHeader} p-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Documents</h2>
              <p className={`mt-1 text-xs ${styles.muted}`}>
                Ajoute ou retire des documents pour guider l&apos;IA.
              </p>
            </div>
            <div className={`px-3 py-1 text-xs ${styles.badge}`}>
              {documents.length}
            </div>
          </div>
        </div>

        <div className={`p-5 ${styles.panelBody} min-h-0`}>
          <form
            action={async (formData) => {
              startTransition(async () => {
                await uploadCoursDocument(formData);
                router.refresh();
              });
            }}
            className="space-y-3"
          >
            <input type="hidden" name="userId" value={String(userId)} />
            <input type="hidden" name="coursId" value={String(coursId)} />

            <div className="grid grid-cols-1 gap-2">
              <input
                name="file"
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="w-full rounded-xl px-3 py-2 text-sm shadow-(--neu-raised-sm)"
                required
              />
              <p className={`text-xs ${styles.muted}`}>
                Formats supportés: PDF, DOCX.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full px-4 py-2 text-sm font-medium shadow-(--neu-raised-sm) disabled:opacity-60"
            >
              Importer
            </button>
          </form>

          <div className={`mt-6 p-3 space-y-3 ${styles.scrollArea}`}>
            {documents.length === 0 ? (
              <p className={`text-sm ${styles.muted}`}>Aucun document.</p>
            ) : (
              documents.map((d) => (
                <div
                  key={d.id_document}
                  className={`${styles.docItem} flex items-start justify-between gap-3 p-4`}
                >
                  <div>
                    <div className="text-sm font-semibold">{d.nom_fichier}</div>
                    <div className={`mt-1 text-xs ${styles.muted}`}>
                      {d.type_document} ·{" "}
                      {d.date_upload.toLocaleDateString("fr-FR")}
                    </div>
                  </div>

                  <form
                    action={async () => {
                      startTransition(async () => {
                        await deleteCoursDocument({
                          userId,
                          coursId,
                          documentId: d.id_document,
                        });
                        router.refresh();
                      });
                    }}
                  >
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded-full px-3 py-1 text-xs shadow-(--neu-raised-sm) disabled:opacity-60"
                    >
                      Retirer
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section
        className={`${styles.panel} flex min-h-0 flex-col overflow-hidden`}
      >
        <div className={`${styles.panelHeader} p-5`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Chat IA</h2>
              <p className={`mt-1 text-xs ${styles.muted}`}>
                Pose tes questions, l&apos;IA répond selon tes documents.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/${userId}/dashboard/training/${coursId}`}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-(--neu-raised-sm) no-underline"
                title="Aller à l'entraînement"
              >
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                Entraînement
              </Link>

              <label className={`text-xs ${styles.muted}`}>Contexte</label>
              <select
                value={selectedDocId}
                onChange={(e) => setSelectedDocId(e.target.value)}
                className="rounded-full px-3 py-2 text-xs shadow-(--neu-raised-sm)"
              >
                <option value="all">Tous les documents</option>
                {documents.map((d) => (
                  <option key={d.id_document} value={String(d.id_document)}>
                    {d.nom_fichier}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={`flex-1 space-y-3 p-5 ${styles.scrollArea}`}>
          {messages.length === 0 ? (
            <p className={`text-sm ${styles.muted}`}>Aucun message.</p>
          ) : (
            messages.map((m) => (
              <div
                key={m.id_message}
                className={`${styles.messageRow} ${
                  m.auteur === "ia" ? styles.msgAi : styles.msgUser
                }`}
              >
                <div className={styles.msgBubble}>
                  <div className="text-sm">{m.contenu}</div>
                  <div className={`mt-1 text-[11px] ${styles.muted}`}>
                    {m.date_heure.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}

          {isSending ? (
            <div className={`${styles.messageRow} ${styles.msgAi}`}>
              <div className={styles.msgBubble}>
                <div className="text-sm">IA…</div>
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-5">
          <form
            action={async () => {
              const content = messageText.trim();
              if (!content) return;

              const optimisticUserMessage: Message = {
                id_message: -Date.now(),
                auteur: "utilisateur",
                contenu: content,
                date_heure: new Date(),
                id_conversation: conversationId,
              };

              setOptimisticMessages((prev) => [...prev, optimisticUserMessage]);
              setMessageText("");
              setIsSending(true);

              const fd = new FormData();
              fd.set("userId", String(userId));
              fd.set("coursId", String(coursId));
              fd.set("conversationId", String(conversationId));
              fd.set("content", content);
              if (contextDocumentId) {
                fd.set("contextDocumentId", String(contextDocumentId));
              }

              startTransition(async () => {
                try {
                  await sendCoursChatMessage(fd);
                } finally {
                  setIsSending(false);
                  router.refresh();
                }
              });
            }}
            className="flex flex-col gap-3 md:flex-row"
          >
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Écris ta question..."
              className="min-h-12 w-full grow rounded-2xl px-4 py-3 text-sm shadow-(--neu-raised-sm)"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full px-5 py-3 text-sm font-semibold shadow-(--neu-raised-sm) disabled:opacity-60"
            >
              {isPending ? "Envoi..." : "Envoyer"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
