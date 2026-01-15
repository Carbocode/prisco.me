import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.ts";

export function getDb(env: Env) {
  return drizzle(env.HYPERDRIVE.connectionString, { schema });
}
