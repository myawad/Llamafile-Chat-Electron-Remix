import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import Database from "better-sqlite3";
import { v4 as uuid } from "uuid";

// @ts-expect-error - this is a workaround for drizzle transforming thi