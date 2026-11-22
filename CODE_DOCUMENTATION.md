# Technical Architecture & Code Documentation: Purrfect Cat Facts

**Plugin Identifier**: `anp-29-cat-facts`  
**API Reference**: [catfact.ninja](https://catfact.ninja/)  
**Bundle Target**: `build/cat-facts.compiled.js` (IIFE Format)

---

## 1. System Overview

Purrfect Cat Facts integrates three core subsystems:
1. **Fact Retrieval Pipeline (`lib/api.js` & `lib/data/facts.js`)**: Real-time queries to `https://catfact.ninja/fact` coupled with an offline curated repository of 139 feline facts.
2. **Contextual Classification Engine (`lib/classifier.js` & `lib/data/images.js`)**: An NLP keyword-weighting model that categorizes facts into 11 distinct thematic domains and pairs them with 70 visually audited, 100% feline photos (curated from Unsplash and TheCatAPI).
3. **Interactive Embed Dashboard (`lib/embed.js`)**: An iframe-isolated web application designed for Amplenote's Peek Viewer sidebar organized into 3 distinct cards (Fact Card FIRST, Image Card SECOND, Options Card THIRD) with an ultra-minimal header, supporting client-side theme detection, live fetching, keyboard shortcuts, and bi-directional RPC communication via `window.callAmplenotePlugin`.

```
               ┌────────────────────────┐
               │    Amplenote Editor    │
               └───────────┬────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
    {insertText} Menu           {appOption} Command
             │                           │
             ▼                           ▼
     ┌──────────────┐           ┌──────────────────┐
     │  Plain/Quote │           │ openSidebarEmbed │
     │  Insertion   │           └────────┬─────────┘
     └───────┬──────┘                    │
             │                           ▼
             │                  ┌──────────────────┐
             │                  │   renderEmbed    │
             │                  │  (Peek Viewer)   │
             │                  └────────┬─────────┘
             │                           │
             ▼                           ▼
  ┌──────────────────────────────────────────────┐
  │         NLP Contextual Classifier            │
  │     (Analyzes text -> Finds category)        │
  └──────────────────────┬───────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌──────────────────┐            ┌──────────────────┐
│ catfact.ninja    │            │ 67 Curated Cats  │
│ (Live Endpoint)  │            │ (Thematic Pool)  │
└──────────────────┘            └──────────────────┘
```

---

## 2. Component Specifications

### 2.1 Dataset Debloating & Data Assets (`lib/data/`)
Following the [Debloating Large Datasets Guide](../../common-issues-and-fixes/dataset-debloating.md):
- **Extracted JSON Assets**:
  - `lib/data/facts.json`: Complete repository of 139 verified feline facts (~19.8 KB).
  - `lib/data/images.json`: Complete catalog of 70 visually audited authentic cat images (~24.6 KB).
- **ESBuild Exclusion**: Both datasets are marked `external: ["*.json"]` in `esbuild.js` to avoid static inlining.
- **Instant Offline Starter Seed**:
  - `SEED_FACTS` (10 core facts) and `SEED_IMAGES` (11 category-representative photos) are kept in memory for instant, zero-latency first paint with 0 initial network requests.
- **Dynamic Hydration Pattern**:
  - `loadFacts()` & `loadImages()` check: (1) In-memory cache -> (2) Persistent browser `localStorage` (`CatFacts_Facts_Cache`, `CatFacts_Images_Cache`) -> (3) Multi-endpoint remote fetch from GitHub Raw (`krishnakanthb13/anp-29-cat-facts`) and jsDelivr CDN.
- **Bundle Optimization**: Reduced compiled IIFE bundle from **82.5 KB to 48.8 KB** (41% reduction).

### 2.2 `lib/data/images.js`
- **Data Model**: `Array<CatImage>` where each entry contains:
  - `id`: Unique photo identifier (`photo-*` or `catapi-*`).
  - `url`: Direct CDN link (Unsplash responsive or TheCatAPI permanent CDN).
  - `category`: Primary theme mapping (`sleep`, `eyes`, `whiskers_senses`, `kittens`, `play_agility`, `purr_vocal`, `grooming`, `hunting_wild`, `black_cat`, `history_regal`, `anatomy`).
  - `alt`: Accessibility description.
  - `tags`: Associative matching tokens.
- **Key Functions**:
  - `getAllImages()`: Returns entire catalog (loaded or seed).
  - `getImagesByCategory(category)`: Filters catalog by category.
  - `getRandomCatImage(excludeUrl)`: Uniform random selection avoiding consecutive repetitions.
  - `getRandomImageForCategory(category, excludeUrl)`: Scoped thematic selection.
  - `loadImages(app)`: Async hydration engine.

### 2.3 `lib/classifier.js`
- **Algorithm**:
  1. Input `factText` is normalized to lowercase and stripped of special characters.
  2. The text is scanned against `CATEGORY_DEFINITIONS`.
  3. Weights are applied:
     - Exact multi-word phrases (e.g. `"tapetum lucidum"`, `"hours a day"`, `"righting reflex"`, `"jacobson's organ"`): **4 points**.
     - Specific domain words (length > 5, e.g. `"papillae"`, `"vibrissae"`, `"whiskers"`, `"collarbone"`): **2 points**.
     - General domain tokens: **1 point**.
  4. The category with the highest aggregate score is chosen.
  5. If max score > 0, returns category metadata, badge, confidence level, and matched keywords.
  6. If no matches occur, falls back to `"general"` category (`"🐱 Feline Wisdom"`).

### 2.3 `lib/api.js` & Failover Architecture
- **5-Tier Resilience Architecture**:
  1. **Tier 1 (Primary Live API)**: `catfact.ninja/fact` with a 6-second `AbortController` timeout.
  2. **Tier 2 (Secondary Live API)**: `meowfacts.herokuapp.com/` fallback with a 4-second timeout if primary fails or times out.
  3. **Tier 3 (Persistent Browser Cache)**: Asynchronous hydration from `localStorage` (`139` facts).
  4. **Tier 4 (Inlined Starter Seed)**: `SEED_FACTS` (10 facts) inlined in the bundle guarantees immediate paint on zero-network first launch.
  5. **Tier 5 (Hard Fallback String)**: Catch blocks return a safe default string so execution never crashes.
- Automatically handles network drops, CORS restrictions, rate limits (HTTP 429), or server errors (HTTP 500).

### 2.4 `lib/embed.js`
- **Peek Viewer Web App**:
  - Rendered inside an isolated `<iframe>` by Amplenote.
  - Client-side DOM with zero external CSS/JS dependencies.
  - Image skeleton shimmer with graceful `onerror` and `onload` handlers.
  - Two-way messaging: calls `window.callAmplenotePlugin("insertIntoNote", payload)` to communicate with host plugin.

### 2.5 `lib/utils.js`
- **Markdown & Indicator Formatting**:
  - `formatFactMarkdown(fact, options)`: Formats facts into plain, quote, or photo card styles.
  - Replaces cumbersome markdown URL links with a clean indicator emoji: `🟢` for fresh live API data (`catfact.ninja` or `meowfacts`), and `💾` for offline curated storage.
  - Configurable `dotPosition` (`"start"` or `"end"`, defaulting to `"start"`).
  - Sanitizes user and API inputs with `escapeHtml`.

### 2.6 `cat-facts.js`
- **Amplenote Plugin Protocol**:
  - `insertText`: Object callable both as a direct function and as a named dictionary (`"Random Cat Fact"`, `"Cat Fact Quote Card"`, `"Cat Fact with Photo"`).
  - `appOption`: Launches Peek Viewer embed (`openSidebarEmbed` with numeric fallback to `openEmbed`).
  - `renderEmbed`: Generates HTML string.
  - `onEmbedCall`: Dispatches incoming actions (`insertIntoNote`, `notify`).

