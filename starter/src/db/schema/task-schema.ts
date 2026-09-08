import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user-schema";
import { createId } from "@/lib/id";

/**
 * Eksempeltabell. Bytt den ut med deres egen datamodell.
 *
 * Verdt å merke seg:
 *   $default      kjører i koden når raden lages, her for å gi den en id
 *   references    fremmednøkkel. onDelete er en forretningsbeslutning:
 *                 "cascade" sletter oppgavene når brukeren slettes,
 *                 "set null" lar dem bli stående uten eier
 *   index         lag indeks på kolonner dere filtrerer mye på
 */
export const tasks = sqliteTable(
  "tasks",
  {
    id: text("id")
      .primaryKey()
      .$default(() => createId()),
    title: text("title").notNull(),
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    dueDate: integer("due_date", { mode: "timestamp" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => [index("idx_tasks_user_id").on(table.userId)]
);

export type Task = typeof tasks.$inferSelect;
export type CreateTask = typeof tasks.$inferInsert;
export type UpdateTask = Partial<CreateTask>;
