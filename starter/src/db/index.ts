import { drizzle } from "drizzle-orm/d1";
import type { SQLiteAsyncDatabase } from "drizzle-orm/sqlite-core";
import { env } from "cloudflare:workers";
import * as schema from "./schema";
import { relations } from "./relations";

/**
 * Én Drizzle-klient mot D1.
 *
 * I Drizzle v1 sendes `relations` inn her, ikke `schema`. Tabellene leses ut
 * av relasjonsobjektet.
 *
 * Klienten lages på modulnivå, og det er trygt: `env` er request-scopet bak
 * kulissene. Det som IKKE er trygt, er å legge noe som gjelder én bruker, som
 * en sesjon, i en modulvariabel. Da deles den mellom alle.
 */
export const db = drizzle(env.DB, { relations });

export { schema, relations };

/**
 * Databasetype uten binding til driver. Både D1 i produksjon og
 * better-sqlite3 i testene er `SQLiteAsyncDatabase`, så den samme koden kjører
 * mot begge. Det er dette som gjør det mulig å teste spørringer raskt.
 */
export type DB = SQLiteAsyncDatabase<any, any, typeof relations>;
