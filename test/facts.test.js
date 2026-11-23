import { jest } from "@jest/globals";
import {
  SEED_FACTS,
  loadFacts,
  getFactCount,
  getFactByIndex,
  getRandomFact,
  setInMemoryFacts
} from "../lib/data/facts.js";
import rawFacts from "../lib/data/facts.json" with { type: "json" };

describe("facts.js dataset & debloating loader", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => rawFacts
    });
  });

  test("SEED_FACTS contains valid starter feline wisdom", () => {
    expect(SEED_FACTS.length).toBeGreaterThanOrEqual(10);
    SEED_FACTS.forEach(fact => {
      expect(typeof fact).toBe("string");
      expect(fact.trim().length).toBeGreaterThan(15);
    });
  });

  test("debloated facts.json contains 100+ verified unique facts", () => {
    expect(rawFacts.length).toBeGreaterThanOrEqual(100);
    const unique = new Set(rawFacts);
    expect(unique.size).toBe(rawFacts.length);
    rawFacts.forEach(fact => {
      expect(typeof fact).toBe("string");
      expect(fact.trim().length).toBeGreaterThan(15);
    });
  });

  test("loadFacts hydrates full catalog via fetch and localStorage", async () => {
    const loaded = await loadFacts();
    expect(loaded.length).toBe(rawFacts.length);
    expect(getFactCount()).toBe(rawFacts.length);
  });

  test("getFactByIndex returns facts within bounds and wraps around", () => {
    setInMemoryFacts(rawFacts);
    expect(getFactByIndex(0)).toBe(rawFacts[0]);
    expect(getFactByIndex(1)).toBe(rawFacts[1]);
    expect(getFactByIndex(rawFacts.length)).toBe(rawFacts[0]);
    expect(getFactByIndex(-1)).toBe(rawFacts[rawFacts.length - 1]);
    expect(getFactByIndex(NaN)).toBe(rawFacts[0]);
  });

  test("getRandomFact returns a random fact from the database", () => {
    setInMemoryFacts(rawFacts);
    const fact = getRandomFact();
    expect(rawFacts).toContain(fact);
  });

  test("getRandomFact avoids repeating previous fact when possible", () => {
    setInMemoryFacts(rawFacts);
    const first = rawFacts[0];
    const second = getRandomFact(first);
    expect(second).not.toBe(first);
  });
});
