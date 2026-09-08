// Unit test of a pure, reused function. No DOM and no database, so this runs
// in the node environment, which is the default in vitest.config.ts.
import { describe, it, expect } from "vitest";
import { createId } from "@/lib/id";

describe("createId", () => {
  it("returns a non-empty string", () => {
    const id = createId();

    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("returns a new id on every call", () => {
    // 1000 calls is enough to catch an id that never varies at all.
    const ids = new Set(Array.from({ length: 1000 }, () => createId()));

    expect(ids.size).toBe(1000);
  });

  it("uses only URL safe characters", () => {
    // nanoid sitt standardalfabet: A-Z a-z 0-9 _ -
    expect(createId()).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});

describe("createId edge cases", () => {
  it("has a fixed length", () => {
    // nanoid returns 21 characters by default. The column is TEXT PRIMARY
    // KEY so the length is not critical, but it should not vary per call.
    const lengder = new Set(
      Array.from({ length: 100 }, () => createId().length)
    );

    expect(lengder.size).toBe(1);
  });

  it("needs no escaping in a URL", () => {
    const id = createId();

    expect(encodeURIComponent(id)).toBe(id);
  });

  it("never returns an empty or padded string", () => {
    for (let i = 0; i < 100; i++) {
      const id = createId();
      expect(id.trim()).toBe(id);
      expect(id).not.toBe("");
    }
  });
});
