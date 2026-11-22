/**
 * @file api.js
 * @description API client for fetching random cat facts from live endpoints
 * (primary: https://catfact.ninja/, secondary: https://meowfacts.herokuapp.com/)
 * with timeout resilience, response validation, and automatic fallback to local curated facts.
 */

import { getRandomFact, getAllFacts } from "./data/facts.js";

/**
 * Primary endpoint for https://catfact.ninja/
 */
export const CAT_FACT_API_URL = "https://catfact.ninja/fact";

/**
 * Secondary fallback live endpoint
 */
export const MEOW_FACTS_API_URL = "https://meowfacts.herokuapp.com/";

/**
 * Fetches a single random cat fact from live feline APIs.
 * Tries catfact.ninja first; if unavailable, seamlessly tries meowfacts before failing.
 *
 * @param {object} [options={}]
 * @param {number} [options.timeoutMs=6000] - Timeout in milliseconds.
 * @returns {Promise<{ fact: string, length: number, source: string, isLive: boolean }>}
 */
export async function fetchOnlineFact(options = {}) {
  const { timeoutMs = 6000 } = options;
  let primaryError = null;

  // 1. Try primary endpoint (catfact.ninja)
  let timeoutId = null;
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal = controller ? controller.signal : undefined;

    if (controller && timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    const response = await fetch(CAT_FACT_API_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data && typeof data.fact === "string" && data.fact.trim()) {
      return {
        fact: data.fact.trim(),
        length: data.length || data.fact.length,
        source: "catfact.ninja",
        isLive: true
      };
    }
  } catch (err) {
    primaryError = err;
    console.warn("[CatFacts] Primary API catfact.ninja failed:", err.message);
  } finally {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
  }

  // 2. Try secondary live endpoint (meowfacts)
  let timeoutId2 = null;
  try {
    const controller2 = typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal2 = controller2 ? controller2.signal : undefined;

    if (controller2) {
      timeoutId2 = setTimeout(() => controller2.abort(), 4000);
    }

    const response2 = await fetch(MEOW_FACTS_API_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal: signal2
    });

    if (response2.ok) {
      const data2 = await response2.json();
      if (data2 && Array.isArray(data2.data) && data2.data[0]) {
        const fact = data2.data[0].trim();
        return {
          fact,
          length: fact.length,
          source: "meowfacts",
          isLive: true
        };
      }
    }
  } catch (err2) {
    console.warn("[CatFacts] Secondary API meowfacts failed:", err2.message);
  } finally {
    if (timeoutId2 != null) {
      clearTimeout(timeoutId2);
    }
  }

  throw primaryError || new Error("All live feline API endpoints failed");
}

/**
 * Retrieves a cat fact, attempting live online fetch first if preferOnline is true,
 * and seamlessly falling back to our offline curated library if offline or if fetch fails.
 *
 * @param {object} [options={}]
 * @param {boolean} [options.preferOnline=true] - Whether to attempt live API fetch.
 * @param {number} [options.timeoutMs=6000] - Request timeout.
 * @param {string|null} [options.excludeFact=null] - Fact to avoid repeating if possible.
 * @returns {Promise<{ fact: string, source: string, isLive: boolean }>}
 */
export async function getCatFact(options = {}) {
  const { preferOnline = true, timeoutMs = 6000, excludeFact = null } = options;

  if (preferOnline && typeof fetch === "function") {
    try {
      const online = await fetchOnlineFact({ timeoutMs });
      if (online && online.fact) {
        return {
          fact: online.fact,
          source: online.source,
          isLive: true
        };
      }
    } catch (err) {
      console.warn("[CatFacts] Live fetch from APIs failed, using curated fact fallback:", err.message);
    }
  }

  // Curated offline library fallback
  const fallback = getRandomFact(excludeFact);
  return {
    fact: fallback,
    source: "curated",
    isLive: false
  };
}
