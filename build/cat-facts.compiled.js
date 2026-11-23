(() => {
// anp-29-cat-facts/lib/utils.js
var HTML_ESCAPE_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#039;"
};
function escapeHtml(str) {
  if (typeof str !== "string") {
    return str == null ? "" : String(str);
  }
  return str.replace(/[&<>"']/g, (match) => HTML_ESCAPE_MAP[match]);
}
function attachDot(text, dot, dotPosition = "start") {
  if (!dot) return text;
  return dotPosition === "end" ? `${text} ${dot}` : `${dot} ${text}`;
}
function sampleRandom(array, excludeItem = null) {
  if (!Array.isArray(array) || array.length === 0) return null;
  if (array.length === 1) return array[0];
  if (excludeItem != null) {
    const candidates = array.filter((item) => item !== excludeItem);
    if (candidates.length > 0) {
      const idx2 = Math.floor(Math.random() * candidates.length);
      return candidates[idx2];
    }
  }
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}
function formatFactMarkdown(fact, options = {}) {
  const {
    style = "plain",
    imageUrl = null,
    category = null,
    badge = null,
    isLive = true,
    dotPosition = "start",
    showDot = true
  } = options;
  const cleanFact = (fact || "").trim();
  const dot = showDot ? isLive ? "\u{1F7E2}" : "\u{1F4BE}" : "";
  const catLabel = badge || (category ? `\u{1F43E} ${category}` : "\u{1F43E} Cat Fact");
  switch (style) {
    case "plain":
      return attachDot(cleanFact, dot, dotPosition);
    case "quote": {
      const header = attachDot(`**${catLabel}**`, dot, dotPosition);
      return `> ${header}
> ${cleanFact}
`;
    }
    case "card_with_image": {
      const imgLine = imageUrl ? `![${catLabel}](${imageUrl})

` : "";
      const header = attachDot(`**${catLabel}**`, dot, dotPosition);
      return `${imgLine}> ${header}
> ${cleanFact}
`;
    }
    case "callout": {
      const header = dot ? dotPosition === "end" ? `\u{1F4A1} **${catLabel}**: ${cleanFact} ${dot}` : `\u{1F4A1} ${dot} **${catLabel}**: ${cleanFact}` : `\u{1F4A1} **${catLabel}**: ${cleanFact}`;
      return `> ${header}
`;
    }
    default:
      return attachDot(cleanFact, dot, dotPosition);
  }
}

// anp-29-cat-facts/lib/data/facts.js
var SEED_FACTS = [
  "Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.",
  "A cat can jump up to six times its own height in a single bound thanks to powerful back leg muscles.",
  "Cats make about 100 different sounds, whereas dogs make only about 10 vocalizations.",
  "A cat\u2019s whiskers are deeply embedded in nerve-rich tissue and act as a radar system to navigate in pitch dark.",
  "Cats have a specialized reflective layer behind their retinas called the tapetum lucidum, enhancing night vision sixfold.",
  "A cat rubs against people not only to be affectionate but also to mark out its territory with facial scent glands.",
  "The domestic cat's purr vibrates at a frequency between 25 and 150 Hertz, which scientists believe stimulates bone density and tissue repair.",
  "The oldest known pet cat was found in a 9,500-year-old grave on the Mediterranean island of Cyprus, predating Egyptian art by millennia.",
  "A cat's spine contains 53 flexible vertebrae, compared to just 33 in humans, giving them extraordinary elasticity.",
  "All calico and tortoiseshell cats are almost exclusively female due to the orange and black coat gene being carried on the X chromosome."
];
var inMemoryFacts = null;
function getAllFacts() {
  return inMemoryFacts || SEED_FACTS;
}
function getRandomFact(excludeFact = null) {
  const list = getAllFacts();
  return sampleRandom(list, excludeFact) || list[0];
}

// anp-29-cat-facts/lib/api.js
var CAT_FACT_API_URL = "https://catfact.ninja/fact";
var MEOW_FACTS_API_URL = "https://meowfacts.herokuapp.com/";
async function fetchJsonWithTimeout(url, timeoutMs) {
  let timeoutId = null;
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const signal = controller ? controller.signal : void 0;
    if (controller && timeoutMs > 0) {
      timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } finally {
    if (timeoutId != null) {
      clearTimeout(timeoutId);
    }
  }
}
async function fetchOnlineFact(options = {}) {
  const { timeoutMs = 6e3 } = options;
  let primaryError = null;
  try {
    const data = await fetchJsonWithTimeout(CAT_FACT_API_URL, timeoutMs);
    if (data && typeof data.fact === "string" && data.fact.trim()) {
      return {
        fact: data.fact.trim(),
        length: data.length || data.fact.length,
        source: "catfact.ninja",
        isLive: true
      };
    }
  } catch (err) {
    primaryError = err;
  }
  try {
    const data2 = await fetchJsonWithTimeout(MEOW_FACTS_API_URL, 4e3);
    if (data2 && Array.isArray(data2.data) && data2.data[0]) {
      const fact = data2.data[0].trim();
      return {
        fact,
        length: fact.length,
        source: "meowfacts",
        isLive: true
      };
    }
  } catch (err2) {
  }
  throw primaryError || new Error("All live feline API endpoints failed");
}
async function getCatFact(options = {}) {
  const { preferOnline = true, timeoutMs = 6e3, excludeFact = null } = options;
  if (preferOnline && typeof fetch === "function") {
    try {
      const online = await fetchOnlineFact({ timeoutMs });
      if (online && online.fact) {
        return {
          fact: online.fact,
          source: online.source,
          isLive: true
        };
      }
    } catch (err) {
    }
  }
  const fallback = getRandomFact(excludeFact);
  return {
    fact: fallback,
    source: "curated",
    isLive: false
  };
}

// anp-29-cat-facts/lib/data/images.js
var IMG_QUERY = "?w=700&auto=format&fit=crop&q=80";
var SEED_IMAGES = [
  {
    id: "photo-1541781774459-bb2af2f05b55",
    url: `https://images.unsplash.com/photo-1541781774459-bb2af2f05b55${IMG_QUERY}`,
    category: "sleep",
    alt: "Cozy sleeping white and ginger cat curled up under duvet",
    tags: ["sleep", "nap", "curled", "bed", "peaceful", "dreaming"]
  },
  {
    id: "photo-1514888286974-6c03e2ca1dba",
    url: `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba${IMG_QUERY}`,
    category: "eyes",
    alt: "Dramatic close-up of a cat with luminous green-yellow eyes",
    tags: ["eyes", "vision", "stare", "pupils", "green eyes", "night vision"]
  },
  {
    id: "photo-1519052537078-e6302a4968d4",
    url: `https://images.unsplash.com/photo-1519052537078-e6302a4968d4${IMG_QUERY}`,
    category: "whiskers_senses",
    alt: "Ginger cat showing prominent white whiskers extending outward",
    tags: ["whiskers", "vibrissae", "muzzle", "touch", "sensory", "navigation"]
  },
  {
    id: "photo-1595433707802-6b2626ef1c91",
    url: `https://images.unsplash.com/photo-1595433707802-6b2626ef1c91${IMG_QUERY}`,
    category: "kittens",
    alt: "Sweet innocent kitten sitting on floor exploring its surroundings",
    tags: ["kitten", "growth", "young", "baby", "innocent", "playful"]
  },
  {
    id: "photo-1518288774672-b94e808873ff",
    url: `https://images.unsplash.com/photo-1518288774672-b94e808873ff${IMG_QUERY}`,
    category: "play_agility",
    alt: "Agile white cat gracefully balancing on sofa backrest",
    tags: ["agility", "balance", "jump", "speed", "athletic", "righting reflex"]
  },
  {
    id: "photo-1520315342629-6ea920342047",
    url: `https://images.unsplash.com/photo-1520315342629-6ea920342047${IMG_QUERY}`,
    category: "purr_vocal",
    alt: "White kitten looking up attentively ready to purr with joy",
    tags: ["purr", "vocal", "meow", "frequency", "healing", "vibrate", "content"]
  },
  {
    id: "photo-1570018144715-43110363d70a",
    url: `https://images.unsplash.com/photo-1570018144715-43110363d70a${IMG_QUERY}`,
    category: "grooming",
    alt: "Three well-groomed tabby kittens sitting together pristine and clean",
    tags: ["grooming", "tongue", "clean", "lick", "fur", "hygiene", "papillae"]
  },
  {
    id: "catapi-BjIppqbNI",
    url: "https://cdn2.thecatapi.com/images/BjIppqbNI.jpg",
    category: "hunting_wild",
    alt: "Bengal cat with wild leopard-spotted coat stalking through lush green grass",
    tags: ["wild", "hunting", "stalk", "bengal", "leopard", "predator"]
  },
  {
    id: "catapi-8of",
    url: "https://cdn2.thecatapi.com/images/8of.jpg",
    category: "black_cat",
    alt: "Glossy black cat resting in white porcelain sink",
    tags: ["black cat", "sink", "eyes", "dark", "sleek"]
  },
  {
    id: "photo-1492370284958-c20b15c692d2",
    url: `https://images.unsplash.com/photo-1492370284958-c20b15c692d2${IMG_QUERY}`,
    category: "history_regal",
    alt: "Noble British Shorthair cat sitting with regal composure near flowers",
    tags: ["history", "regal", "egypt", "worship", "royalty", "deity", "bastet"]
  },
  {
    id: "photo-1596854407944-bf87f6fdd49e",
    url: `https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e${IMG_QUERY}`,
    category: "anatomy",
    alt: "Orange cat standing tall showing complete body anatomy and balancing tail",
    tags: ["anatomy", "skeleton", "tail", "vertebrae", "bones", "flexible", "balance"]
  }
];
var inMemoryImages = null;
function getAllImages() {
  return inMemoryImages || SEED_IMAGES;
}
function getImagesByCategory(category) {
  const images = getAllImages();
  if (!category) return images;
  const filtered = images.filter((img) => img.category === category);
  return filtered.length > 0 ? filtered : images;
}
function getRandomCatImage(excludeUrl = null) {
  const images = getAllImages();
  return sampleRandom(images, excludeUrl ? images.find((i) => i.url === excludeUrl) : null) || images[0];
}
function getRandomImageForCategory(category, excludeUrl = null) {
  const pool = getImagesByCategory(category);
  const excludeItem = excludeUrl ? pool.find((i) => i.url === excludeUrl) : null;
  return sampleRandom(pool, excludeItem) || pool[0] || (inMemoryImages || SEED_IMAGES)[0];
}

// anp-29-cat-facts/lib/classifier.js
var CATEGORY_DEFINITIONS = {
  sleep: {
    id: "sleep",
    label: "Sleep & Rest",
    badge: "\u{1F4A4} Sleep & Rest",
    icon: "hotel",
    keywords: [
      "sleep",
      "sleeping",
      "asleep",
      "snooze",
      "nap",
      "napping",
      "yawn",
      "yawning",
      "dream",
      "dreaming",
      "hours a day",
      "hours per day",
      "rest",
      "resting",
      "bed",
      "loaf",
      "loafing",
      "lazy",
      "couch",
      "drowsy",
      "slumber",
      "deep sleep",
      "rem sleep"
    ]
  },
  eyes: {
    id: "eyes",
    label: "Vision & Senses",
    badge: "\u{1F441}\uFE0F Vision & Senses",
    icon: "visibility",
    keywords: [
      "eye",
      "eyes",
      "vision",
      "pupil",
      "pupils",
      "night vision",
      "darkness",
      "see in the dark",
      "sight",
      "blind",
      "tapetum",
      "tapetum lucidum",
      "retina",
      "blink",
      "eyelid",
      "nictitating",
      "field of view",
      "peripheral",
      "color vision",
      "blue eyes",
      "green eyes"
    ]
  },
  whiskers_senses: {
    id: "whiskers_senses",
    label: "Whiskers & Ears",
    badge: "\u{1F4E1} Whiskers & Ears",
    icon: "hearing",
    keywords: [
      "whisker",
      "whiskers",
      "vibrissae",
      "ear",
      "ears",
      "hear",
      "hearing",
      "muscles in each ear",
      "rotate",
      "acoustic",
      "smell",
      "scent",
      "nose",
      "snout",
      "flehmen",
      "jacobson",
      "vomeronasal",
      "sensory",
      "radar",
      "sound",
      "swivel"
    ]
  },
  kittens: {
    id: "kittens",
    label: "Kittens & Growth",
    badge: "\u{1F37C} Kittens & Growth",
    icon: "child_care",
    keywords: [
      "kitten",
      "kittens",
      "baby",
      "baby cat",
      "birth",
      "born",
      "litter",
      "kindle",
      "nursing",
      "mother",
      "weeks old",
      "newborn",
      "eyes open",
      "gestation",
      "pregnant"
    ]
  },
  play_agility: {
    id: "play_agility",
    label: "Speed & Agility",
    badge: "\u26A1 Speed & Agility",
    icon: "flash_on",
    keywords: [
      "jump",
      "jumping",
      "leap",
      "leaping",
      "height",
      "sprint",
      "run",
      "running",
      "speed",
      "mph",
      "fast",
      "climb",
      "climbing",
      "tree",
      "fall",
      "landing",
      "land on their feet",
      "righting reflex",
      "reflex",
      "play",
      "playing",
      "toy",
      "acrobatic",
      "zoomies",
      "bounce"
    ]
  },
  purr_vocal: {
    id: "purr_vocal",
    label: "Purring & Vocal",
    badge: "\u{1F63B} Purring & Vocal",
    icon: "favorite",
    keywords: [
      "purr",
      "purrs",
      "purring",
      "meow",
      "meows",
      "meowing",
      "vocal",
      "sound",
      "sounds",
      "hiss",
      "hissing",
      "chatter",
      "chirp",
      "cry",
      "voice",
      "frequency",
      "healing",
      "vibrate",
      "vibration",
      "head-bunt",
      "bunting",
      "affection",
      "slow blink",
      "cat kiss",
      "bond"
    ]
  },
  grooming: {
    id: "grooming",
    label: "Grooming & Fur",
    badge: "\u{1F9FC} Grooming & Fur",
    icon: "auto_fix_high",
    keywords: [
      "groom",
      "grooming",
      "lick",
      "licking",
      "tongue",
      "papillae",
      "wash",
      "washing",
      "clean",
      "cleanliness",
      "hairball",
      "bezoar",
      "fur",
      "coat",
      "shed",
      "shedding",
      "sweat through their paws",
      "brush"
    ]
  },
  hunting_wild: {
    id: "hunting_wild",
    label: "Hunting & Ancestors",
    badge: "\u{1F43E} Hunting & Wild",
    icon: "pest_control",
    keywords: [
      "hunt",
      "hunting",
      "hunter",
      "prey",
      "mice",
      "mouse",
      "rodent",
      "bird",
      "stalk",
      "stalking",
      "pounce",
      "crouch",
      "lion",
      "lions",
      "tiger",
      "tigers",
      "cheetah",
      "leopard",
      "wild",
      "wildcat",
      "carnivore",
      "predator",
      "predatory",
      "ambush"
    ]
  },
  black_cat: {
    id: "black_cat",
    label: "Black Cats & Folklore",
    badge: "\u{1F408}\u200D\u2B1B Black Cats & Magic",
    icon: "auto_awesome",
    keywords: [
      "black cat",
      "black cats",
      "superstition",
      "bad luck",
      "good luck",
      "witch",
      "witches",
      "witchcraft",
      "folklore",
      "myth",
      "omen",
      "fortune",
      "prosperity",
      "dark fur",
      "shadow"
    ]
  },
  history_regal: {
    id: "history_regal",
    label: "History & Ancient Egypt",
    badge: "\u{1F3DB}\uFE0F Ancient History",
    icon: "account_balance",
    keywords: [
      "egypt",
      "egyptian",
      "ancient",
      "history",
      "goddess",
      "bastet",
      "worship",
      "worshiped",
      "mummy",
      "mummified",
      "pharaoh",
      "temple",
      "sacred",
      "sailor",
      "ship",
      "century",
      "centuries",
      "isaac newton",
      "cat flap",
      "domesticate",
      "domestication",
      "cyprus"
    ]
  },
  anatomy: {
    id: "anatomy",
    label: "Anatomy & Biology",
    badge: "\u{1F9B4} Anatomy & Biology",
    icon: "biotech",
    keywords: [
      "bone",
      "bones",
      "skeleton",
      "collarbone",
      "clavicle",
      "tail",
      "claw",
      "claws",
      "paw",
      "paws",
      "toe",
      "toe beans",
      "tooth",
      "teeth",
      "taste",
      "sweet",
      "sweetness",
      "receptor",
      "heart",
      "heart rate",
      "pulse",
      "brain",
      "spine",
      "vertebrae",
      "flexible",
      "blood",
      "body temperature",
      "organ",
      "fingerprint",
      "nose print"
    ]
  }
};
var COMPILED_CATEGORIES = Object.entries(CATEGORY_DEFINITIONS).map(([catKey, def]) => ({
  catKey,
  def,
  weightedKeywords: def.keywords.map((keyword) => ({
    keyword,
    weight: keyword.includes(" ") ? 4 : keyword.length > 5 ? 2 : 1
  }))
}));
function classifyFact(factText) {
  if (!factText || typeof factText !== "string") {
    return {
      category: "general",
      label: "General Feline",
      badge: "\u{1F431} Feline Wisdom",
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
      if (normalized.includes(keyword)) {
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
    const confidence = Math.min(1, Math.round(maxScore / 4 * 100) / 100);
    return {
      category: bestCategory,
      label: def.label,
      badge: def.badge,
      icon: def.icon,
      confidence,
      matchedKeywords: bestMatches
    };
  }
  return {
    category: "general",
    label: "General Feline",
    badge: "\u{1F431} Feline Wisdom",
    icon: "pets",
    confidence: 0.1,
    matchedKeywords: []
  };
}
function selectImageForFact(factText, options = {}) {
  const { previousUrl = null, forceRandom = false } = options;
  if (forceRandom) {
    const randomImg = getRandomCatImage(previousUrl);
    return {
      image: randomImg,
      classification: {
        category: "random",
        label: "Random Cutie",
        badge: "\u{1F3B2} Random Cat",
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
  const fallbackImg = getRandomCatImage(previousUrl);
  return {
    image: fallbackImg,
    classification,
    isContextual: false
  };
}

// anp-29-cat-facts/lib/embed.js
function renderCatFactsEmbed(app, options = {}) {
  const imagesJson = JSON.stringify(SEED_IMAGES);
  const factsJson = JSON.stringify(SEED_FACTS);
  const categoriesJson = JSON.stringify(CATEGORY_DEFINITIONS);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Purrfect Cat Facts</title>
  <style>
    :root {
      --bg-primary: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-subtle: #f1f5f9;
      --bg-card-subtle-hover: #e2e8f0;
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --accent: #f97316;
      --accent-gradient: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      --accent-hover: #ea580c;
      --accent-active: #c2410c;
      --accent-subtle: #fff7ed;
      --accent-border: #fed7aa;
      --border: #e2e8f0;
      --border-dark: #cbd5e1;
      --success: #10b981;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 10px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 6px 12px -4px rgba(0, 0, 0, 0.06);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #0b1120;
        --bg-card: #1e293b;
        --bg-card-subtle: #293548;
        --bg-card-subtle-hover: #334155;
        --text-primary: #ffffff;
        --text-secondary: #f1f5f9;
        --text-muted: #cbd5e1;
        --accent: #fb923c;
        --accent-gradient: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
        --accent-hover: #f97316;
        --accent-active: #ea580c;
        --accent-subtle: rgba(251, 146, 60, 0.15);
        --accent-border: rgba(251, 146, 60, 0.35);
        --border: #334155;
        --border-dark: #475569;
        --success: #34d399;
        --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
        --shadow-md: 0 4px 10px -1px rgba(0, 0, 0, 0.5);
        --shadow-lg: 0 12px 28px -4px rgba(0, 0, 0, 0.6);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: var(--border-dark) transparent;
      -webkit-overflow-scrolling: touch;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      padding: 7px 9px 24px 9px;
      line-height: 1.45;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      -webkit-font-smoothing: antialiased;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: var(--border-dark) transparent;
    }

    /* WebKit & Blink custom scrollbar styling */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border-dark);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted);
    }

    .container {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding-bottom: 16px;
    }

    /* Enhanced Emoji Typography */
    .emoji-icon {
      font-size: 13.5px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: -1px;
      font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
    }

    .emoji-lg {
      font-size: 16px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: -1px;
      font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
    }

    /* Minimal Header */
    .header-minimal {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .brand-title-compact {
      font-weight: 800;
      font-size: 12.5px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: -0.01em;
    }

    .brand-title-compact .emoji-lg {
      font-size: 16px;
    }

    .source-link-compact a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
      transition: opacity 0.15s ease;
    }

    .source-link-compact a:hover {
      text-decoration: underline;
      opacity: 0.9;
    }

    /* Shared Card Styles (Bento Card Aesthetic) */
    .card {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
      overflow: hidden;
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--border-dark);
    }

    /* --- CARD 1: FACT CARD (FIRST) --- */
    .card-fact {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .fact-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 10px;
      background: var(--bg-card-subtle);
      color: var(--text-primary);
      border: 1px solid var(--border);
      letter-spacing: 0.01em;
    }

    .pill-badge.smart-match {
      background: var(--accent-subtle);
      color: var(--accent);
      border-color: var(--accent-border);
      font-weight: 700;
    }

    .pill-badge.pill-live {
      background: rgba(16, 185, 129, 0.16);
      color: #059669;
      border-color: rgba(16, 185, 129, 0.45);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
    }

    @media (prefers-color-scheme: dark) {
      .pill-badge.pill-live {
        background: rgba(16, 185, 129, 0.25);
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.55);
      }
    }

    .pill-badge.pill-live.offline {
      background: var(--bg-card-subtle);
      color: var(--text-secondary);
      border-color: var(--border);
    }

    .live-pulse {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .latency-ms {
      font-weight: 700;
      font-size: 10px;
      opacity: 0.95;
    }

    .fact-body {
      min-height: 44px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 11px;
      background: var(--bg-card-subtle);
      border-left: 3px solid var(--accent);
      border-radius: var(--radius-sm);
      transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }

    .fact-body:hover {
      background: var(--bg-card-subtle-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .fact-body:active {
      transform: translateY(1px) scale(0.99);
    }

    .fact-text {
      font-size: 13px;
      line-height: 1.45;
      color: var(--text-primary);
      font-weight: 700;
      transition: opacity 0.2s ease;
    }

    .fact-text.fade {
      opacity: 0.25;
    }

    .fact-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      padding-top: 6px;
      border-top: 1px solid var(--border);
    }

    .context-match-detail {
      color: var(--accent);
      background: var(--accent-subtle);
      border: 1px solid var(--accent-border);
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 10.5px;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    /* --- CARD 2: IMAGE CARD (SECOND) --- */
    .card-image {
      padding: 0;
      position: relative;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 200px;
      background: var(--bg-card-subtle);
      overflow: hidden;
    }

    .cat-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .image-container:hover .cat-img.loaded {
      transform: scale(1.03);
    }

    .cat-img.loaded {
      opacity: 1;
    }

    .image-skeleton {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, var(--bg-card-subtle) 25%, var(--border) 50%, var(--bg-card-subtle) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      color: var(--text-secondary);
      font-size: 11.5px;
      font-weight: 700;
      gap: 5px;
    }

    .image-skeleton.hidden {
      display: none;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .image-caption {
      position: absolute;
      bottom: 7px;
      left: 7px;
      right: 7px;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      background: rgba(15, 23, 42, 0.82);
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }

    .image-caption::before {
      content: "\u{1F43E} ";
      font-size: 13px;
      vertical-align: -1px;
      opacity: 0.95;
    }

    /* --- CARD 3: OPTIONS CARD (THIRD) --- */
    .card-options {
      padding: 9px 11px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .primary-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 11px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      white-space: nowrap;
    }

    .btn:active {
      transform: translateY(1px) scale(0.98);
    }

    .btn-primary {
      background: var(--accent-gradient);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(249, 115, 22, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.38);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--bg-card-subtle);
      color: var(--text-primary);
      border-color: var(--border);
    }

    .btn-secondary:hover {
      background: var(--bg-card-subtle-hover);
      border-color: var(--border-dark);
      transform: translateY(-1px);
    }

    /* Toggles Bar */
    .toggles-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 9px;
      background: var(--bg-card-subtle);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .toggle-group {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      color: var(--text-primary);
      cursor: pointer;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 28px;
      height: 16px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: var(--border-dark);
      transition: .22s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 20px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: .22s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 50%;
    }

    input:checked + .slider {
      background: var(--accent-gradient);
    }

    input:checked + .slider:before {
      transform: translateX(12px);
    }

    .shortcut-hint {
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: var(--text-secondary);
      padding-top: 1px;
    }

    kbd {
      font-family: inherit;
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--bg-card-subtle);
      border: 1px solid var(--border);
      border-bottom: 2px solid var(--border-dark);
      font-size: 9.5px;
      font-weight: 800;
      color: var(--text-primary);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%) translateY(40px);
      background: var(--text-primary);
      color: var(--bg-primary);
      padding: 6px 14px;
      border-radius: 24px;
      font-size: 11.5px;
      font-weight: 700;
      box-shadow: var(--shadow-lg);
      opacity: 0;
      pointer-events: none;
      transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--border);
    }

    #toastIcon {
      font-size: 15px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    :focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Minimal Header Row -->
    <div class="header-minimal">
      <div class="brand-title-compact">
        <span class="emoji-lg">\u{1F43E}</span>
        <span>Purrfect Cat Facts</span>
      </div>
      <div class="source-link-compact">
        <a href="https://catfact.ninja/" target="_blank" rel="noopener">catfact.ninja</a>
      </div>
    </div>

    <!-- CARD 1: Cat Fact Card (Comes FIRST) -->
    <div class="card card-fact">
      <div class="fact-header">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span class="pill-badge" id="categoryBadge"><span class="emoji-icon">\u{1F43E}</span> <span>Feline Wisdom</span></span>
          <span class="pill-badge pill-live" id="liveBadge" title="Live feline facts API"><span class="live-pulse"></span><span>Live API</span></span>
        </div>
        <span class="pill-badge smart-match" id="smartBadge"><span class="emoji-icon">\u2728</span> <span>Contextual</span></span>
      </div>
      <div class="fact-body" id="factBody" title="Click to copy">
        <p class="fact-text" id="factText">Loading your first cat fact...</p>
      </div>
      <div class="fact-footer">
        <span id="factSourceLabel"><span class="emoji-icon">\u{1F7E2}</span> <span>catfact.ninja</span></span>
        <span class="context-match-detail" id="matchDetail"><span class="emoji-icon">\u2728</span> <span>Theme Matched</span></span>
      </div>
    </div>

    <!-- CARD 2: Cat Image Card (Comes SECOND) -->
    <div class="card card-image">
      <div class="image-container">
        <div class="image-skeleton" id="imgSkeleton">
          <span class="emoji-icon">\u{1F43E}</span>
          <span>Loading kitty companion...</span>
        </div>
        <img id="catImg" class="cat-img" style="display: none;" referrerpolicy="no-referrer" alt="" />
        <div class="image-caption" id="imageCaption">Cat companion</div>
      </div>
    </div>

    <!-- CARD 3: Options Card (Comes THIRD) -->
    <div class="card card-options">
      <div class="primary-btn-row">
        <button class="btn btn-primary" id="btnNext" title="Shortcut: Spacebar or Right Arrow">
          <span class="emoji-icon">\u{1F43E}</span>
          <span>Next Fact</span>
        </button>
        <button class="btn btn-secondary" id="btnCopy" title="Shortcut: C">
          <span class="emoji-icon">\u{1F4CB}</span>
          <span>Copy Fact</span>
        </button>
      </div>

      <!-- Toggles -->
      <div class="toggles-bar">
        <label class="toggle-group" for="toggleSmart" title="Enable smart semantic matching of cat photos to fact topics">
          <span style="display: inline-flex; align-items: center; gap: 5px;"><span class="emoji-icon">\u2728</span> <span>Smart Match</span></span>
          <span class="toggle-switch">
            <input type="checkbox" id="toggleSmart" checked />
            <span class="slider"></span>
          </span>
        </label>
        <label class="toggle-group" for="toggleLive" title="Fetch live facts from catfact.ninja or use fast offline library">
          <span style="display: inline-flex; align-items: center; gap: 5px;"><span class="emoji-icon">\u{1F310}</span> <span>Live API</span></span>
          <span class="toggle-switch">
            <input type="checkbox" id="toggleLive" checked />
            <span class="slider"></span>
          </span>
        </label>
      </div>

      <div class="shortcut-hint">
        Press <kbd>Space</kbd> for next \u2022 <kbd>C</kbd> or click fact to copy
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" id="toast">
    <span id="toastIcon">\u2705</span>
    <span id="toastMsg">Copied!</span>
  </div>

  <!-- Client-side Logic -->
  <script type="text/javascript">
    (function() {
      // Injected datasets (initial seed for instant offline paint)
      let ALL_IMAGES = ${imagesJson};
      let ALL_FACTS = ${factsJson};
      const CATEGORY_DEFS = ${categoriesJson};

      // Dataset debloating: hydrate full catalogs from localStorage or remote GitHub Raw / jsDelivr
      const FACTS_CACHE_KEY = "CatFacts_Facts_Cache";
      const IMAGES_CACHE_KEY = "CatFacts_Images_Cache";

      try {
        if (typeof localStorage !== "undefined") {
          const cachedF = localStorage.getItem(FACTS_CACHE_KEY);
          if (cachedF) {
            const parsedF = JSON.parse(cachedF);
            if (Array.isArray(parsedF) && parsedF.length > ALL_FACTS.length) {
              ALL_FACTS = parsedF;
            }
          }
          const cachedI = localStorage.getItem(IMAGES_CACHE_KEY);
          if (cachedI) {
            const parsedI = JSON.parse(cachedI);
            if (Array.isArray(parsedI) && parsedI.length > ALL_IMAGES.length) {
              ALL_IMAGES = parsedI;
            }
          }
        }
      } catch (e) {}

      // Background async fetch for initial download if not cached
      setTimeout(async function() {
        if (ALL_FACTS.length <= 10) {
          try {
            const resF = await fetch("https://raw.githubusercontent.com/krishnakanthb13/anp-29-cat-facts/main/lib/data/facts.json");
            if (resF && resF.ok) {
              const dataF = await resF.json();
              if (Array.isArray(dataF) && dataF.length > 0) {
                ALL_FACTS = dataF;
                try { if (typeof localStorage !== "undefined") localStorage.setItem(FACTS_CACHE_KEY, JSON.stringify(dataF)); } catch (e) {}
              }
            }
          } catch (e) {}
        }
        if (ALL_IMAGES.length <= 11) {
          try {
            const resI = await fetch("https://raw.githubusercontent.com/krishnakanthb13/anp-29-cat-facts/main/lib/data/images.json");
            if (resI && resI.ok) {
              const dataI = await resI.json();
              if (Array.isArray(dataI) && dataI.length > 0) {
                ALL_IMAGES = dataI;
                try { if (typeof localStorage !== "undefined") localStorage.setItem(IMAGES_CACHE_KEY, JSON.stringify(dataI)); } catch (e) {}
              }
            }
          } catch (e) {}
        }
      }, 100);

      // State
      let currentFact = "";
      let isCurrentFactLive = true;
      let currentImage = null;
      let currentClassification = null;
      let isSmartMatch = true;
      let isLiveApi = true;
      let isLoading = false;
      let factIndex = Math.floor(Math.random() * ALL_FACTS.length);

      // DOM Elements
      const catImg = document.getElementById("catImg");
      const imgSkeleton = document.getElementById("imgSkeleton");
      const imageCaption = document.getElementById("imageCaption");
      const categoryBadge = document.getElementById("categoryBadge");
      const liveBadge = document.getElementById("liveBadge");
      const smartBadge = document.getElementById("smartBadge");
      const factBody = document.getElementById("factBody");
      const factText = document.getElementById("factText");
      const factSourceLabel = document.getElementById("factSourceLabel");
      const matchDetail = document.getElementById("matchDetail");
      const btnNext = document.getElementById("btnNext");
      const btnCopy = document.getElementById("btnCopy");
      const toggleSmart = document.getElementById("toggleSmart");
      const toggleLive = document.getElementById("toggleLive");
      const toast = document.getElementById("toast");
      const toastMsg = document.getElementById("toastMsg");
      const toastIcon = document.getElementById("toastIcon");

      // Toast notification helper
      function showToast(msg, icon = "\u2705") {
        toastMsg.textContent = msg;
        if (toastIcon) {
          toastIcon.textContent = icon;
        }
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2200);
      }

      // Helper to format badge strings with prominent emoji typography
      function formatBadgeHtml(badgeStr) {
        if (!badgeStr) return "";
        const spaceIdx = badgeStr.indexOf(" ");
        if (spaceIdx > 0) {
          const emoji = badgeStr.slice(0, spaceIdx);
          const label = badgeStr.slice(spaceIdx + 1);
          return '<span class="emoji-icon">' + emoji + '</span> <span>' + label + '</span>';
        }
        return badgeStr;
      }

      // Classifier implementation in browser
      function classifyFactText(text) {
        if (!text) return { category: "general", label: "General Feline", badge: "\u{1F431} Feline Wisdom", matchedKeywords: [] };
        const lower = text.toLowerCase();
        let bestCategory = null;
        let maxScore = 0;
        let matched = [];

        for (const [key, def] of Object.entries(CATEGORY_DEFS)) {
          let score = 0;
          const currentMatches = [];
          for (const word of def.keywords) {
            if (lower.includes(word)) {
              const weight = word.includes(" ") ? 4 : word.length > 5 ? 2 : 1;
              score += weight;
              currentMatches.push(word);
            }
          }
          if (score > maxScore) {
            maxScore = score;
            bestCategory = key;
            matched = currentMatches;
          }
        }

        if (bestCategory && maxScore > 0) {
          const def = CATEGORY_DEFS[bestCategory];
          return {
            category: bestCategory,
            label: def.label,
            badge: def.badge,
            matchedKeywords: matched
          };
        }

        return {
          category: "general",
          label: "General Feline",
          badge: "\u{1F431} Feline Wisdom",
          matchedKeywords: []
        };
      }

      // Select image for fact
      function pickImage(factText, smartMode, previousUrl) {
        if (!smartMode) {
          const pool = ALL_IMAGES.filter(i => i.url !== previousUrl);
          const choice = pool[Math.floor(Math.random() * pool.length)] || ALL_IMAGES[0];
          return {
            image: choice,
            classification: { category: "random", label: "Random Cat", badge: "\u{1F3B2} Random Cat", matchedKeywords: [] },
            isContextual: false
          };
        }

        const classification = classifyFactText(factText);
        if (classification.category !== "general") {
          const pool = ALL_IMAGES.filter(i => i.category === classification.category && i.url !== previousUrl);
          const fallbackPool = ALL_IMAGES.filter(i => i.category === classification.category);
          const candidateList = pool.length > 0 ? pool : fallbackPool;
          const choice = candidateList[Math.floor(Math.random() * candidateList.length)] || ALL_IMAGES[0];
          return {
            image: choice,
            classification,
            isContextual: true
          };
        }

        const pool = ALL_IMAGES.filter(i => i.url !== previousUrl);
        const choice = pool[Math.floor(Math.random() * pool.length)] || ALL_IMAGES[0];
        return {
          image: choice,
          classification,
          isContextual: false
        };
      }

      // Fetch fact (online API with secondary live fallback and local library fallback)
      async function fetchFact() {
        if (isLiveApi) {
          const startTime = Date.now();
          // 1. Primary endpoint: catfact.ninja
          try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 6000);
            const res = await fetch("https://catfact.ninja/fact", {
              headers: { "Accept": "application/json" },
              signal: controller.signal
            });
            clearTimeout(tid);
            if (res.ok) {
              const data = await res.json();
              if (data && data.fact) {
                const latency = Date.now() - startTime;
                // console.log("[CatFacts] \u{1F7E2} Live API Success (catfact.ninja):", data.fact, "(" + latency + "ms)");
                return {
                  fact: data.fact.trim(),
                  source: "catfact.ninja",
                  isLive: true,
                  latency: latency
                };
              }
            }
          } catch (e) {
            // console.warn("[CatFacts] Primary catfact.ninja API failed:", e.message);
          }

          // 2. Secondary endpoint: meowfacts.herokuapp.com
          try {
            const controller2 = new AbortController();
            const tid2 = setTimeout(() => controller2.abort(), 4000);
            const res2 = await fetch("https://meowfacts.herokuapp.com/", {
              signal: controller2.signal
            });
            clearTimeout(tid2);
            if (res2.ok) {
              const data2 = await res2.json();
              if (data2 && Array.isArray(data2.data) && data2.data[0]) {
                const latency2 = Date.now() - startTime;
                // console.log("[CatFacts] \u{1F7E2} Secondary Live API Success (meowfacts):", data2.data[0], "(" + latency2 + "ms)");
                return {
                  fact: data2.data[0].trim(),
                  source: "meowfacts",
                  isLive: true,
                  latency: latency2
                };
              }
            }
          } catch (e2) {
            // console.warn("[CatFacts] Secondary meowfacts API failed:", e2.message);
          }
        }

        // Offline curated library fallback
        factIndex = (factIndex + 1) % ALL_FACTS.length;
        // console.log("[CatFacts] \u{1F4BE} Serving from local curated collection:", ALL_FACTS[factIndex]);
        return {
          fact: ALL_FACTS[factIndex],
          source: "Curated Library",
          isLive: false,
          latency: 0
        };
      }

      // Display updated fact & image
      async function updateDisplay() {
        if (isLoading) return;
        isLoading = true;
        btnNext.disabled = true;
        factText.classList.add("fade");

        try {
          const { fact, source, isLive, latency } = await fetchFact();
          currentFact = fact;
          isCurrentFactLive = isLive;

          const selection = pickImage(fact, isSmartMatch, currentImage ? currentImage.url : null);
          currentImage = selection.image;
          currentClassification = selection.classification;

          // Safe Image Loading (prevents broken image icon flashing)
          imgSkeleton.classList.remove("hidden");
          catImg.style.display = "none";
          catImg.classList.remove("loaded");
          imageCaption.textContent = currentImage.alt;

          const tempImg = new Image();
          tempImg.referrerPolicy = "no-referrer";
          tempImg.onload = function() {
            catImg.src = currentImage.url;
            catImg.alt = currentImage.alt;
            catImg.style.display = "block";
            catImg.classList.add("loaded");
            imgSkeleton.classList.add("hidden");
          };
          tempImg.onerror = function() {
            catImg.src = ALL_IMAGES[0].url;
            catImg.alt = ALL_IMAGES[0].alt;
            catImg.style.display = "block";
            catImg.classList.add("loaded");
            imgSkeleton.classList.add("hidden");
          };
          tempImg.src = currentImage.url;

          // Update text and badges
          factText.textContent = fact;
          factText.classList.remove("fade");

          // Live API status indicator & footer
          if (isLive) {
            liveBadge.className = "pill-badge pill-live";
            liveBadge.innerHTML = '<span class="live-pulse"></span><span>Live API</span>' + (latency ? ' <span class="latency-ms">(' + latency + 'ms)</span>' : '');
            liveBadge.title = source + (latency ? " (" + latency + "ms)" : "");
            factSourceLabel.innerHTML = '<span><span class="emoji-icon">\u{1F7E2}</span> <span>' + source + '</span>' + (latency ? ' <small style="font-weight:700; opacity:0.9">(' + latency + 'ms)</small>' : '') + '</span>';
          } else {
            liveBadge.className = "pill-badge pill-live offline";
            liveBadge.innerHTML = '<span><span class="emoji-icon">\u{1F4BE}</span> <span>Offline Library</span></span>';
            liveBadge.title = isLiveApi ? "Network unavailable, using offline facts" : "Live API toggled off";
            factSourceLabel.innerHTML = '<span><span class="emoji-icon">\u{1F4BE}</span> <span>' + source + '</span></span>';
          }

          if (selection.isContextual) {
            categoryBadge.innerHTML = formatBadgeHtml(selection.classification.badge);
            categoryBadge.style.display = "inline-flex";
            smartBadge.style.display = "inline-flex";
            smartBadge.innerHTML = '<span class="emoji-icon">\u2728</span> <span>Contextual</span>';
            smartBadge.classList.add("smart-match");

            const kw = selection.classification.matchedKeywords.slice(0, 3).join(", ");
            matchDetail.innerHTML = '<span class="emoji-icon">\u2728</span> <span>' + (kw || "Theme Matched") + '</span>';
            matchDetail.style.display = "inline-flex";
          } else {
            categoryBadge.innerHTML = formatBadgeHtml(isSmartMatch ? "\u{1F431} Feline Wisdom" : "\u{1F3B2} Random Cat");
            categoryBadge.style.display = "inline-flex";
            smartBadge.style.display = isSmartMatch ? "none" : "inline-flex";
            smartBadge.innerHTML = '<span class="emoji-icon">\u{1F3B2}</span> <span>Random</span>';
            smartBadge.classList.remove("smart-match");
            matchDetail.style.display = "none";
          }
        } catch (err) {
          // console.error("Update error:", err);
        } finally {
          isLoading = false;
          btnNext.disabled = false;
        }
      }

      // Safe image fallback on element directly
      catImg.onerror = function() {
        if (catImg.src !== ALL_IMAGES[0].url) {
          catImg.src = ALL_IMAGES[0].url;
        }
      };

      // Copy text to clipboard
      async function copyFact() {
        if (!currentFact) return;
        const textToCopy = (isCurrentFactLive ? "\u{1F7E2} " : "") + currentFact;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            showToast("Fact copied to clipboard!", "\u{1F4CB}");
            return;
          }
        } catch (e) {
          // console.warn("[CatFacts] navigator.clipboard failed, attempting fallback:", e);
        }

        // Robust fallback for iframes or restricted environments
        try {
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (successful) {
            showToast("Fact copied to clipboard!", "\u{1F4CB}");
          } else {
            showToast("Copy failed", "\u26A0\uFE0F");
          }
        } catch (e2) {
          showToast("Failed to copy", "\u26A0\uFE0F");
        }
      }

      // Event Listeners
      btnNext.addEventListener("click", updateDisplay);
      btnCopy.addEventListener("click", copyFact);
      factBody.addEventListener("click", copyFact);

      toggleSmart.addEventListener("change", function(e) {
        isSmartMatch = e.target.checked;
        showToast(isSmartMatch ? "Smart Contextual Match ON" : "Pure Random Image Mode", isSmartMatch ? "\u2728" : "\u{1F3B2}");
        if (currentFact) {
          const selection = pickImage(currentFact, isSmartMatch, null);
          currentImage = selection.image;
          currentClassification = selection.classification;
          catImg.src = currentImage.url;
          imageCaption.textContent = currentImage.alt;
          if (selection.isContextual) {
            categoryBadge.innerHTML = formatBadgeHtml(selection.classification.badge);
            smartBadge.innerHTML = '<span class="emoji-icon">\u2728</span> <span>Contextual</span>';
            smartBadge.classList.add("smart-match");
            const kw = selection.classification.matchedKeywords.slice(0, 3).join(", ");
            matchDetail.innerHTML = '<span class="emoji-icon">\u2728</span> <span>' + (kw || "Theme Matched") + '</span>';
            matchDetail.style.display = "inline-flex";
          } else {
            categoryBadge.innerHTML = formatBadgeHtml(isSmartMatch ? "\u{1F431} Feline Wisdom" : "\u{1F3B2} Random Cat");
            smartBadge.innerHTML = '<span class="emoji-icon">\u{1F3B2}</span> <span>Random</span>';
            smartBadge.classList.remove("smart-match");
            matchDetail.style.display = "none";
          }
        }
      });

      toggleLive.addEventListener("change", function(e) {
        isLiveApi = e.target.checked;
        showToast(isLiveApi ? "Live API ON (catfact.ninja)" : "Offline Library ON (Curated)", isLiveApi ? "\u{1F7E2}" : "\u{1F4BE}");
        updateDisplay();
      });

      // Keyboard navigation
      window.addEventListener("keydown", function(e) {
        if (e.code === "Space" || e.code === "ArrowRight") {
          e.preventDefault();
          updateDisplay();
        } else if (e.code === "KeyC" && (e.ctrlKey || e.metaKey)) {
          // Allow normal copy
        } else if (e.code === "KeyC") {
          copyFact();
        }
      });

      // Initial load
      updateDisplay();
    })();
  </script>
</body>
</html>`;
}

// anp-29-cat-facts/cat-facts.js
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
        opened = await app.openSidebarEmbed(1.1, {});
      }
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
    if (typeof app.alert === "function") {
      await app.alert(`Error launching Cat Facts: ${err.message || err}`);
    }
  }
}
async function insertMarkdownOrFallback(app, markdown) {
  if (app?.context && typeof app.context.replaceSelection === "function") {
    try {
      const replaced = await app.context.replaceSelection(markdown);
      if (replaced) {
        return "";
      }
    } catch (err) {
    }
  }
  return markdown;
}
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
    return "\u{1F7E2} Cats sleep for roughly 70% of their lives.";
  }
}
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
    return "> \u{1F7E2} **\u{1F43E} Cat Fact**\n> Cats make over 100 different vocal sounds.\n";
  }
}
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
    return "> \u{1F7E2} **\u{1F43E} Cat Fact**\n> A cat can jump up to six times its height.\n";
  }
}
var plugin = {
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
      const options = args[0] && typeof args[0] === "object" ? args[0] : {};
      return renderCatFactsEmbed(app, options);
    } catch (err) {
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
var cat_facts_default = plugin;


return cat_facts_default;
})()