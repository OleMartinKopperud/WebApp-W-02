// Samler alle tabellene ett sted. drizzle.config.ts peker på denne fila, ikke
// på mappa: drizzle-kit leser alt den finner, og en mappe ville gitt hver
// tabell to ganger (én gang direkte, én gang via denne re-eksporten).
export * from "./user-schema";
export * from "./task-schema";
