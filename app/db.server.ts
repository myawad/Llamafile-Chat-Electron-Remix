import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import Database from "better-sqlite3";
import { v4 as uuid } from "uuid";

// @ts-expect-error - this is a workaround for drizzle transforming this to CJS for the migrations CLI
if (typeof __dirname === "undefined") {
  var __dirname = path.dirname(fileURLToPath(import.meta.url));
}

export const chat = sqliteTable("chat", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  title: text("title").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const message = sqliteTable("message", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  author: text("author", { enum: ["assistant", "human"] }).notNull(),
  content: text("content").notNull(),
  createdAt: 