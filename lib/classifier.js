/**
 * @file classifier.js
 * @description Contextual classifier that analyzes cat facts and identifies themes
 * (sleep, vision, whiskers, hunting, kittens, grooming, anatomy, history, etc.)
 * to display thematically matching cat photos.
 */

import { getRandomCatImage, getRandomImageForCategory } from "./data/images.js";

/**
 * Category configuration with keyword dictionaries and UI display metadata.
 */
export const CATEGORY_DEFINITIONS = {
  sleep: {
    id: "sleep",
    label: "Sleep & Rest",
    badge: "💤 Sleep & Rest",
    icon: "hotel",
    keywords: [
      "sleep", "sleeping", "asleep", "snooze", "nap", "napping",
      "yawn", "yawning", "dream", "dreaming", "hours a day", "hours per day",
      "rest", "resting", "bed", "loaf", "loafing", "lazy", "couch",
      "drowsy", "slumber", "deep sleep", "rem sleep"
    ]
  },
  eyes: {
    id: "eyes",
    label: "Vision & Senses",
    badge: "👁️ Vision & Senses",
    icon: "visibility",
    keywords: [
      "eye", "eyes", "vision", "pupil", "pupils", "night vision",
      "darkness", "see in the dark", "sight", "blind", "tapetum",
      "tapetum lucidum", "retina", "blink", "eyelid", "nictitating",
      "field of view", "peripheral", "color vision", "blue eyes", "green eyes"
    ]
  },
  whiskers_senses: {
    id: "whiskers_senses",
    label: "Whiskers & Ears",
    badge: "📡 Whiskers & Ears",
    icon: "hearing",
    keywords: [
      "whisker", "whiskers", "vibrissae", "ear", "ears", "hear",
      "hearing", "muscles in each ear", "rotate", "acoustic",
      "smell", "scent", "nose", "snout", "flehmen", "jacobson",
      "vomeronasal", "sensory", "radar", "sound", "swivel"
    ]
  },
  kittens: {
    id: "kittens",
    label: "Kittens & Growth",
    badge: "🍼 Kittens & Growth",
    icon: "child_care",
    keywords: [
      "kitten", "kittens", "baby", "baby cat", "birth", "born",
      "litter", "kindle", "nursing", "mother", "weeks old",
      "newborn", "eyes open", "gestation", "pregnant"
    ]
  },
  play_agility: {
    id: "play_agility",
    label: "Speed & Agility",
    badge: "⚡ Speed & Agility",
    icon: "flash_on",
    keywords: [
      "jump", "jumping", "leap", "leaping", "height", "sprint",
      "run", "running", "speed", "mph", "fast", "climb", "climbing",
      "tree", "fall", "landing", "land on their feet", "righting reflex",
      "reflex", "play", "playing", "toy", "acrobatic", "zoomies", "bounce"
    ]
  },
  purr_vocal: {
    id: "purr_vocal",
    label: "Purring & Vocal",
    badge: "😻 Purring & Vocal",
    icon: "favorite",
    keywords: [
      "purr", "purrs", "purring", "meow", "meows", "meowing",
      "vocal", "sound", "sounds", "hiss", "hissing", "chatter",
      "chirp", "cry", "voice", "frequency", "healing", "vibrate",
      "vibration", "head-bunt", "bunting", "affection", "slow blink",
      "cat kiss", "bond"
    ]
  },
  grooming: {
    id: "grooming",
    label: "Grooming & Fur",
    badge: "🧼 Grooming & Fur",
    icon: "auto_fix_high",
    keywords: [
      "groom", "grooming", "lick", "licking", "tongue", "papillae",
      "wash", "washing", "clean", "cleanliness", "hairball",
      "bezoar", "fur", "coat", "shed", "shedding", "sweat through their paws",
      "brush"
    ]
  },
  hunting_wild: {
    id: "hunting_wild",
    label: "Hunting & Ancestors",
    badge: "🐾 Hunting & Wild",
    icon: "pest_control",
    keywords: [
      "hunt", "hunting", "hunter", "prey", "mice", "mouse", "rodent",
      "bird", "stalk", "stalking", "pounce", "crouch", "lion", "lions",
      "tiger", "tigers", "cheetah", "leopard", "wild", "wildcat",
      "carnivore", "predator", "predatory", "ambush"
    ]
  },
  black_cat: {
    id: "black_cat",
    label: "Black Cats & Folklore",
    badge: "🐈‍⬛ Black Cats & Magic",
    icon: "auto_awesome",
    keywords: [
      "black cat", "black cats", "superstition", "bad luck", "good luck",
      "witch", "witches", "witchcraft", "folklore", "myth", "omen",
      "fortune", "prosperity", "dark fur", "shadow"
    ]
  },
  history_regal: {
    id: "history_regal",
    label: "History & Ancient Egypt",
    badge: "🏛️ Ancient History",
    icon: "account_balance",
    keywords: [
      "egypt", "egyptian", "ancient", "history", "goddess", "bastet",
      "worship", "worshiped", "mummy", "mummified", "pharaoh",
      "temple", "sacred", "sailor", "ship", "century", "centuries",
      "isaac newton", "cat flap", "domesticate", "domestication", "cyprus"
    ]
  },
  anatomy: {
    id: "anatomy",
    label: "Anatomy & Biology",
    badge: "🦴 Anatomy & Biology",
    icon: "biotech",
    keywords: [
      "bone", "bones", "skeleton", "collarbone", "clavicle", "tail",
      "claw", "claws", "paw", "paws", "toe", "toe beans", "tooth",
      "teeth", "taste", "sweet", "sweetness", "receptor", "heart",
      "heart beats", "heartbeat", "beats", "heart rate", "pulse", "brain", "spine", "vertebrae", "flexible",
      "blood", "body temperature", "organ", "fingerprint", "nose print"
    ]
  }
};

/**
 * Tests whether a keyword occurs in the text as a whole word (or whole phrase).
 * Uses indexOf + boundary inspection instead of a regex so the exact same logic can be
 * mirrored in the browser embed. Prevents short tokens like "ear" from matching "heart"
 * or "earth", and stops "eye"/"eyes" from double-scoring one occurrence.
 *
 * @param {string} text - Lowercased fact text.
 * @param {string} keyword - Lowercased keyword or phrase.
 * @returns {boolean} - True when the keyword appears on word boundaries.
 */
function hasWholeWordMatch(text, keyword) {
  const wordChar = /[a-z0-9_]/;
  let idx = text.indexOf(keyword);

  while (idx !== -1) {
    const before = idx === 0 ? "" : text[idx - 1];
    const afterIndex = idx + keyword.length;
    const after = afterIndex >= text.length ? "" : text[afterIndex];
    if (!wordChar.test(before) && !wordChar.test(after)) {
      return true;
    }
    idx = text.indexOf(keyword, idx + 1);
  }

  return false;
}

/**
 * Pre-compiled category list with pre-calculated keyword weights for high-throughput classification.
 */
const COMPILED_CATEGORIES = Object.entries(CATEGORY_DEFINITIONS).map(([catKey, def]) => ({
  catKey,
  def,
  weightedKeywords: def.keywords.map(keyword => ({
    keyword,
    weight: keyword.includes(" ") ? 4 : keyword.length > 5 ? 2 : 1
  }))
}));

/**
 * Classifies a cat fact by matching text against weighted keyword dictionaries.
 * @param {string} factText - The text of the cat fact.
 * @returns {object} - Classification result with category, label, badge, icon, confidence, and matched keywords.
 */
export function classifyFact(factText) {
  if (!factText || typeof factText !== "string") {
    return {
      category: "general",
      label: "General Feline",
      badge: "🐱 Feline Wisdom",
      icon: "pets",
      confidence: 0,
      matchedKeywords: []
    };
  }

  const normalized = factText.toLowerCase();
  let bestCategory = null;
  let maxScore = 0;
  let bestMatches = [];

  for (let i = 0; i < COMPILED_CATEGORIES.length; i++) {
    const { catKey, weightedKeywords } = COMPILED_CATEGORIES[i];
    let score = 0;
    const matches = [];

    for (let k = 0; k < weightedKeywords.length; k++) {
      const { keyword, weight } = weightedKeywords[k];
      if (hasWholeWordMatch(normalized, keyword)) {
        score += weight;
        matches.push(keyword);
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = catKey;
      bestMatches = matches;
    }
  }

  if (bestCategory && maxScore > 0) {
    const def = CATEGORY_DEFINITIONS[bestCategory];
    const confidence = Math.min(1, Math.round((maxScore / 4) * 100) / 100);

    return {
      category: bestCategory,
      label: def.label,
      badge: def.badge,
      icon: def.icon,
      confidence,
      matchedKeywords: bestMatches
    };
  }

  // Graceful fallback for general cat facts
  return {
    category: "general",
    label: "General Feline",
    badge: "🐱 Feline Wisdom",
    icon: "pets",
    confidence: 0.1,
    matchedKeywords: []
  };
}

/**
 * Selects an appropriate cat photo based on the fact text.
 * If contextual matching is enabled, chooses from the matched thematic category.
 * If forceRandom is true or no category matches, picks randomly from the full catalog.
 *
 * @param {string} factText - Fact text to analyze.
 * @param {object} [options={}] - Selection options.
 * @param {string|null} [options.previousUrl=null] - Image URL to avoid repeating consecutively.
 * @param {boolean} [options.forceRandom=false] - If true, bypasses contextual classifier.
 * @returns {{ image: object, classification: object, isContextual: boolean }} - Result containing chosen image, classification object, and contextual flag.
 */
export function selectImageForFact(factText, options = {}) {
  const { previousUrl = null, forceRandom = false } = options;

  if (forceRandom) {
    const randomImg = getRandomCatImage(previousUrl);
    return {
      image: randomImg,
      classification: {
        category: "random",
        label: "Random Cutie",
        badge: "🎲 Random Cat",
        icon: "shuffle",
        confidence: 1,
        matchedKeywords: []
      },
      isContextual: false
    };
  }

  const classification = classifyFact(factText);

  if (classification.category !== "general") {
    const contextualImg = getRandomImageForCategory(classification.category, previousUrl);
    return {
      image: contextualImg,
      classification,
      isContextual: true
    };
  }

  // Fallback to random image from entire pool
  const fallbackImg = getRandomCatImage(previousUrl);
  return {
    image: fallbackImg,
    classification,
    isContextual: false
  };
}

