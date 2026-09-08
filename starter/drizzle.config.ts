import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Drizzle v1 writes each migration to its own folder:
  // drizzle/migrations/<timestamp>_<name>/migration.sql + snapshot.json
  out: "./drizzle/migrations",
  // Points at the barrel file, not the folder. drizzle-kit v1 reads every
  // file it globs, so a folder would pick up each table twice: once directly
  // and once through the re-export in index.ts.
  schema: "./src/db/schema/index.ts",
  dialect: "sqlite",
  driver: "d1-http",
  // Only needed for remote push and introspect. `drizzle-kit generate` gets
  // by with `dialect: sqlite` alone.
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
