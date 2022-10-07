
import * as React from "react";
import {
  type MetaFunction,
  useFetcher,
  useLoaderData,
  redirect,
  useRevalidator,
} from "@remix-run/react";
import { type ActionFunctionArgs } from "@remix-run/node";
import { ReloadIcon } from "@radix-ui/react-icons";
import { serverOnly$ } from "vite-env-only";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  downloadBaseLlamafile,
  downloadPhi2,
  getLlamafileDirectory,
  getLLMs,
  getSettings,
  writeSettings,
} from "@/data.server/settings";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix LLM" },
    { name: "description", content: "Welcome to Remix LLM!" },
  ];
};

export const loader = serverOnly$(async () => {
  const { activeLLM, baseLlamafile } = await getSettings();

  if (activeLLM && baseLlamafile) {
    throw redirect("/");
  }

  const [llms, llamafileDirectory] = await Promise.all([
    getLLMs(),
    getLlamafileDirectory(),
  ]);

  return {
    activeLLM,
    baseLlamafile,
    llamafileDirectory,
    llms,
  };
});

export const action = serverOnly$(
  async ({ context, request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const intent = formData.get("intent");
    switch (intent) {
      case "download-base-llamafile":
        await downloadBaseLlamafile((progress) =>
          context.ipcEvent("download-base-llamafile-progress", progress)
        );
        return true;
      case "download-base-model":
        await downloadPhi2((progress) =>
          context.ipcEvent("download-phi2-progress", progress)
        );
        return true;