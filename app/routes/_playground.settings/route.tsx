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

export co