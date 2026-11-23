import { jest } from "@jest/globals";
import plugin from "../cat-facts.js";

describe("cat-facts.js Plugin Entry Point", () => {
  let mockApp;
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ fact: "Cats purr at a healing frequency.", length: 34 })
    });
    mockApp = {
      context: {
        noteUUID: "test-note-uuid",
        replaceSelection: jest.fn().mockResolvedValue(true)
      },
      insertContent: jest.fn().mockResolvedValue(true),
      insertNoteContent: jest.fn().mockResolvedValue(true),
      openSidebarEmbed: jest.fn().mockResolvedValue(true),
      openEmbed: jest.fn().mockResolvedValue(true),
      alert: jest.fn().mockResolvedValue(true)
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("Plugin Exports Structure", () => {
    test("exports required Amplenote action handlers", () => {
      expect(plugin).toBeDefined();
      expect(typeof plugin.insertText).toBe("object");
      expect(typeof plugin.appOption).toBe("object");
      expect(typeof plugin.renderEmbed).toBe("function");
      expect(typeof plugin.onEmbedCall).toBe("function");
    });

    test("registers named insertText options", () => {
      expect(typeof plugin.insertText["Random"]).toBe("function");
      expect(typeof plugin.insertText["Quote Card"]).toBe("function");
      expect(typeof plugin.insertText["Photo Card"]).toBe("function");
    });

    test("registers named appOption handler", () => {
      expect(typeof plugin.appOption["Open Peek Viewer"]).toBe("function");
    });
  });

  describe("insertText Execution", () => {
    test("Random fact replaces selection when available", async () => {
      const result = await plugin.insertText["Random"](mockApp);
      expect(mockApp.context.replaceSelection).toHaveBeenCalled();
      const inserted = mockApp.context.replaceSelection.mock.calls[0][0];
      expect(inserted.startsWith("🟢 ") || inserted.startsWith("💾 ")).toBe(true);
      expect(result).toBe("");
    });

    test("Quote Card replaces selection with markdown quote block and returns empty string to prevent escaping", async () => {
      const result = await plugin.insertText["Quote Card"](mockApp);
      expect(mockApp.context.replaceSelection).toHaveBeenCalled();
      const inserted = mockApp.context.replaceSelection.mock.calls[0][0];
      expect(inserted).toContain("> ");
      expect(inserted.includes("🟢") || inserted.includes("💾")).toBe(true);
      expect(result).toBe("");
    });

    test("Photo Card replaces selection with markdown photo and quote and returns empty string", async () => {
      const result = await plugin.insertText["Photo Card"](mockApp);
      expect(mockApp.context.replaceSelection).toHaveBeenCalled();
      const inserted = mockApp.context.replaceSelection.mock.calls[0][0];
      expect(inserted).toContain("![");
      expect(inserted.includes("https://images.unsplash.com/") || inserted.includes("https://cdn2.thecatapi.com/")).toBe(true);
      expect(inserted).toContain("> ");
      expect(result).toBe("");
    });

    test("treats a non-throwing replaceSelection as success even when it resolves undefined", async () => {
      mockApp.context.replaceSelection = jest.fn().mockResolvedValue(undefined);
      const result = await plugin.insertText["Random"](mockApp);
      expect(mockApp.context.replaceSelection).toHaveBeenCalled();
      expect(result).toBe("");
    });

    test("insertText options fall back to returning markdown string when replaceSelection is unavailable", async () => {
      const plainResult = await plugin.insertText["Random"](null);
      expect(typeof plainResult).toBe("string");
      expect(plainResult.length).toBeGreaterThan(10);

      const quoteResult = await plugin.insertText["Quote Card"](null);
      expect(typeof quoteResult).toBe("string");
      expect(quoteResult).toContain("> ");

      const photoResult = await plugin.insertText["Photo Card"](null);
      expect(typeof photoResult).toBe("string");
      expect(photoResult).toContain("![");
    });
  });

  describe("appOption Execution", () => {
    test("calls app.openSidebarEmbed with correct options", async () => {
      await plugin.appOption["Open Peek Viewer"](mockApp);
      expect(mockApp.openSidebarEmbed).toHaveBeenCalledWith(
        { id: "cat-facts-peek", aspectRatio: 1.1 },
        {}
      );
    });

    test("falls back to openEmbed when openSidebarEmbed returns false (mobile)", async () => {
      mockApp.openSidebarEmbed.mockResolvedValue(false);
      await plugin.appOption["Open Peek Viewer"](mockApp);
      expect(mockApp.openEmbed).toHaveBeenCalledWith(1.1, {});
    });

    test("falls back to app.alert when embed methods are unavailable", async () => {
      const minimalApp = {
        alert: jest.fn().mockResolvedValue(true)
      };
      await plugin.appOption["Open Peek Viewer"](minimalApp);
      expect(minimalApp.alert).toHaveBeenCalled();
    });

    test("handles null or missing app without throwing", async () => {
      await expect(plugin.appOption["Open Peek Viewer"](null)).resolves.toBeUndefined();
    });
  });

  describe("renderEmbed Execution", () => {
    test("renders self-contained HTML Peek Viewer document", async () => {
      const html = await plugin.renderEmbed(mockApp, {});
      expect(typeof html).toBe("string");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("Purrfect Cat Facts");
      expect(html).toContain("catfact.ninja");
      expect(html).toContain("btnNext");
      expect(html).toContain("btnCopy");
      expect(html).toContain("catImg");
      expect(html).toContain("factBody");
    });
  });

  describe("onEmbedCall Execution", () => {
    test("handles notify action", async () => {
      const res = await plugin.onEmbedCall(mockApp, "notify", {
        message: "Hello cat lover!",
        preface: "Meow"
      });
      expect(res.success).toBe(true);
      expect(mockApp.alert).toHaveBeenCalledWith("Hello cat lover!", { preface: "Meow" });
    });

    test("returns error for unknown action", async () => {
      const res = await plugin.onEmbedCall(mockApp, "unknownAction", {});
      expect(res.success).toBe(false);
      expect(res.error).toContain("Unknown action");
    });

    test("handles null or undefined payload safely without throwing", async () => {
      const resNotify = await plugin.onEmbedCall(mockApp, "notify", null);
      expect(resNotify.success).toBe(true);
    });
  });
});

