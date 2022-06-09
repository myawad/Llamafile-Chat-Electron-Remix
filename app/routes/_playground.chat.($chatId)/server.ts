import * as path from "node:path";

import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { getMessages } from "@/data.server/chat";
import {
  getLlamafil