/**
 * @file utils.js
 * @description Utility functions for HTML sanitization, string manipulation, and markdown formatting.
 */

/**
 * Character map for HTML character entity escaping.
 */
const HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
};

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * Uses a single-pass regex replacement for optimal performance.
 *
 * @param {string} str - Raw input string.
 * @returns {string} - Escaped HTML string.
 */
export function escapeHtml(str) {
  if (str == null) {
    return "";
  }
  return String(str).replace(/[&<>"']/g, match => HTML_ESCAPE_MAP[match]);
}

/**
 * Performs a GET request with an abort timeout and JSON parsing.
 * Shared by the API client and the dataset hydration loaders so no request can hang forever.
 *
 * @param {string} url - Target URL to request.
 * @param {number} [timeoutMs=6000] - Timeout duration in milliseconds.
 * @returns {Promise<any>} - Parsed JSON response object.
 */
export async function fetchJsonWithTimeout(url, timeoutMs = 6000) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const signal = controller ? controller.signal : undefined;
  let timeoutId = null;

  if (controller && timeoutMs > 0) {
    timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" },
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
 * Attaches a status dot indicator before or after a text string.
 *
 * @param {string} text - Target text.
 * @param {string} dot - Indicator emoji or symbol (e.g. 🟢, 💾).
 * @param {"start"|"end"} [dotPosition="start"] - Position of the indicator.
 * @returns {string} - Text with indicator dot attached.
 */
function attachDot(text, dot, dotPosition = "start") {
  if (!dot) return text;
  return dotPosition === "end" ? `${text} ${dot}` : `${dot} ${text}`;
}

/**
 * Selects a random element from an array, optionally avoiding an excluded item.
 * @template T
 * @param {T[]} array - The source array.
 * @param {T|null} [excludeItem=null] - Item to avoid if possible.
 * @returns {T|null} - A randomly chosen item or null if array is empty.
 */
export function sampleRandom(array, excludeItem = null) {
  if (!Array.isArray(array) || array.length === 0) return null;
  if (array.length === 1) return array[0];

  if (excludeItem != null) {
    const candidates = array.filter(item => item !== excludeItem);
    if (candidates.length > 0) {
      const idx = Math.floor(Math.random() * candidates.length);
      return candidates[idx];
    }
  }

  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

/**
 * Formats a cat fact into markdown based on the requested style.
 * Uses a clean indicator dot (🟢 for Live API, 💾 for Curated Collection) instead of cluttered markdown URLs.
 *
 * @param {string} fact - The cat fact text.
 * @param {object} [options={}] - Formatting options.
 * @param {"plain"|"quote"|"card_with_image"|"callout"} [options.style="plain"] - The formatting style.
 * @param {string|null} [options.imageUrl=null] - Optional image URL to embed.
 * @param {string|null} [options.category=null] - Optional category label (e.g. "Sleep & Rest").
 * @param {string|null} [options.badge=null] - Optional category badge with emoji (e.g. "💤 Sleep & Rest").
 * @param {boolean} [options.isLive=true] - Whether the fact was retrieved from the live API.
 * @param {"start"|"end"} [options.dotPosition="start"] - Where to place the indicator dot ("start" or "end").
 * @param {boolean} [options.showDot=true] - Whether to include the status indicator dot.
 * @returns {string} - Formatted markdown text.
 */
export function formatFactMarkdown(fact, options = {}) {
  const {
    style = "plain",
    imageUrl = null,
    category = null,
    badge = null,
    isLive = true,
    dotPosition = "start",
    showDot = true
  } = options;

  const cleanFact = (fact || "").trim();
  const dot = showDot ? (isLive ? "🟢" : "💾") : "";
  const catLabel = badge || (category ? `🐾 ${category}` : "🐾 Cat Fact");

  switch (style) {
    case "plain":
      return attachDot(cleanFact, dot, dotPosition);

    case "quote": {
      const header = attachDot(`**${catLabel}**`, dot, dotPosition);
      return `> ${header}\n> ${cleanFact}\n`;
    }

    case "card_with_image": {
      const imgLine = imageUrl ? `![${catLabel}](${imageUrl})\n\n` : "";
      const header = attachDot(`**${catLabel}**`, dot, dotPosition);
      return `${imgLine}> ${header}\n> ${cleanFact}\n`;
    }

    case "callout": {
      const header = dot
        ? (dotPosition === "end" ? `💡 **${catLabel}**: ${cleanFact} ${dot}` : `💡 ${dot} **${catLabel}**: ${cleanFact}`)
        : `💡 **${catLabel}**: ${cleanFact}`;
      return `> ${header}\n`;
    }

    default:
      return attachDot(cleanFact, dot, dotPosition);
  }
}

