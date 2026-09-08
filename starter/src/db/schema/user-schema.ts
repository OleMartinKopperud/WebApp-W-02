import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

/**
 * Eksempeltabell. Bytt den ut med deres egen datamodell.
 */
export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});

// Typen utledes FRA tabellen, så den kan aldri komme i utakt med skjemaet.
export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;
