# Regler for kode og KI-verktøy

Startprosjekt for Webapplikasjoner 2026. Denne fila er ment både for dere og
for kodeverktøy som leser repoet (Claude Code, Cursor, Copilot).

## Versjoner

rwsdk 1.7.3 · React 19.2 · Vite 8.2 · TypeScript 7.0 · Zod 4.5 · Tailwind 4.3 ·
Drizzle 1.0.0-rc.4 (Relations v2) · better-auth 1.7 · Vitest 4.1 ·
wrangler 4.129

Slå opp dokumentasjon for **disse** versjonene før du foreslår et API. Ikke
eldre. Alle versjoner er låst uten `^` og `~`, med vilje.

## Fallgruver modellene går i

- **Drizzle.** npm sitt `latest`-merke på `drizzle-orm` peker fortsatt på
  versjon 0. Vi kjører versjon 1, som ligger under `rc`. En «oppdatering til
  siste» er en nedgradering, og da forsvinner halve API-et vi bruker.
  I versjon 1: `defineRelations` i `src/db/relations.ts`, ikke `relations()`
  per tabell. `db.query.*.findFirst({ where: { id } })` tar et filterobjekt,
  ikke `eq()`. `createInsertSchema` kommer fra `drizzle-orm/zod`, ikke fra en
  egen `drizzle-zod`-pakke.
- **Tailwind 4.** Tokens defineres i en `@theme`-blokk i `src/app/styles.css`.
  Det finnes ingen `tailwind.config.js`, og et forslag som lager en er et svar
  for versjon 3.
- **React Compiler.** Kjører som egen babel-transform i `vite.config.mts`, ikke
  via `react({ babel: ... })`, fordi Vite 8 bygger med rolldown.
- **Det er ikke Node.** Koden kjører i `workerd`. `fs`, `path` og `process`
  finnes ikke uten videre. En modulvariabel som teller noe virker lokalt og er
  feil i produksjon.

## Regler i dette prosjektet

- `"use client"` bare der det faktisk er state eller hendelser, og alltid på
  **linje 1**. En kommentar over gjør fila stille om til en server-modul.
- Alt som kommer utenfra valideres med Zod og `safeParse`. Aldri `as` for å
  slippe unna en type.
- `sql.raw` er forbudt. Bruk spørringsbyggeren, så bindes verdiene som
  parametre i stedet for å limes inn i teksten.
- Hemmeligheter i `.dev.vars` lokalt og `wrangler secret put` i produksjon.
  Aldri i `wrangler.jsonc`, som ligger i git.
- Forretningsregler og tilgangssjekker skriver dere selv. En modell kjenner
  ikke reglene deres, og gjetter.
- Legg logikk som kan testes uten å starte en server i egne funksjoner. Da kan
  dere teste den med Vitest på millisekunder.

## Kommandoer

```bash
npm run dev        # utviklingsserver, port 5173
npm run lint       # tsc --noEmit
npm test           # vitest
npm run generate   # etter hver endring i wrangler.jsonc
```

Prosjektet virker med både npm og pnpm. `allowScripts` i `package.json` er
npm-siden av `allowBuilds` i `pnpm-workspace.yaml`: begge sier hvilke pakker som
får kjøre installasjonsscript. Uten dem starter ikke utviklingsserveren.
