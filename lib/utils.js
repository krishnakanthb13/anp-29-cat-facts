/**
 * @file utils.js
 * @description Utility functions for HTML sanitization, string manipulation, and markdown formatting.
 */

/**
 * Escapes unsafe HTML characters to prevent XSS.
 * @param {string} str - Raw input string.
 * @returns {string} - Escaped HTML string.
 */
export function escapeHtml(str) {
  if (typeof str !== "string") {
    return str == null ? "" : String(str);
  }
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
 * @param {string} [options.source="catfact.ninja"] - Source attribution name.
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
    source = "catfact.ninja",
    isLive = true,
    dotPosition = "start",
    showDot = true
  } = options;

  const cleanFact = (fact || "").trim();
  const dot = showDot ? (isLive ? "🟢" : "💾") : "";
  const catLabel = badge || (category ? `🐾 ${category}` : "🐾 Cat Fact");

  switch (style) {
    case "plain": {
      if (!dot) return cleanFact;
      return dotPosition === "end" ? `${cleanFact} ${dot}` : `${dot} ${cleanFact}`;
    }

    case "quote": {
      const header = dot
        ? (dotPosition === "end" ? `**${catLabel}** ${dot}` : `${dot} **${catLabel}**`)
        : `**${catLabel}**`;
      return `> ${header}\n> ${cleanFact}\n`;
    }

    case "card_with_image": {
      const imgLine = imageUrl ? `![${catLabel}](${imageUrl})\n\n` : "";
      const header = dot
        ? (dotPosition === "end" ? `**${catLabel}** ${dot}` : `${dot} **${catLabel}**`)
        : `**${catLabel}**`;
      return `${imgLine}> ${header}\n> ${cleanFact}\n`;
    }

    case "callout": {
      const header = dot
        ? (dotPosition === "end" ? `💡 **${catLabel}**: ${cleanFact} ${dot}` : `💡 ${dot} **${catLabel}**: ${cleanFact}`)
        : `💡 **${catLabel}**: ${cleanFact}`;
      return `> ${header}\n`;
    }

    default:
      return dot ? (dotPosition === "end" ? `${cleanFact} ${dot}` : `${dot} ${cleanFact}`) : cleanFact;
  }
}

