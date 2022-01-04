import { asc, desc, eq, sql } from "drizzle-orm";
import { db, chat, message } from "@/db.server";

export async function createChat() {
  const chatCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(chat);
  const count = chatCount[0]?.count || 0;
  const result = await db
    .insert(chat)
    .values({
      title: `Chat ${count + 1}`,
    })
    .returning({ id: chat.id });
  if (!result[0]?.id) return undefined;
  return result[0].id;
}

export async function createChatMessage(
  chatId: string,
  author: "assistant" | "human",
  content: string
) {
  const result = await db
    .insert(message)
    .values({
      author,
      chatId,
      content,
    })
    .returning({ id: message.id });
  if (!result[0]?.id) return undefined;
  return result[0].id;
}

export async function createStreamingChatMessage(
  chatId: string,
  author: "assistant" | "human",
  content: ReadableStream<string>
) {
  const result = await db
    .insert(message)
    .values({
      author,
      chatId,
      content: "",
    })
    .returning({ id: message.id });
  if (!result[0]?.id) return undefined;
  const id = result[0].id;

  content
    .pipeTo(
      new WritableStream({
        async write(chunk) {
          const updated = await db
            .update(message)
            .set({
              content: sql`${message.content} || ${chunk}`,
            })
            .where(eq(message.id, id))
            .returning({ id: message.id });
          if (!updated[0]?.id) throw new Error("Failed to update message");
        },
        async close() {
          const items = await db
            .select({ content: message.content })
            .from(message)
            .where(eq(message.id, id));
          const item