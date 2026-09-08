import { defineConfig, devices } from "@playwright/test";

/**
 * Oppsett for end to end-tester.
 *
 * `npm run test:e2e` starter dev-serveren selv og kjører alt i `e2e/` mot den.
 *
 * Er 5173 opptatt, velg en annen port:
 *   E2E_PORT=5199 npm run test:e2e
 *
 * Sett `E2E_BASE_URL` for å teste mot en app som allerede kjører, eller mot en
 * deployet adresse. Da starter ikke Playwright noen server selv.
 */
const PORT = process.env.E2E_PORT ?? "5173";
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  // Testene deler én database, så de kjører én av gangen.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    // Lagrer en trace når en test feiler. Åpne den med:
    //   npx playwright show-trace test-results/<mappe>/trace.zip
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        // `npm run` virker uansett om dere installerte med npm eller pnpm.
        command: `npm run dev -- --port ${PORT}`,
        url: BASE_URL,
        // Gjenbruker en dev-server som alt kjører på porten. Kjører dere et
        // ANNET prosjekt på 5173, tester Playwright det prosjektet. Da er det
        // E2E_PORT dere vil ha.
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
