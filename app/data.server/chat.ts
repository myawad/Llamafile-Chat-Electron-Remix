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
      c