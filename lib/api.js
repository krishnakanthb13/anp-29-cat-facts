/**
 * @file api.js
 * @description API client for fetching random cat facts from live endpoints
 * (primary: https://catfact.ninja/, secondary: https://meowfacts.herokuapp.com/)
 * with timeout resilience, response validation, and automatic fallback to local curated facts.
 */

import { getRandomFact } from "./data/facts.js";

/**
 * Primary endpoint for https://catfact.ninja/
 */
export const CAT_FACT_API_URL = "https://catfact.ninja/fact";

/**
 * Secondary fallback live endpoint
 */
export const MEOW_FACTS_API_URL = "https://meowfacts.herokuapp.com/";

/**
 * Performs a GET request with an abort timeout and JSON parsing.
 * @param {string} url - Target URL to request.
 * @param {number} timeoutMs - Timeout duration in milliseconds.
 * @returns {Promise<any>} - Parsed JSON response object.
 */
async function fetchJsonWithTimeout(url, timeoutMs) {
  let timeoutId = null;
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal = controller ? controller.signal : undefined;

    if (controller && timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } finally {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Fetches a single random cat fact from live feline APIs.
 * Tries catfact.ninja first; if unavailable, seamlessly tries meowfacts before failing.
 *
 * @param {object} [options={}] - Request options.
 * @param {number} [options.timeoutMs=6000] - Timeout in milliseconds.
 * @returns {Promise<{ fact: string, length: number, source: string, isLive: boolean }>} - Retrieved fact and metadata.
 */
export async function fetchOnlineFact(options = {}) {
  const { timeoutMs = 6000 } = options;
  let primaryError = null;

  // 1. Try primary endpoint (catfact.ninja)
  try {
    const data = await fetchJsonWithTimeout(CAT_FACT_API_URL, timeoutMs);
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
    // console.warn("[CatFacts] Primary API catfact.ninja failed:", err.message);
  }

  // 2. Try secondary live endpoint (meowfacts)
  try {
    const data2 = await fetchJsonWithTimeout(MEOW_FACTS_API_URL, 4000);
    if (data2 && Array.isArray(data2.data) && data2.data[0]) {
      const fact = data2.data[0].trim();
      return {
        fact,
        length: fact.length,
        source: "meowfacts",
        isLive: true
      };
    }
  } catch (err2) {
    // console.warn("[CatFacts] Secondary API meowfacts failed:", err2.message);
  }

  throw primaryError || new Error("All live feline API endpoints failed");
}

/**
 * Retrieves a cat fact, attempting live online fetch first if preferOnline is true,
 * and seamlessly falling back to our offline curated library if offline or if fetch fails.
 *
 * @param {object} [options={}] - Retrieval configuration.
 * @param {boolean} [options.preferOnline=true] - Whether to attempt live API fetch.
 * @param {number} [options.timeoutMs=6000] - Request timeout.
 * @param {string|null} [options.excludeFact=null] - Fact to avoid repeating if possible.
 * @returns {Promise<{ fact: string, source: string, isLive: boolean }>} - Resulting fact, source attribution, and live status.
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
      // console.warn("[CatFacts] Live fetch from APIs failed, using curated fact fallback:", err.message);
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
