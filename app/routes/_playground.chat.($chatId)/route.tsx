
import * as React from "react";
import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useParams,
  useNavigation,
  useNavigate,
} from "@remix-run/react";
import { useForm, getFormProps, getTextareaProps } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import Markdown from "react-markdown";
import { z } from "zod";
import { serverOnly$ } from "vite-env-only";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  createChat,
  createChatMessage,
  createStreamingChatMessage,
  deleteChat,
  getChat,
  getMessages,
} from "@/data.server/chat";
import { useLatestMessage } from "@/stores/latest-messages";

import { streamChatCompletion } from "./server";

export const meta = ({
  data,
}: {
  data?: Awaited<ReturnType<NonNullable<typeof loader>>>;
}) => {
  return [
    { title: `Remix LLM | ${data?.chat?.title || "New Chat"}` },
    {
      name: "description",
      content: data?.chat?.title
        ? `Chat: ${data.chat.title}`
        : "Create a new chat.",
    },
  ];
};
export const loader = serverOnly$(
  async ({ params: { chatId } }: LoaderFunctionArgs) => {
    if (!chatId) {
      return { chat: null, messages: null };
    }

    const [chat, messages] = await Promise.all([
      getChat(chatId),
      getMessages(chatId),
    ]);

    return { chat, messages };
  }
);

const sendMessageSchema = z.object({
  prompt: z.string({ required_error: "Please enter a message." }).trim().min(1),
});

export const action = serverOnly$(
  async ({ context, request, params: { chatId } }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const submission = parseWithZod(formData, { schema: sendMessageSchema });

    switch (formData.get("intent")) {
      case "send-message":
        const send = context?.ipcEvent as (
          event: string,
          ...args: unknown[]
        ) => void;

        const chat = chatId ? await getChat(chatId) : null;
        if (chat) {
          chatId = chat.id;
        } else {
          chatId = await createChat();
        }

        if (!chatId)
          throw new Error("Chat ID not found or could not be created.");
