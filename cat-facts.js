/**
 * @file cat-facts.js
 * @description Amplenote Plugin: Purrfect Cat Facts (anp-29-cat-facts)
 * Provides text insertion of cat facts (plain text, formatted quote, or photo card),
 * Peek Viewer interactive exploration with 65+ cat photos, contextual matching of images
 * to fact themes, and live integration with https://catfact.ninja/.
 *
 * @author Krishna Kanth B
 */

import { getCatFact } from "./lib/api.js";
import { selectImageForFact } from "./lib/classifier.js";
import { renderCatFactsEmbed } from "./lib/embed.js";
import { formatFactMarkdown, escapeHtml } from "./lib/utils.js";

/**
 * Core handler to launch the Peek Viewer sidebar embed.
 * @param {object} app - Amplenote API object.
 * @returns {Promise<void>} - Resolves once the sidebar embed or fallback alert is invoked.
 */
async function launchCatFactsPeek(app) {
  if (!app) return;
  try {
    if (typeof app.openSidebarEmbed === "function") {
      let opened;
      try {
        opened = await app.openSidebarEmbed(
          { id: "cat-facts-peek", aspectRatio: 1.1 },
          {}
        );
      } catch (sidebarErr) {
        console.warn("[CatFacts] openSidebarEmbed with options failed, attempting numeric fallback:", sidebarErr);
        opened = await app.openSidebarEmbed(1.1, {});
      }

      // openSidebarEmbed returns false on mobile or when peek viewer is unavailable
      if (opened === false && typeof app.openEmbed === "function") {
        await app.openEmbed(1.1, {});
      }
    } else if (typeof app.openEmbed === "function") {
      await app.openEmbed(1.1, {});
    } else if (typeof app.alert === "function") {
      const { fact } = await getCatFact({ preferOnline: true });
      await app.alert(fact, { preface: "Cat Fact" });
    }
  } catch (err) {
    console.error("[CatFacts] Failed to open embed:", err);
    if (typeof app.alert === "function") {
      await app.alert(`Error launching Cat Facts: ${err.message || err}`);
    }
  }
}

/**
 * Inserts markdown content via app.context.replaceSelection if available,
 * returning null to prevent Amplenote from escaping markdown syntax with backslashes.
 * Falls back to returning the raw markdown string if replaceSelection is unavailable.
 *
 * @param {object} [app] - Amplenote API object.
 * @param {string} markdown - Markdown string to insert.
 * @returns {Promise<string|null>} null if replaced via replaceSelection, or the markdown string fallback.
 */
async function insertMarkdownOrFallback(app, markdown) {
  if (app?.context && typeof app.context.replaceSelection === "function") {
    try {
      const replaced = await app.context.replaceSelection(markdown);
      if (replaced) {
        return null;
      }
    } catch (err) {
      console.warn("[CatFacts] replaceSelection failed, falling back to direct return:", err);
    }
  }
  return markdown;
}

/**
 * Handles text insertion for random cat facts.
 * @param {object} [app] - Amplenote API object.
 * @returns {Promise<string|null>} Formatted markdown fact or null if replaced.
 */
async function insertPlainFact(app) {
  try {
    const { fact, source, isLive } = await getCatFact({ preferOnline: true });
    const markdown = formatFactMarkdown(fact, {
      style: "plain",
      isLive,
      source
    });
    return await insertMarkdownOrFallback(app, markdown);
  } catch (err) {
    console.error("[CatFacts] insertPlainFact error:", err);
    return "🟢 Cats sleep for roughly 70% of their lives.";
  }
}

/**
 * Handles text insertion for a formatted quote card.
 * @param {object} [app] - Amplenote API object.
 * @returns {Promise<string|null>} Formatted markdown quote card or null if replaced.
 */
async function insertQuoteFact(app) {
  try {
    const { fact, source, isLive } = await getCatFact({ preferOnline: true });
    const { classification } = selectImageForFact(fact);
    const markdown = formatFactMarkdown(fact, {
      style: "quote",
      category: classification.label,
      badge: classification.badge,
      isLive,
      source
    });
    return await insertMarkdownOrFallback(app, markdown);
  } catch (err) {
    console.error("[CatFacts] insertQuoteFact error:", err);
    return "> 🟢 **🐾 Cat Fact**\n> Cats make over 100 different vocal sounds.\n";
  }
}

/**
 * Handles text insertion for a fact with a matched contextual photo.
 * @param {object} [app] - Amplenote API object.
 * @returns {Promise<string|null>} Formatted markdown photo card or null if replaced.
 */
async function insertPhotoFact(app) {
  try {
    const { fact, source, isLive } = await getCatFact({ preferOnline: true });
    const { image, classification } = selectImageForFact(fact);
    const markdown = formatFactMarkdown(fact, {
      style: "card_with_image",
      imageUrl: image.url,
      category: classification.label,
      badge: classification.badge,
      isLive,
      source
    });
    return await insertMarkdownOrFallback(app, markdown);
  } catch (err) {
    console.error("[CatFacts] insertPhotoFact error:", err);
    return "> 🟢 **🐾 Cat Fact**\n> A cat can jump up to six times its height.\n";
  }
}

/**
 * The Amplenote plugin object.
 */
const plugin = {
  /**
   * Insert text options invoked via the { menu or text replacement.
   */
  insertText: {
    "Random": insertPlainFact,
    "Quote Card": insertQuoteFact,
    "Photo Card": insertPhotoFact
  },

  /**
   * Global command options available via Quick Search / Jump-to-Note.
   */
  appOption: {
    "Open Peek Viewer": launchCatFactsPeek
  },

  /**
   * Renders the interactive Peek Viewer embed iframe.
   * @param {object} app - Amplenote app interface.
   * @param {...any} args - Embed invocation parameters.
   * @returns {Promise<string>} The generated HTML document.
   */
  async renderEmbed(app, ...args) {
    try {
      const options = (args[0] && typeof args[0] === "object") ? args[0] : {};
      return renderCatFactsEmbed(app, options);
    } catch (err) {
      console.error("[CatFacts] renderEmbed error:", err);
      const safeErr = escapeHtml(err?.message || String(err));
      return `<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 16px;">
  <h3>Purrfect Cat Facts</h3>
  <p>Could not render dashboard: ${safeErr}</p>
</body>
</html>`;
    }
  },

  /**
   * Handles action calls from the Peek Viewer embed iframe.
   * @param {object} app - Amplenote API object.
   * @param {string} actionName - The invoked action identifier.
   * @param {object} [payload={}] - Additional action payload.
   * @returns {Promise<object>} - Action execution result containing success status and metadata.
   */
  async onEmbedCall(app, actionName, payload = {}) {
    const data = payload ?? {};
    switch (actionName) {
      case "insertIntoNote": {
        const { fact, imageUrl, category, badge, isLive = true, style = "card_with_image" } = data;
        const markdown = formatFactMarkdown(fact, {
          style,
          imageUrl,
          category,
          badge,
          isLive
        });

        // 1. Try cursor / selection replacement
        if (app?.context && typeof app.context.replaceSelection === "function") {
          try {
            const success = await app.context.replaceSelection(markdown);
            if (success) {
              return { success: true, method: "replaceSelection" };
            }
          } catch (e) {
            console.warn("[CatFacts] replaceSelection failed, trying note insertion:", e);
          }
        }

        // 2. Try app.insertContent
        if (typeof app?.insertContent === "function") {
          try {
            await app.insertContent(markdown);
            return { success: true, method: "insertContent" };
          } catch (e) {
            console.warn("[CatFacts] insertContent failed:", e);
          }
        }

        // 3. Try app.insertNoteContent on active note
        const noteUUID = app?.context?.noteUUID;
        if (noteUUID && typeof app?.insertNoteContent === "function") {
          try {
            await app.insertNoteContent({ uuid: noteUUID }, markdown);
            return { success: true, method: "insertNoteContent" };
          } catch (e) {
            console.warn("[CatFacts] insertNoteContent failed:", e);
          }
        }

        return {
          success: false,
          error: "Please open or focus a note to insert this fact."
        };
      }

      case "notify": {
        if (typeof app?.alert === "function") {
          await app.alert(data.message || "", { preface: data.preface || "Cat Facts" });
        }
        return { success: true };
      }

      default:
        return { success: false, error: `Unknown action: ${actionName}` };
    }
  }
};

export default plugin;
