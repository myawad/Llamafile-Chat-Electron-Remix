import { asc, desc, eq, sql } from "drizzle-orm";
import { db, chat, message } from "@/db.server";

export async function createChat() {
  const chatCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(chat);
  const count = chatCount[0]?.count || 0