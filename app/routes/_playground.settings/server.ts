import * as path from "node:path";

import { LlamafileModel } from "@/langchain.server/llamafile-model";
import { getLlamafileDirectory, getSettings } from "@/data.server/settings";

export async function recompileLlamafile() {
  const llamafileDir =