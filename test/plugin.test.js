import { jest } from "@jest/globals";
import plugin from "../cat-facts.js";

describe("cat-facts.js Plugin Entry Point", () => {
  let mockApp;

  beforeEach(() => {
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

  describe("Plugin Exports Structure", () => {
    test("exports required Amplenote action handlers", () => {
      expect(plugin).toBeDefined();
      expect(typeof plugin.insertText).toBe("function");
      expect(typeof plugin.appOption).toBe("function");
      expect(typeof plugin.renderEmbed).toBe("function");
      expect(typeof plugin.onEmbedCall).toBe("function");
    });

    test("registers named insertText options", () => {
      expect(typeof plugin.insertText["Random Cat Fact"]).toBe("function");
      expect(typeof plugin.insertText["Cat Fact Quote Card"]).toBe("function");
      expect(typeof plugin.insertText["Cat Fact with Photo"]).toBe("function");
    });

    test("registers named appOption handler", () => {
      expect(typeof plugin.appOption["Open Cat Facts"]).toBe("function");
    });
  });

  describe("insertText Execution", () => {
    test("Random Cat Fact returns plain fact string with green dot", async () => {
      const result = await plugin.insertText["Random Cat Fact"](mockApp);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(10);
      expect(result.startsWith("🟢 ") || result.startsWith("💾 ")).toBe(true);
      expect(result).not.toContain("catfact.ninja");
    });

    test("Cat Fact Quote Card returns markdown quote block with green dot and no url link", async () => {
      const result = await plugin.insertText["Cat Fact Quote Card"](mockApp);
      expect(result).toContain("> ");
      expect(result.includes("🟢") || result.includes("💾")).toBe(true);
      expect(result).not.toContain("catfact.ninja");
    });

    test("Cat Fact with Photo returns markdown image and quote with green dot", async () => {
      const result = await plugin.insertText["Cat Fact with Photo"](mockApp);
      expect(result).toContain("![");
      expect(result.includes("https://images.unsplash.com/") || result.includes("https://cdn2.thecatapi.com/")).toBe(true);
      expect(result).toContain("> ");
      expect(result.includes("🟢") || result.includes("💾")).toBe(true);
      expect(result).not.toContain("catfact.ninja");
    });

    test("default insertText handler returns a fact string with green dot", async () => {
      const result = await plugin.insertText(mockApp);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(10);
      expect(result.startsWith("🟢 ") || result.startsWith("💾 ")).toBe(true);
    });
  });

  describe("appOption Execution", () => {
    test("calls app.openSidebarEmbed with correct options", async () => {
      await plugin.appOption(mockApp);
      expect(mockApp.openSidebarEmbed).toHaveBeenCalledWith(
        { id: "cat-facts-peek", aspectRatio: 1.1 },
        {}
      );
    });

    test("falls back to openEmbed when openSidebarEmbed returns false (mobile)", async () => {
      mockApp.openSidebarEmbed.mockResolvedValue(false);
      await plugin.appOption(mockApp);
      expect(mockApp.openEmbed).toHaveBeenCalledWith(1.1, {});
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
    test("handles insertIntoNote using replaceSelection", async () => {
      const res = await plugin.onEmbedCall(mockApp, "insertIntoNote", {
        fact: "Cats have a flexible spine with 53 vertebrae.",
        imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700",
        category: "Anatomy & Biology",
        style: "card_with_image"
      });

      expect(res.success).toBe(true);
      expect(res.method).toBe("replaceSelection");
      expect(mockApp.context.replaceSelection).toHaveBeenCalled();
    });

    test("falls back to insertContent when replaceSelection fails", async () => {
      mockApp.context.replaceSelection.mockResolvedValue(false);
      const res = await plugin.onEmbedCall(mockApp, "insertIntoNote", {
        fact: "Cats sleep 70% of their life.",
        style: "plain"
      });

      expect(res.success).toBe(true);
      expect(res.method).toBe("insertContent");
      expect(mockApp.insertContent).toHaveBeenCalled();
    });

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

      const resInsert = await plugin.onEmbedCall(mockApp, "insertIntoNote", null);
      expect(resInsert.success).toBe(true);
    });
  });
});

