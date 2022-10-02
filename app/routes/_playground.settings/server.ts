import * as path from "node:path";

import { LlamafileModel } from "@/langchain.server/llamafile-model";
import { getLlamafileDirectory, getSettings } from "@/data.server/settings";

export async function recompileLlamafile() {
  const llamafileDir = getLlamafileDirectory();
  const settings = await getSettings();

  const chatModel = new LlamafileModel({
    executablePath: path.resolve(llamafileDir, settings.baseLlamafile),
    modelPa