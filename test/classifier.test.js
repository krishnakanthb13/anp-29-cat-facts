import { classifyFact, selectImageForFact } from "../lib/classifier.js";
import { setInMemoryImages } from "../lib/data/images.js";
import rawImages from "../lib/data/images.json" with { type: "json" };

describe("classifier.js", () => {
  beforeAll(() => {
    setInMemoryImages(rawImages);
  });
  describe("classifyFact", () => {
    test("correctly classifies sleep facts", () => {
      const fact = "Cats spend roughly 70% of their lives sleeping, about 13-16 hours per day.";
      const res = classifyFact(fact);
      expect(res.category).toBe("sleep");
      expect(res.badge).toContain("Sleep & Rest");
      expect(res.matchedKeywords).toContain("sleeping");
    });

    test("correctly classifies vision & eye facts", () => {
      const fact = "Cats have a tapetum lucidum behind their retina for exceptional night vision.";
      const res = classifyFact(fact);
      expect(res.category).toBe("eyes");
      expect(res.badge).toContain("Vision & Senses");
    });

    test("correctly classifies whiskers & sensory facts", () => {
      const fact = "A cat's whiskers (vibrissae) detect tiny air currents and guide navigation in tight spaces.";
      const res = classifyFact(fact);
      expect(res.category).toBe("whiskers_senses");
      expect(res.badge).toContain("Whiskers & Ears");
    });

    test("correctly classifies kitten facts", () => {
      const fact = "Kittens are born with blue eyes, and a litter of baby cats is called a kindle.";
      const res = classifyFact(fact);
      expect(res.category).toBe("kittens");
      expect(res.badge).toContain("Kittens & Growth");
    });

    test("correctly classifies speed and jumping agility facts", () => {
      const fact = "A domestic cat can sprint up to 30 mph and jump up to six times its body height.";
      const res = classifyFact(fact);
      expect(res.category).toBe("play_agility");
      expect(res.badge).toContain("Speed & Agility");
    });

    test("correctly classifies purring and vocal facts", () => {
      const fact = "A cat's purr vibrates at a healing frequency between 20 and 140 Hz.";
      const res = classifyFact(fact);
      expect(res.category).toBe("purr_vocal");
      expect(res.badge).toContain("Purring & Vocal");
    });

    test("correctly classifies grooming facts", () => {
      const fact = "A cat's tongue has backward-facing spines called papillae for grooming fur.";
      const res = classifyFact(fact);
      expect(res.category).toBe("grooming");
      expect(res.badge).toContain("Grooming & Fur");
    });

    test("correctly classifies wild & hunting facts", () => {
      const fact = "When stalking prey like mice, wild cats crouch low and keep their head level.";
      const res = classifyFact(fact);
      expect(res.category).toBe("hunting_wild");
      expect(res.badge).toContain("Hunting & Wild");
    });

    test("correctly classifies black cat folklore facts", () => {
      const fact = "In British and Japanese folklore, a black cat is believed to bring good luck.";
      const res = classifyFact(fact);
      expect(res.category).toBe("black_cat");
      expect(res.badge).toContain("Black Cats");
    });

    test("correctly classifies ancient Egypt & history facts", () => {
      const fact = "In ancient Egypt, cats were sacred and worshiped as representatives of goddess Bastet.";
      const res = classifyFact(fact);
      expect(res.category).toBe("history_regal");
      expect(res.badge).toContain("Ancient History");
    });

    test("correctly classifies anatomy and bone facts", () => {
      const fact = "Cats have no collarbone (clavicle), allowing them to squeeze through tight spaces.";
      const res = classifyFact(fact);
      expect(res.category).toBe("anatomy");
      expect(res.badge).toContain("Anatomy & Biology");
    });

    test("falls back gracefully for unknown or ambiguous facts", () => {
      const fact = "Cats make wonderfully delightful companions for humans worldwide.";
      const res = classifyFact(fact);
      expect(res.category).toBe("general");
      expect(res.badge).toBe("🐱 Feline Wisdom");
    });

    test("handles empty or nullish inputs safely", () => {
      expect(classifyFact("").category).toBe("general");
      expect(classifyFact(null).category).toBe("general");
    });
  });

  describe("selectImageForFact", () => {
    test("selects contextual image matching fact theme", () => {
      const fact = "Cats sleep for around 14 hours a day.";
      const result = selectImageForFact(fact);
      expect(result.isContextual).toBe(true);
      expect(result.classification.category).toBe("sleep");
      expect(result.image.category).toBe("sleep");
    });

    test("bypasses contextual matching when forceRandom is true", () => {
      const fact = "Cats sleep for around 14 hours a day.";
      const result = selectImageForFact(fact, { forceRandom: true });
      expect(result.isContextual).toBe(false);
      expect(result.classification.category).toBe("random");
      expect(result.image).toBeDefined();
    });

    test("avoids repeating the previous image URL when possible", () => {
      const fact = "Cats sleep for around 14 hours a day.";
      const first = selectImageForFact(fact);
      const second = selectImageForFact(fact, { previousUrl: first.image.url });
      expect(second.image.url).not.toBe(first.image.url);
    });
  });
});

