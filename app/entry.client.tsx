import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

declare global {
  interface MockRequest {
    body?: ArrayBuffer;
    headers: Record<string, string[]>;
    method: string;
    url: string;
  }

  type MockResponse = { rethrow?: 