import { jest } from "@jest/globals";
import { renderCatFactsEmbed } from "../lib/embed.js";
import { SEED_FACTS } from "../lib/data/facts.js";
import { SEED_IMAGES } from "../lib/data/images.js";

describe("embed.js — Peek Viewer HTML Embed Generator", () => {
  const mockApp = {
    alert: jest.fn(),
    prompt: jest.fn()
  };

  describe("renderCatFactsEmbed — Happy Path", () => {
    test("generates a complete valid HTML document", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(typeof html).toBe("string");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html lang=\"en\">");
      expect(html).toContain("<head>");
      expect(html).toContain("<body>");
      expect(html).toContain("</html>");
    });

    test("includes title and core branding", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(html).toContain("<title>Purrfect Cat Facts</title>");
      expect(html).toContain("Purrfect Cat Facts");
      expect(html).toContain("catfact.ninja");
    });

    test("renders the 3 distinct cards in order", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      const factCardIndex = html.indexOf("card-fact");
      const imageCardIndex = html.indexOf("card-image");
      const optionsCardIndex = html.indexOf("card-options");

      expect(factCardIndex).toBeGreaterThan(0);
      expect(imageCardIndex).toBeGreaterThan(factCardIndex);
      expect(optionsCardIndex).toBeGreaterThan(imageCardIndex);
    });

    test("contains all required interactive control elements", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(html).toContain("id=\"btnNext\"");
      expect(html).toContain("id=\"btnCopy\"");
      expect(html).toContain("id=\"toggleSmart\"");
      expect(html).toContain("id=\"toggleLive\"");
      expect(html).toContain("id=\"factBody\"");
      expect(html).toContain("id=\"catImg\"");
      expect(html).toContain("id=\"imgSkeleton\"");
      expect(html).toContain("id=\"toast\"");
    });

    test("includes the enlarged emoji typography classes", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(html).toContain(".emoji-icon");
      expect(html).toContain(".emoji-lg");
      expect(html).toContain("class=\"emoji-lg\">🐾</span>");
    });

    test("pre-serializes starter seed datasets into client script", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(html).toContain(SEED_FACTS[0]);
      expect(html).toContain(SEED_IMAGES[0].id);
      expect(html).toContain("CATEGORY_DEFS");
    });
  });

  describe("renderCatFactsEmbed — Edge Cases", () => {
    test("handles null app interface safely without crashing", () => {
      const html = renderCatFactsEmbed(null, {});
      expect(typeof html).toBe("string");
      expect(html).toContain("<!DOCTYPE html>");
    });

    test("handles missing or null options safely", () => {
      const html1 = renderCatFactsEmbed(mockApp);
      expect(typeof html1).toBe("string");
      expect(html1).toContain("<!DOCTYPE html>");

      const html2 = renderCatFactsEmbed(mockApp, null);
      expect(typeof html2).toBe("string");
      expect(html2).toContain("<!DOCTYPE html>");
    });

    test("handles unexpected arguments safely", () => {
      const html = renderCatFactsEmbed(mockApp, "unexpected_string", 12345);
      expect(typeof html).toBe("string");
      expect(html).toContain("<!DOCTYPE html>");
    });
  });

  describe("renderCatFactsEmbed — Error Handling & Fallback", () => {
    test("embed HTML enforces referrer isolation for images", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(html).toContain("referrerpolicy=\"no-referrer\"");
    });

    test("embed HTML enforces rel=noopener on external links", () => {
      const html = renderCatFactsEmbed(mockApp, {});
      expect(html).toContain("rel=\"noopener\"");
    });
  });
});
