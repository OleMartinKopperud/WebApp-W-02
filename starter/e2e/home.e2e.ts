// End to end-test med Playwright. Kjør med:
//   npm run test:e2e      (eller pnpm test:e2e)
//
// Playwright starter dev-serveren selv, åpner en ekte nettleser og klikker som
// en bruker. Det er tregere enn Vitest, så bruk det på de viktige flytene, ikke
// på alt.
//
// Første gang må nettleseren lastes ned:
//   npx playwright install chromium
import { test, expect } from "@playwright/test";

test("forsiden viser overskriften", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Webapplikasjoner 2026" })
  ).toBeVisible();
});

test("telleren teller opp når du trykker", async ({ page }) => {
  await page.goto("/");

  const counterButton = page.getByRole("button", { name: "Trykk her" });

  // Vent til klient-koden har tatt over. Uten dette rekker Playwright å
  // trykke før React er koblet på, og ingenting skjer.
  //
  // Merk at vi venter på KNAPPEN, ikke på `waitForLoadState("networkidle")`.
  // Stille nettverk betyr ikke at siden er klar, og i dev-modus blir det
  // aldri stille: HMR holder en socket åpen. Counter skrur på knappen først
  // etter hydrering, og det er en presis ting å vente på.
  await expect(counterButton).toBeEnabled();

  await counterButton.click();

  await expect(page.getByText("Trykket 1 ganger")).toBeVisible();
});

test("api-ruta svarer JSON", async ({ request }) => {
  const response = await request.get("/api/status");

  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ status: "ok" });
});
