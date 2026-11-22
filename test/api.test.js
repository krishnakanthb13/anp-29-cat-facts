import { jest } from "@jest/globals";
import { fetchOnlineFact, getCatFact, CAT_FACT_API_URL } from "../lib/api.js";
import { CAT_FACTS } from "../lib/data/facts.js";

describe("api.js", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("fetchOnlineFact", () => {
    test("fetches fact from https://catfact.ninja/fact successfully", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ fact: "Cats have 32 muscles in each ear.", length: 32 })
      });

      const res = await fetchOnlineFact({ timeoutMs: 1000 });
      expect(res.fact).toBe("Cats have 32 muscles in each ear.");
      expect(res.source).toBe("catfact.ninja");
      expect(global.fetch).toHaveBeenCalledWith(CAT_FACT_API_URL, expect.any(Object));
    });

    test("throws on HTTP error", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error"
      });

      await expect(fetchOnlineFact({ timeoutMs: 500 })).rejects.toThrow("HTTP 500");
    });
  });

  describe("getCatFact", () => {
    test("returns online fact when API is available", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ fact: "Kittens sleep a lot.", length: 20 })
      });

      const res = await getCatFact({ preferOnline: true });
      expect(res.fact).toBe("Kittens sleep a lot.");
      expect(res.source).toBe("catfact.ninja");
    });

    test("falls back to curated facts when API fails (offline resilience)", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("Network connection lost"));

      const res = await getCatFact({ preferOnline: true, timeoutMs: 200 });
      expect(CAT_FACTS).toContain(res.fact);
      expect(res.source).toBe("curated");
    });

    test("uses curated facts directly when preferOnline is false", async () => {
      const res = await getCatFact({ preferOnline: false });
      expect(CAT_FACTS).toContain(res.fact);
      expect(res.source).toBe("curated");
    });
  });
});

