/**
 * @file facts.js
 * @description Manages curated feline facts with dynamic dataset debloating.
 * Uses a lightweight inlined seed for instant zero-latency offline start,
 * and dynamically loads the full 139+ fact repository from GitHub/CDN with localStorage caching.
 * @see {@link ../../common-issues-and-fixes/dataset-debloating.md}
 */

/* global localStorage */

import { sampleRandom } from "../utils.js";

/**
 * Lightweight seed facts for instant offline initial load (zero network request required).
 * Covers core feline domains: sleep, agility, vocals, whiskers, eyes, anatomy, purring, history, and genetics.
 * @type {string[]}
 */
export const SEED_FACTS = [
  "Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.",
  "A cat can jump up to six times its own height in a single bound thanks to powerful back leg muscles.",
  "Cats make about 100 different sounds, whereas dogs make only about 10 vocalizations.",
  "A cat’s whiskers are deeply embedded in nerve-rich tissue and act as a radar system to navigate in pitch dark.",
  "Cats have a specialized reflective layer behind their retinas called the tapetum lucidum, enhancing night vision sixfold.",
  "A cat rubs against people not only to be affectionate but also to mark out its territory with facial scent glands.",
  "The domestic cat's purr vibrates at a frequency between 25 and 150 Hertz, which scientists believe stimulates bone density and tissue repair.",
  "The oldest known pet cat was found in a 9,500-year-old grave on the Mediterranean island of Cyprus, predating Egyptian art by millennia.",
  "A cat's spine contains 53 flexible vertebrae, compared to just 33 in humans, giving them extraordinary elasticity.",
  "All calico and tortoiseshell cats are almost exclusively female due to the orange and black coat gene being carried on the X chromosome."
];

/**
 * Storage cache key for persistent localStorage caching.
 */
export const FACTS_CACHE_KEY = "CatFacts_Facts_Cache";

/**
 * Multi-endpoint fallback URLs for debloated facts dataset.
 */
export const FACTS_REMOTE_URLS = [
  "https://raw.githubusercontent.com/krishnakanthb13/anp-29-cat-facts/main/lib/data/facts.json",
  "https://cdn.jsdelivr.net/gh/krishnakanthb13/anp-29-cat-facts@main/lib/data/facts.json"
];

let inMemoryFacts = null;

/**
 * Loads the complete curated cat facts dataset following the Appendix IV debloating pattern:
 * 1. In-memory variable cache
 * 2. Persistent browser localStorage check
 * 3. Remote fetch from GitHub Raw / CDN endpoints
 * 4. Graceful fallback to SEED_FACTS
 *
 * @param {object} [app=null] - Optional Amplenote app interface.
 * @returns {Promise<string[]>} Complete facts array.
 */
export async function loadFacts(app = null) {
  if (inMemoryFacts && inMemoryFacts.length > SEED_FACTS.length) {
    return inMemoryFacts;
  }

  // 1. Check persistent browser localStorage
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(FACTS_CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryFacts = parsed;
          return inMemoryFacts;
        }
      }
    }
  } catch (e) {
    console.warn("[CatFacts] Failed to read facts from localStorage:", e);
  }

  // 2. Fetch from remote GitHub Raw / CDN
  for (const url of FACTS_REMOTE_URLS) {
    try {
      const res = await fetch(url);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          inMemoryFacts = data;
          try {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(FACTS_CACHE_KEY, JSON.stringify(data));
            }
          } catch (saveErr) {
            console.warn("[CatFacts] Failed to persist facts to localStorage:", saveErr);
          }
          return inMemoryFacts;
        }
      }
    } catch {
      // Continue to next fallback URL
    }
  }

  // 3. Fallback to SEED_FACTS
  inMemoryFacts = inMemoryFacts || [...SEED_FACTS];
  return inMemoryFacts;
}

/**
 * Synchronously sets the in-memory facts (used in testing or hydration).
 * @param {string[]} facts
 */
export function setInMemoryFacts(facts) {
  if (Array.isArray(facts) && facts.length > 0) {
    inMemoryFacts = facts;
  }
}

/**
 * Returns all currently loaded facts (or seed facts).
 * @returns {string[]}
 */
export function getAllFacts() {
  return inMemoryFacts || SEED_FACTS;
}

/**
 * Returns total count of available facts.
 * @returns {number}
 */
export function getFactCount() {
  return (inMemoryFacts || SEED_FACTS).length;
}

/**
 * Returns a specific fact by its index (0-based, wrap-around).
 * Safely handles non-integer, negative, or out-of-bound indices.
 *
 * @param {number} index - Index to retrieve.
 * @returns {string} The fact at the normalized index.
 */
export function getFactByIndex(index) {
  const list = getAllFacts();
  if (list.length === 0) return "Cats are wonderful companions!";
  const safeIndex = Number.isFinite(index) ? Math.floor(Math.abs(index)) : 0;
  const normalizedIndex = safeIndex % list.length;
  return list[normalizedIndex];
}

/**
 * Returns a random cat fact, avoiding the previous fact if possible.
 * @param {string|null} [excludeFact=null]
 * @returns {string}
 */
export function getRandomFact(excludeFact = null) {
  const list = getAllFacts();
  return sampleRandom(list, excludeFact) || list[0];
}

/**
 * Exported alias for backward compatibility.
 */
export const CAT_FACTS = SEED_FACTS;
