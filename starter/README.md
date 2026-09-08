# Startprosjekt · Webapplikasjoner 2026

Et ferdig oppsett dere kan bygge prosjektet deres på. Alt dere trenger gjennom
hele semesteret er installert og satt opp, så dere slipper å installere pakker
midt i en oppgave.

RedwoodSDK · React 19 · Vite 8 · TypeScript 7 · Tailwind 4 · Drizzle + D1 ·
Zod 4 · Vitest · Playwright · Cloudflare Workers

---

## Krav

| | Versjon | Sjekk med |
| --- | --- | --- |
| Node.js | **22.12 eller nyere**, 24 anbefalt | `node -v` |
| npm eller pnpm | npm 11+, eller pnpm 10.16+ | `npm -v` / `pnpm -v` |

Prosjektet virker med **begge** pakkebehandlerne. Velg én og bruk den hele
semesteret. Ikke bland dem i samme prosjekt.

Cloudflare-konto trengs ikke for å komme i gang. Databasen kjører lokalt.

---

## Kom i gang

```bash
npm install        # eller: pnpm install
npm run dev        # eller: pnpm dev
```

Åpne `http://localhost:5173`.

Vil dere ha databasen i gang med en gang:

```bash
npm run migrate:dev    # lager tabellene i den lokale databasen
npm run seed           # legger inn litt testdata
```

**Velg én lockfil.** Repoet har både `package-lock.json` (npm) og
`pnpm-lock.yaml` (pnpm), så begge virker rett ut av boksen. Slett den dere ikke
bruker, så kan de ikke komme i utakt.

---

## Hva som ligger her

```
src/
├─ worker.tsx              inngangspunktet. Her registreres alle ruter
├─ client.tsx              starter React i nettleseren
├─ app/
│  ├─ Document.tsx         HTML-skallet rundt alle sider
│  ├─ headers.ts           sikkerhetsheadere, blant annet CSP
│  ├─ styles.css           én linje: @import "tailwindcss"
│  └─ pages/Home.tsx       forsiden. En server-komponent
├─ components/
│  ├─ Counter.tsx          en klient-komponent ("use client")
│  ├─ TimeClient.tsx       samme klokke, men rendret i nettleseren
│  └─ __tests__/           komponenttest med Testing Library
├─ db/
│  ├─ schema/              tabellene. Eksempel: users og tasks
│  ├─ relations.ts         relasjonene mellom tabellene
│  ├─ index.ts             databaseklienten
│  └─ seed.ts              testdata
├─ lib/id.ts               createId(), en id-generator
└─ test/setup-dom.ts       kjøres før hver testfil

e2e/                       Playwright-tester i ekte nettleser
drizzle/migrations/        én mappe per migrasjon. Slett aldri en gammel
public/                    statiske filer
```

Konfigurasjonen ligger i rota: `wrangler.jsonc` (hva appen har tilgang til),
`vite.config.mts`, `vitest.config.ts`, `playwright.config.ts`,
`drizzle.config.ts` og `tsconfig.json`.

**Tabellene i `src/db/schema/` er et eksempel.** Bytt dem ut med deres egen
datamodell, kjør `npm run migrate:new`, og dere har en ny migrasjon.

---

## Kommandoer

| Kommando | Hva den gjør |
| --- | --- |
| `npm run dev` | utviklingsserver på port 5173 |
| `npm run lint` | typesjekk med TypeScript |
| `npm test` | kjører testene én gang |
| `npm run test:watch` | kjører testene på nytt når dere lagrer |
| `npm run test:e2e` | Playwright i ekte nettleser |
| `npm run migrate:new` | lager en migrasjon fra `src/db/schema/` |
| `npm run migrate:dev` | kjører migrasjonene mot den lokale databasen |
| `npm run seed` | legger inn testdata |
| `npm run generate` | oppdaterer typene etter endring i `wrangler.jsonc` |
| `npm run build` | bygger for produksjon |

Bruker dere pnpm, dropp `run`: `pnpm dev`, `pnpm lint`, `pnpm test`.

---

## Databasen

Databasen er **D1**, som er SQLite hos Cloudflare. Lokalt er den bare en fil
under `.wrangler/`, så dere trenger ingen konto for å jobbe.

Slik endrer dere datamodellen:

1. Endre eller legg til en tabell i `src/db/schema/`
2. `npm run migrate:new` lager en migrasjonsfil
3. `npm run migrate:dev` kjører den mot den lokale databasen

En migrasjon er en dagbok: dere **legger til** en ny, og redigerer aldri en som
har kjørt. Har databasen havnet i en rar tilstand, slett `.wrangler/` og kjør
migrasjonene og seed på nytt.

---

## Tester

Det er to slags tester i prosjektet, og de svarer på hver sine spørsmål.

**Vitest** er den dere bruker hele tiden. Rask, kjører i terminalen.

```bash
npm test
npm run test:watch
```

Vanlige tester kjører i Node. Skal testen rendre en komponent, må fila ha denne
linja helt øverst:

```ts
// @vitest-environment happy-dom
```

Se `src/components/__tests__/Counter.test.tsx` for et eksempel med klikk.

**Playwright** starter en ekte nettleser og klikker seg gjennom appen. Tregere,
så bruk den på de viktige flytene.

```bash
npx playwright install chromium   # bare første gang
npm run test:e2e
```

---

## Windows

Alt virker på Windows, men noen kommandoer skrives annerledes i PowerShell.
Enkleste løsning: installer [Git for Windows](https://gitforwindows.org/) og
kjør alt i **Git Bash**.

Ellers:

- Installer Node med [fnm](https://github.com/Schniz/fnm) eller
  [nvm-windows](https://github.com/coreybutler/nvm-windows), ikke fra Microsoft
  Store
- Legg prosjektet på en kort sti, for eksempel `C:\dev\`, og **ikke** i OneDrive.
  Synkronisering låser filer i `node_modules` og `.wrangler`
- `git config --global core.autocrlf input`
- Er noe veldig tregt, legg `node_modules`, `.wrangler` og `.vite` som unntak i
  Windows Defender

---

## Når noe ikke virker

| Problem | Løsning |
| --- | --- |
| Porten er opptatt | Noe annet kjører på 5173. Stopp det, eller kjør `npm run dev -- --port 5174` |
| `npm run dev` starter ikke etter install | Installasjonen hoppet over byggesteg. Kjør install på nytt, og se etter en advarsel om install-scripts |
| TypeScript finner ikke `env.DB` | `npm run generate` |
| «No migrations to apply» | Dere står i feil mappe, eller migrasjonen er ikke laget ennå |
| Testene klager på `better-sqlite3` | Slett `node_modules`, installer på nytt |
| Rare feil etter en oppdatering | `npm run clean`, så start dev-serveren på nytt |
| Databasen er i en rar tilstand | Slett `.wrangler/`, kjør `migrate:dev` og `seed` |
| Playwright finner ingen nettleser | `npx playwright install chromium` |

---

## Om versjonene

Alle pakker er låst til **eksakte** versjoner, uten `^` og `~`. Det er med
vilje: da har alle på gruppa nøyaktig det samme, og en oppdatering midt i
semesteret kan ikke ødelegge noe som virket i går.

To ting er verdt å vite hvis dere spør en KI-modell om hjelp:

- **Drizzle.** Vi bruker versjon 1, som ligger under `rc` hos npm. Det npm
  kaller `latest` er fortsatt versjon 0, med et helt annet API. «Oppdater til
  siste» er altså en nedgradering her.
- **Tailwind 4.** All konfigurasjon skjer i CSS, i en `@theme`-blokk. Foreslår
  modellen en `tailwind.config.js`, svarer den for versjon 3.

`AGENTS.md` i denne mappa oppsummerer versjonene og reglene. Bruker dere Cursor,
Claude Code, Copilot eller lignende, les den fila selv også, og pek verktøyet på
den.
