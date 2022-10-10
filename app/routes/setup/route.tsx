
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
      case "select-model":
        const model = String(formData.get("model"));
        const settings = await getSettings();
        settings.activeLLM = model;
        await writeSettings(settings);
        return true;
      default:
        throw new Error("Invalid intent");
    }
  }
);

export default function Setup() {
  const { activeLLM, baseLlamafile, llamafileDirectory, llms } =
    useLoaderData<typeof loader>();
  const downloadLlamafileFetcher = useFetcher();
  const selectModelFetcher = useFetcher();
  const revalidator = useRevalidator();

  const showDownloadBase =
    !baseLlamafile || (baseLlamafile && !!downloadLlamafileFetcher.data);

  const [downloadLlamafileProgress, setDownloadLlamafileProgress] =
    React.useState(0);
  React.useEffect(
    () =>
      window.electronAPI.onDownloadBaseLlamafileProgress((progress) => {
        setDownloadLlamafileProgress(progress);
      }),
    []
  );
  const [downloadPhi2Progress, setDownloadPhi2Progress] = React.useState(0);
  React.useEffect(
    () =>
      window.electronAPI.onDownloadPhi2Progress((progress) => {
        setDownloadPhi2Progress(progress);
      }),
    []
  );

  return (
    <div className="h-full flex flex-col items-center justify-center container py-4">
      <Card className="max-w-screen-md w-full">
        <CardHeader>
          <CardTitle>Setup</CardTitle>
          <CardDescription>Welcome to Remix LLM!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showDownloadBase && (
            <>
              <p>
                Remix LLM needs a copy of the base llamafile to execute models.
              </p>
              <downloadLlamafileFetcher.Form method="POST">
                <input
                  type="hidden"
                  name="intent"
                  value="download-base-llamafile"
                />
                <div className="flex gap-4 items-center">
                  <Button
                    disabled={!!downloadLlamafileFetcher.data}
                    variant={
                      !downloadLlamafileFetcher.data ? "default" : "secondary"
                    }
                  >
                    {downloadLlamafileFetcher.data === true
                      ? "Download successful"
                      : downloadLlamafileFetcher.state !== "idle"
                      ? "Downloading llamafile..."
                      : "Download llamafile-0.6.2"}
                  </Button>
                  {downloadLlamafileFetcher.state !== "idle" && (
                    <Progress
                      value={downloadLlamafileProgress}
                      className="flex-1"
                    />
                  )}
                </div>
              </downloadLlamafileFetcher.Form>
            </>
          )}
          {(!activeLLM || !!selectModelFetcher.data) && (
            <>
              {showDownloadBase && <Separator />}
              <p>
                Remix LLM needs a base llamafile model to execute. We recommend
                using phi-2 as it's lightweight and runs quickly.
              </p>
              <selectModelFetcher.Form method="POST">
                <input
                  type="hidden"