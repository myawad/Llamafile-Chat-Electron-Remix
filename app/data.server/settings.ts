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
    columns: {
      id: true,
      content: true,
    },
  });
}

export async function getPrompt(id: string) {
  return (
    await db.query.prompt.findFirst({
      where: eq(prompt.id, id),
      columns: {
        content: true,
      },
    })
  )?.content;
}

export async function addPrompt(content: string) {
  return await db
    .insert(prompt)
    .values({
      content,
    })
    .returning({ id: prompt.id });
}

export async function deletePrompt(id: string) {
  await db.delete(prompt).where(eq(prompt.id, id));
}

export function getLlamafileDirectory() {
  let llamafileDir = process.env.LLAMAFILE_PATH;
  if (llamafileDir) {
    llamafileDir = path.resolve(llamafileDir);
  } else {
    llamafileDir = path.resolve(os.homedir(), ".llamafile");
  }
  return llamafileDir;
}

export function getSettingsPath() {
  return path.resolve(os.homedir(), ".remix-llm", "remix-llm.json");
}

export async function getSettings() {
  const settingsPath = getSettingsPath();
  const llamafileDir = getLlamafileDirectory();

  try {
    const settings =
      JSON.parse(await fsp.readFile(settingsPath, "utf-8")) || {};
    if (
      settings.activeLLM &&
      !(await fsp
        .stat(path.res