import { defineConfig } from "vitest/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Vitest config. Three kinds of test run in the same suite:
 *
 *   unit         pure functions in src/lib and src/app/lib
 *   integration  service and repository against in-memory SQLite
 *   component    React components, DOM enabled per file with
 *                `// @vitest-environment happy-dom`
 *
 * `globals: true` lets Testing Library register its own `cleanup` in
 * `afterEach`. Test files still import `describe`/`it`/`expect` explicitly
 * because that reads more clearly.
 *
 * The `@/*` alias mirrors `paths` in tsconfig.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    // Node by default. Component tests switch to happy-dom per file.
    environment: "node",
    setupFiles: ["./src/test/setup-dom.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["node_modules", "dist", ".wrangler"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/test/**",
        "src/**/__tests__/**",
        "src/client.tsx",
        "src/**/*.d.ts",
      ],
    },
  },
});
