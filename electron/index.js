
import * as fs from "node:fs";
import * as os from "node:os";
import * as fsp from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { app, BrowserWindow, session, protocol } from "electron";
import squirrelStartup from "electron-squirrel-startup";
import { createRequestHandler } from "@remix-run/node";
import * as mime from "mime-types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

protocol.registerSchemesAsPrivileged([
  {
    scheme: "http",
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

fs.mkdirSync(path.resolve(os.homedir(), ".remix-llm"), { recursive: true });

if (squirrelStartup) {
  app.quit();
}

const viteDevServer = !process.env.DEV
  ? undefined
  : await import("vite").then((vite) =>
      vite.createServer({
        server: {
          // middlewareMode: true,
          strictPort: true,
          hmr: {
            host: "localhost",
            port: 8888,
            clientPort: 8888,