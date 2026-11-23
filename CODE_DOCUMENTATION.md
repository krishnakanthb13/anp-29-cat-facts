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
│ catfact.ninja    │            │ 70 Curated Cats  │
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
- **Algorithm & Optimization**:
  1. **Pre-Compiled Weight Cache**: During module initialization, `COMPILED_CATEGORIES` pre-computes keyword weights into static tuples (`weight = keyword.includes(" ") ? 4 : keyword.length > 5 ? 2 : 1`), eliminating `Object.entries()` allocations and dynamic string evaluations inside classification loops.
  2. Input `factText` is normalized to lowercase.
  3. The text is scanned against the pre-compiled categories:
     - Exact multi-word phrases (e.g. `"tapetum lucidum"`, `"hours a day"`, `"righting reflex"`, `"jacobson's organ"`): **4 points**.
     - Specific domain words (length > 5, e.g. `"papillae"`, `"vibrissae"`, `"whiskers"`, `"collarbone"`): **2 points**.
     - General domain tokens: **1 point**.
  4. The category with the highest aggregate score is chosen.
  5. If max score > 0, returns category metadata, badge, confidence level, and matched keywords.
  6. If no matches occur or text is invalid, falls back gracefully to `"general"` category (`"🐱 Feline Wisdom"`).

### 2.4 `lib/api.js` & Failover Architecture
- **Unified Fetch Helper**: `fetchJsonWithTimeout(url, timeoutMs)` encapsulates `AbortController` signal handling, request timeout clearing, and response validation into a single DRY helper.
- **5-Tier Resilience Architecture**:
  1. **Tier 1 (Primary Live API)**: `catfact.ninja/fact` with a 6-second timeout.
  2. **Tier 2 (Secondary Live API)**: `meowfacts.herokuapp.com/` fallback with a 4-second timeout if primary fails or times out.
  3. **Tier 3 (Persistent Browser Cache)**: Asynchronous hydration from `localStorage` (`139` facts).
  4. **Tier 4 (Inlined Starter Seed)**: `SEED_FACTS` (10 facts) inlined in the bundle guarantees immediate paint on zero-network first launch.
  5. **Tier 5 (Hard Fallback String)**: Catch blocks return a safe default string so execution never crashes.
- Automatically handles network drops, CORS restrictions, rate limits (HTTP 429), or server errors (HTTP 500).

### 2.5 `lib/embed.js`
- **Peek Viewer Web App**:
  - Rendered inside an isolated `<iframe>` by Amplenote.
  - Client-side DOM with zero external CSS/JS dependencies.
  - Image skeleton shimmer with graceful `onerror` and `onload` handlers.
  - Cached DOM references (`btnNext`, `btnCopy`, `toastIcon`) for minimal DOM querying overhead.
  - **Card 3 Actions**:
    - `btnNext` (🐾 Next Fact): Fetches next fact & image.
    - `btnCopy` (📋 Copy Fact): Copies fact to clipboard with visual toast feedback.
  - **Keyboard Navigation**: <kbd>Space</kbd> or <kbd>→</kbd> for Next Fact, <kbd>C</kbd> to copy.
  - **Latency Telemetry**: Distinct `🟢 Live API` status badge displaying round-trip response time (`.latency-ms`).

### 2.6 `lib/utils.js`
- **Single-Pass HTML Sanitization**:
  - `escapeHtml(str)`: Employs a single-pass regex replacement using a static `HTML_ESCAPE_MAP` lookup table ($O(N)$ traversal) to prevent XSS without chaining multiple string replacements.
- **Markdown & Indicator Formatting**:
  - `formatFactMarkdown(fact, options)`: Formats facts into plain, quote, or photo card styles.
  - `attachDot(text, dot, dotPosition)`: Composes indicator emojis without duplicating formatting logic.
  - Replaces cumbersome markdown URL links with a clean indicator emoji: `🟢` for fresh live API data (`catfact.ninja` or `meowfacts`), and `💾` for offline curated storage.
  - Configurable `dotPosition` (`"start"` or `"end"`, defaulting to `"start"`).

### 2.7 `cat-facts.js`
- **Amplenote Plugin Protocol**:
  - `insertText`: Named option dictionary (`"Random"`, `"Quote Card"`, `"Photo Card"`).
  - `insertMarkdownOrFallback`: Calls `await app.context.replaceSelection(markdown)` and returns `""` (empty string) so Amplenote parses the string natively as rich GFM without escaping syntax characters with backslashes (`\>`, `\*\*`, `!\[\]\(\)`), while satisfying the `String` return type contract to prevent null reference errors. Falls back to returning the raw markdown string if `replaceSelection` is unavailable.
  - `appOption`: Named option dictionary (`"Open Peek Viewer"`) launching the Peek Viewer embed (`openSidebarEmbed` with numeric fallback to `openEmbed`).
  - `renderEmbed`: Generates HTML string.
  - `onEmbedCall`: Dispatches incoming actions (`notify`) with defensive `payload ?? {}` normalization and optional chaining on `app?.context` to safeguard against null or malformed RPC invocations.

---

## 3. Test Suite & Verification

The plugin includes automated unit and integration tests covering all modules:
- `test/api.test.js`: Mocked live endpoints, abort timeouts, and offline fallback.
- `test/classifier.test.js`: Keyword matching, scoring tiers, and fallback behavior across 11 categories.
- `test/embed.test.js`: Peek Viewer DOM structure, required controls (`btnNext`, `btnCopy`), and layout integration.
- `test/facts.test.js`: Seed integrity, dataset bounds, and `getFactByIndex` normalization.
- `test/images.test.js`: CDN URL format, category distribution, and random selection.
- `test/plugin.test.js`: Entry point actions, `replaceSelection` integration, and null/undefined payload resilience.
- `test/utils.test.js`: Single-pass HTML escaping, random sampling, and markdown generation.

**Execution Command**:
```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js anp-29-cat-facts/test
```
*Current Status: 7 suites, 77 passing tests (100% pass rate).*

