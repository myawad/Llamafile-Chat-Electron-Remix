import { PlusIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  useFetcher,
  useLoaderData,
  type MetaFunction,
  Form,
  useRevalidator,
} from "@remix-run/react";
import { type ActionFunctionArgs } from "@remix-run/node";
import { serverOnly$ } from "vite-env-only";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addPrompt,
  deletePrompt,
  getLLMs,
  getLlamafileDirectory,
  getPrompts,
  getSettings,
  writeSettings,
} from "@/data.server/settings";
import { debounce } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import { recompileLlamafile } from "./server";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix LLM | Settings" },
    { name: "description", content: "Settings for Remix LLM." },
  ];
};

export const loader = serverOnly$(async () => {
  const [
    llamafileDirectory,
    llms,
    prompts,
    { activeLLM, gpu, promptId, nGpuLayers },
  ] = await Promise.all([
    getLlamafileDirectory(),
    getLLMs(),
    getPrompts(),
    getSettings(),
  ]);

  return {
    activeLLM,
    gpu,
    llamafileDirectory,
    llms,
    nGpuLayers,
    promptId,
    prompts,
  };
});

export const action = serverOnly$(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "select-model": {
      const model = String(formData.get("model") || "");
      const settings = await getSettings();
      settings.activeLLM = model;
      await writeSettings(settings);
      return { success: true };
    }
    case "add-prompt": {
      const content = String(formData.get("content") || "");
      await addPrompt(content);
      return { success: true };
    }
    case "set-gpu": {
      const gpu = String(formData.get("gpu") || "");
      if (
        !gpu ||
        !["AUTO", "APPLE", "AMD", "NVIDIA", "DISABLE"].includes(gpu)
      ) {
        return { success: false };
      }
      const settings = await getSettings();
      settings.gpu = gpu;
      await writeSettings(settings);
      await recompileLlamafile();
      return { success: true };
    }
    case "set-n-gpu-layers": {
      let toSet = undefined;
      const raw = formData.get("n-gpu-layers");
      if (raw) {
        const nGpuLayers = Number(raw);
        if (Number.isSafeInteger(nGpuLayers)) {
          toSet = nGpuLayers;
        }
      }
      const settings = await getSettings();
      settings.nGpuLayers = toSet;
      await writeSettings(settings);
      return { success: true };
    }
    default: {
      const selectPromptId = formData.get("select-prompt");
      if (typeof selectPromptId === "string" && selectPromptId) {
        const settings = await getSettings();
        settings.promptId = selectPromptId;
        await writeSettings(settings);
        return { success: true };
      }

      const deletePromptId = formData.get("delete-prompt");
      if (typeof deletePromptId === "string" && deletePromptId) {
        await deletePrompt(deletePromptId);
        return { success: true };
      }
      throw new Error("Invalid intent");
    }
  }
});

export default function Index() {
  const {
    activeLLM,
    gpu,
    llamafileDirectory,
    llms,
    nGpuLayers,
    promptId,
    prompts,
  } = useLoaderData<typeof loader>();
  const selectModelFetcher = useFetcher<typeof action>();
  const selectGPUFetcher = useFetcher<typeof action>();
  const setNGPULayersFetcher = useFetcher<typeof action>();
  const revalidator = useRevalidator();

  return (
    <div className="container py-4 space-y-4 flex-1 min-h-0 overflow-auto">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Library</CardTitle>
       