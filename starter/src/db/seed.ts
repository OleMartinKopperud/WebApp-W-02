// Testdata. Kjør med:
//   npm run seed      (eller pnpm seed)
//
// Poenget med en seed er at databasen kan nullstilles til en kjent tilstand.
// Slett .wrangler/, kjør migrasjonene og denne, så er dere tilbake der dere
// startet. Da slipper dere å lure på om feilen ligger i dataene.
import { defineScript } from "rwsdk/worker";
import { drizzle } from "drizzle-orm/d1";
import { users, tasks } from "./schema";

export const seedData = async (env: Env) => {
  const db = drizzle(env.DB);

  // Tøm først, så seed kan kjøres om igjen uten å doble alt.
  await db.delete(tasks);
  await db.delete(users);

  // Brukerne må inn før oppgavene: fremmednøkkelen krever at brukeren finnes.
  // Databasen nekter hvis dere tar rekkefølgen feil, og det er en god ting.
  const [user] = await db
    .insert(users)
    .values({ name: "Test Testesen", email: "test@example.com" })
    .returning();

  await db.insert(tasks).values([
    {
      title: "Lese leksjonen før timen",
      completed: true,
      userId: user.id,
      dueDate: new Date(Date.now() - 86_400_000),
    },
    {
      title: "Sette opp prosjektet",
      completed: false,
      userId: user.id,
      dueDate: new Date(Date.now() + 86_400_000),
    },
  ]);

  console.log("Seeding ferdig");
};

export default defineScript(async ({ env }) => {
  await seedData(env);
  return Response.json({ success: true });
});
