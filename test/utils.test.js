import { escapeHtml, sampleRandom, formatFactMarkdown } from "../lib/utils.js";

describe("utils.js", () => {
  describe("escapeHtml", () => {
    test("escapes HTML special characters", () => {
      const raw = `<script>alert("hello & 'world'")</script>`;
      const escaped = escapeHtml(raw);
      expect(escaped).toBe("&lt;script&gt;alert(&quot;hello &amp; &#039;world&#039;&quot;)&lt;/script&gt;");
    });

    test("handles non-string or nullish inputs safely", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
      expect(escapeHtml(123)).toBe("123");
    });
  });

  describe("sampleRandom", () => {
    test("returns null for empty array", () => {
      expect(sampleRandom([])).toBeNull();
      expect(sampleRandom(null)).toBeNull();
    });

    test("returns the single element for 1-element array", () => {
      expect(sampleRandom(["cat"])).toBe("cat");
    });

    test("avoids excluded item if multiple items available", () => {
      const items = ["a", "b"];
      for (let i = 0; i < 20; i++) {
        expect(sampleRandom(items, "a")).toBe("b");
      }
    });
  });

  describe("formatFactMarkdown", () => {
    const fact = "Cats sleep for roughly 70% of their lives.";

    test("formats plain fact with live green dot at start by default", () => {
      const formatted = formatFactMarkdown(fact, { style: "plain", isLive: true });
      expect(formatted).toBe(`🟢 ${fact}`);
      expect(formatted).not.toContain("catfact.ninja");
    });

    test("formats plain fact with green dot at end when dotPosition is end", () => {
      const formatted = formatFactMarkdown(fact, { style: "plain", isLive: true, dotPosition: "end" });
      expect(formatted).toBe(`${fact} 🟢`);
    });

    test("formats plain fact with offline indicator when not live", () => {
      const formatted = formatFactMarkdown(fact, { style: "plain", isLive: false });
      expect(formatted).toBe(`💾 ${fact}`);
    });

    test("formats plain fact without dot when showDot is false", () => {
      const formatted = formatFactMarkdown(fact, { style: "plain", showDot: false });
      expect(formatted).toBe(fact);
    });

    test("formats quote style with green dot and no markdown url link", () => {
      const formatted = formatFactMarkdown(fact, { style: "quote", category: "Sleep & Rest", isLive: true });
      expect(formatted).toContain("> 🟢 **🐾 Sleep & Rest**");
      expect(formatted).toContain(fact);
      expect(formatted).not.toContain("catfact.ninja");
    });

    test("formats card_with_image style with green dot and no markdown url link", () => {
      const formatted = formatFactMarkdown(fact, {
        style: "card_with_image",
        imageUrl: "https://example.com/cat.jpg",
        category: "Sleep & Rest",
        isLive: true
      });
      expect(formatted).toContain("![🐾 Sleep & Rest](https://example.com/cat.jpg)");
      expect(formatted).toContain("> 🟢 **🐾 Sleep & Rest**");
      expect(formatted).toContain(fact);
      expect(formatted).not.toContain("catfact.ninja");
    });

    test("formats callout style", () => {
      const formatted = formatFactMarkdown(fact, { style: "callout", isLive: true });
      expect(formatted).toContain("> 💡 🟢 **🐾 Cat Fact**:");
      expect(formatted).toContain(fact);
    });
  });
});
