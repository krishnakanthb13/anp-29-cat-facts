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
      "heart rate", "pulse", "brain", "spine", "vertebrae", "flexible",
      "blood", "body temperature", "organ", "fingerprint", "nose print"
    ]
  }
};

/**
 * Classifies a cat fact by matching text against weighted keyword dictionaries.
 * @param {string} factText - The text of the cat fact.
 * @returns {object} Classification result with category, badge, confidence, and matched words.
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

  for (const [catKey, def] of Object.entries(CATEGORY_DEFINITIONS)) {
    let score = 0;
    const matches = [];

    for (const keyword of def.keywords) {
      if (normalized.includes(keyword)) {
        // Multi-word phrases and longer specific terms carry higher thematic weight
        const weight = keyword.includes(" ") ? 4 : keyword.length > 5 ? 2 : 1;
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
 * @param {object} [options={}]
 * @param {string|null} [options.previousUrl=null] - Image URL to avoid repeating consecutively.
 * @param {boolean} [options.forceRandom=false] - If true, bypasses contextual classifier.
 * @returns {object} { image, classification, isContextual }
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

