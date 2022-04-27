
import * as path from "node:path";

import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import {
  SimpleChatModel,
  type BaseChatModelParams,
} from "@langchain/core/language_models/chat_models";
import { AIMessageChunk, BaseMessage } from "@langchain/core/messages";
import { ChatGenerationChunk } from "@langchain/core/outputs";
import { execa } from "execa";

export interface LlamafileModelParams extends BaseChatModelParams {
  executablePath: string;
  modelPath?: string;
  temperature?: number;
  stop?: string[];
  gpu?: string;
  nGpuLayers?: number | string;
  createPrompt: (messages: BaseMessage[]) => Promise<string>;
}

export class LlamafileModel extends SimpleChatModel {
  private _debugCounter = 0;

  constructor(private params: LlamafileModelParams) {
    super(params);
  }
