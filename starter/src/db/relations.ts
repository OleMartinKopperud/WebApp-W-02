// Relations v2, som er måten Drizzle v1 gjør det på.
//
// Alle relasjoner defineres i ETT kall, ikke per tabell med `relations()` slik
// det var i 0.x. `fields`/`references` heter nå `from`/`to`.
//
// Det er dette objektet som gjør at
// `db.query.tasks.findFirst({ with: { user: true } })` virker. Det sendes til
// `drizzle(..., { relations })` i ./index.ts.
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    // En bruker har mange oppgaver.
    tasks: r.many.tasks({ from: r.users.id, to: r.tasks.userId }),
  },
  tasks: {
    // En oppgave har én bruker. `optional: false` gjør den ikke-nullbar i typen.
    user: r.one.users({
      from: r.tasks.userId,
      to: r.users.id,
      optional: false,
    }),
  },
}));

export type Relations = typeof relations;
