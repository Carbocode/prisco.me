import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.ts";

export const db = drizzle(env.HYPERDRIVE.connectionString, { schema });
