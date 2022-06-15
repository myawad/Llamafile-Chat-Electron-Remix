import * as path from "node:path";

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { getMessages } from "@/data.server/chat";
import {
  getLlamafileDirectory,
  getPrompt,
  getSettings,
} from "@/data.server/settings";
import { LlamafileModel } from "@/langchain.server/llamafile-model";

export async function streamChatCompletion(
  chatId: string,
  message: string,
  signal: AbortSignal
): Promise<ReadableStream<string>> {
  const [settings, chatMessages] = await Promise.all([
    getSettings(),
    getMessages(chatId).then((messages) =>
      messages.map((message) => [message.author, message.content])
    ),
  ]);
  chatMessages.push(["human", message]);

  let prompt = "You are a helpful AI assistant.";
  if (settings.promptId) {
    const selectedPrompt = await getPrompt(settings.promptId);
    if (selectedPrompt) {
      prompt = selectedPrompt;
    }
  }

  const messages = [
    new SystemMessage