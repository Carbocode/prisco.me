import { env } from "cloudflare:workers";

import { getDb } from "@/db";

export const db = () => getDb(env);
