/**
 * @file images.js
 * @description Manages curated feline images with dynamic dataset debloating.
 * Uses a lightweight inlined seed of 11 verified cat photos (1 per theme) for instant zero-latency offline start,
 * and dynamically loads the full 70-image catalog from GitHub/CDN with localStorage caching.
 * @see {@link ../../common-issues-and-fixes/dataset-debloating.md}
 */

/* global localStorage */

import { sampleRandom } from "../utils.js";

/**
 * Standard query parameters for optimized, responsive, fast-loading Unsplash images.
 */
const IMG_QUERY = "?w=700&auto=format&fit=crop&q=80";

/**
 * @typedef {Object} CatImage
 * @property {string} id - Unique photo identifier.
 * @property {string} url - Direct HTTPS CDN URL to the image.
 * @property {string} category - Primary theme category for contextual matching.
 * @property {string} alt - Human-readable accessibility description.
 * @property {string[]} tags - Additional matching tags.
 */

/**
 * Lightweight seed of 11 verified cat photos (one per theme category)
 * for instant, zero-latency first paint without requiring an upfront network download.
 * @type {CatImage[]}
 */
export const SEED_IMAGES = [
  {
    id: "photo-1541781774459-bb2af2f05b55",
    url: `https://images.unsplash.com/photo-1541781774459-bb2af2f05b55${IMG_QUERY}`,
    category: "sleep",
    alt: "Cozy sleeping white and ginger cat curled up under duvet",
    tags: ["sleep", "nap", "curled", "bed", "peaceful", "dreaming"]
  },
  {
    id: "photo-1514888286974-6c03e2ca1dba",
    url: `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba${IMG_QUERY}`,
    category: "eyes",
    alt: "Dramatic close-up of a cat with luminous green-yellow eyes",
    tags: ["eyes", "vision", "stare", "pupils", "green eyes", "night vision"]
  },
  {
    id: "photo-1519052537078-e6302a4968d4",
    url: `https://images.unsplash.com/photo-1519052537078-e6302a4968d4${IMG_QUERY}`,
    category: "whiskers_senses",
    alt: "Ginger cat showing prominent white whiskers extending outward",
    tags: ["whiskers", "vibrissae", "muzzle", "touch", "sensory", "navigation"]
  },
  {
    id: "photo-1595433707802-6b2626ef1c91",
    url: `https://images.unsplash.com/photo-1595433707802-6b2626ef1c91${IMG_QUERY}`,
    category: "kittens",
    alt: "Sweet innocent kitten sitting on floor exploring its surroundings",
    tags: ["kitten", "growth", "young", "baby", "innocent", "playful"]
  },
  {
    id: "photo-1518288774672-b94e808873ff",
    url: `https://images.unsplash.com/photo-1518288774672-b94e808873ff${IMG_QUERY}`,
    category: "play_agility",
    alt: "Agile white cat gracefully balancing on sofa backrest",
    tags: ["agility", "balance", "jump", "speed", "athletic", "righting reflex"]
  },
  {
    id: "photo-1520315342629-6ea920342047",
    url: `https://images.unsplash.com/photo-1520315342629-6ea920342047${IMG_QUERY}`,
    category: "purr_vocal",
    alt: "White kitten looking up attentively ready to purr with joy",
    tags: ["purr", "vocal", "meow", "frequency", "healing", "vibrate", "content"]
  },
  {
    id: "photo-1570018144715-43110363d70a",
    url: `https://images.unsplash.com/photo-1570018144715-43110363d70a${IMG_QUERY}`,
    category: "grooming",
    alt: "Three well-groomed tabby kittens sitting together pristine and clean",
    tags: ["grooming", "tongue", "clean", "lick", "fur", "hygiene", "papillae"]
  },
  {
    id: "catapi-BjIppqbNI",
    url: "https://cdn2.thecatapi.com/images/BjIppqbNI.jpg",
    category: "hunting_wild",
    alt: "Bengal cat with wild leopard-spotted coat stalking through lush green grass",
    tags: ["wild", "hunting", "stalk", "bengal", "leopard", "predator"]
  },
  {
    id: "catapi-8of",
    url: "https://cdn2.thecatapi.com/images/8of.jpg",
    category: "black_cat",
    alt: "Glossy black cat resting in white porcelain sink",
    tags: ["black cat", "sink", "eyes", "dark", "sleek"]
  },
  {
    id: "photo-1492370284958-c20b15c692d2",
    url: `https://images.unsplash.com/photo-1492370284958-c20b15c692d2${IMG_QUERY}`,
    category: "history_regal",
    alt: "Noble British Shorthair cat sitting with regal composure near flowers",
    tags: ["history", "regal", "egypt", "worship", "royalty", "deity", "bastet"]
  },
  {
    id: "photo-1596854407944-bf87f6fdd49e",
    url: `https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e${IMG_QUERY}`,
    category: "anatomy",
    alt: "Orange cat standing tall showing complete body anatomy and balancing tail",
    tags: ["anatomy", "skeleton", "tail", "vertebrae", "bones", "flexible", "balance"]
  }
];

/**
 * Storage cache key for persistent localStorage caching.
 */
export const IMAGES_CACHE_KEY = "CatFacts_Images_Cache";

/**
 * Multi-endpoint fallback URLs for debloated images dataset.
 */
export const IMAGES_REMOTE_URLS = [
  "https://raw.githubusercontent.com/krishnakanthb13/anp-29-cat-facts/main/lib/data/images.json",
  "https://cdn.jsdelivr.net/gh/krishnakanthb13/anp-29-cat-facts@main/lib/data/images.json"
];

let inMemoryImages = null;

/**
 * Loads the complete curated cat images catalog following the Appendix IV debloating pattern:
 * 1. In-memory variable cache
 * 2. Persistent browser localStorage check
 * 3. Remote fetch from GitHub Raw / CDN endpoints
 * 4. Graceful fallback to SEED_IMAGES
 *
 * @param {object} [app=null] - Optional Amplenote app interface.
 * @returns {Promise<CatImage[]>} Complete images array.
 */
export async function loadImages(app = null) {
  if (inMemoryImages && inMemoryImages.length > SEED_IMAGES.length) {
    return inMemoryImages;
  }

  // 1. Check persistent browser localStorage
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(IMAGES_CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          inMemoryImages = parsed;
          return inMemoryImages;
        }
      }
    }
  } catch (e) {
    console.warn("[CatFacts] Failed to read images from localStorage:", e);
  }

  // 2. Fetch from remote GitHub Raw / CDN
  for (const url of IMAGES_REMOTE_URLS) {
    try {
      const res = await fetch(url);
      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          inMemoryImages = data;
          try {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem(IMAGES_CACHE_KEY, JSON.stringify(data));
            }
          } catch (saveErr) {
            console.warn("[CatFacts] Failed to persist images to localStorage:", saveErr);
          }
          return inMemoryImages;
        }
      }
    } catch {
      // Continue to next fallback URL
    }
  }

  // 3. Fallback to SEED_IMAGES
  inMemoryImages = inMemoryImages || [...SEED_IMAGES];
  return inMemoryImages;
}

/**
 * Synchronously sets the in-memory images (used in testing or hydration).
 * @param {CatImage[]} images
 */
export function setInMemoryImages(images) {
  if (Array.isArray(images) && images.length > 0) {
    inMemoryImages = images;
  }
}

/**
 * Returns all currently loaded cat images in the catalog.
 * @returns {CatImage[]}
 */
export function getAllImages() {
  return inMemoryImages || SEED_IMAGES;
}

/**
 * Filters images by primary theme category.
 * @param {string} category
 * @returns {CatImage[]}
 */
export function getImagesByCategory(category) {
  const images = getAllImages();
  if (!category) return images;
  const filtered = images.filter(img => img.category === category);
  return filtered.length > 0 ? filtered : images;
}

/**
 * Selects a random cat image from the entire catalog, avoiding a specific URL if possible.
 * @param {string|null} [excludeUrl=null]
 * @returns {CatImage}
 */
export function getRandomCatImage(excludeUrl = null) {
  const images = getAllImages();
  return sampleRandom(images, excludeUrl ? images.find(i => i.url === excludeUrl) : null) || images[0];
}

/**
 * Selects a random cat image belonging to a specified category.
 * @param {string} category
 * @param {string|null} [excludeUrl=null]
 * @returns {CatImage}
 */
export function getRandomImageForCategory(category, excludeUrl = null) {
  const pool = getImagesByCategory(category);
  const excludeItem = excludeUrl ? pool.find(i => i.url === excludeUrl) : null;
  return sampleRandom(pool, excludeItem) || pool[0] || (inMemoryImages || SEED_IMAGES)[0];
}

/**
 * Exported alias for backward compatibility.
 */
export const CAT_IMAGES = SEED_IMAGES;
