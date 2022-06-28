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
} from "@/compone