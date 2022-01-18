import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import * as stream from "node:stream";

import * as hf from "@huggingface/hub";
import { desc, eq } from "drizzle-orm";

import { db, prompt } from "@/db.server";

export async function getPrompts() {
  return await db.query.prompt.findMany({
    orderBy: desc(prompt.createdAt),
    columns