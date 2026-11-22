import { jest } from "@jest/globals";
import {
  SEED_IMAGES,
  loadImages,
  getAllImages,
  getImagesByCategory,
  getRandomCatImage,
  getRandomImageForCategory,
  setInMemoryImages
} from "../lib/data/images.js";
import rawImages from "../lib/data/images.json" with { type: "json" };

describe("images.js dataset & debloating loader", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => rawImages
    });
  });

  test("SEED_IMAGES covers all 11 core categories for instant offline start", () => {
    expect(SEED_IMAGES.length).toBe(11);
    const seedCategories = new Set(SEED_IMAGES.map(img => img.category));
    expect(seedCategories.size).toBe(11);
  });

  test("debloated images.json contains 50+ (70) verified cat images", () => {
    expect(rawImages.length).toBeGreaterThanOrEqual(50);
  });

  test("all images have valid CDN URLs and unique IDs", () => {
    const ids = new Set();
    rawImages.forEach(img => {
      expect(typeof img.id).toBe("string");
      expect(img.id.startsWith("photo-") || img.id.startsWith("catapi-")).toBe(true);
      expect(ids.has(img.id)).toBe(false);
      ids.add(img.id);

      expect(typeof img.url).toBe("string");
      expect(img.url.startsWith("https://images.unsplash.com/") || img.url.startsWith("https://cdn2.thecatapi.com/")).toBe(true);

      expect(typeof img.category).toBe("string");
      expect(img.category.length).toBeGreaterThan(2);

      expect(typeof img.alt).toBe("string");
      expect(img.alt.length).toBeGreaterThan(5);

      expect(Array.isArray(img.tags)).toBe(true);
      expect(img.tags.length).toBeGreaterThan(0);
    });
  });

  test("loadImages hydrates full 70-image catalog via fetch/localStorage", async () => {
    const loaded = await loadImages();
    expect(loaded.length).toBe(rawImages.length);
  });

  test("covers all core feline theme categories in full dataset", () => {
    setInMemoryImages(rawImages);
    const categories = [
      "sleep",
      "eyes",
      "whiskers_senses",
      "kittens",
      "play_agility",
      "purr_vocal",
      "grooming",
      "hunting_wild",
      "black_cat",
      "history_regal",
      "anatomy"
    ];

    categories.forEach(cat => {
      const filtered = getImagesByCategory(cat);
      expect(filtered.length).toBeGreaterThanOrEqual(4);
      filtered.forEach(img => {
        expect(img.category).toBe(cat);
      });
    });
  });

  test("getRandomCatImage returns a valid CatImage and avoids previous URL", () => {
    setInMemoryImages(rawImages);
    const first = rawImages[0];
    const second = getRandomCatImage(first.url);
    expect(second.url).not.toBe(first.url);
  });

  test("getRandomImageForCategory selects from requested category", () => {
    setInMemoryImages(rawImages);
    const sleepImg = getRandomImageForCategory("sleep");
    expect(sleepImg.category).toBe("sleep");

    const eyeImg = getRandomImageForCategory("eyes");
    expect(eyeImg.category).toBe("eyes");
  });
});
