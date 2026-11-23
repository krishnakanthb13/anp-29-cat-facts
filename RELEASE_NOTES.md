# Release Notes: Purrfect Cat Facts

## v0.0.14 (2026-11-23)

- **Removed Non-Functional "Insert Note" Button**:
  - Removed the non-functional `Insert Note` button and `insertIntoNote` RPC handler from the Peek Viewer HTML dashboard and manifest. The dashboard features a clean, focused 2-column action layout (**🐾 Next Fact** and **📋 Copy Fact**).
- **Cleaned Up Project Documentation**:
  - Thoroughly audited and synchronized documentation across `README.md`, `CODE_DOCUMENTATION.md`, `DESIGN_PHILOSOPHY.md`, `RELEASE_NOTES.md`, and tutorial scripts, eliminating obsolete references and maintaining 100% fidelity with the live codebase.

## v0.0.13 (2026-11-23)

### 🐛 Bug Fixes & Refinements
- **Re-enabled Vertical Scrolling in Peek Viewer Embed**:
  - Restored full vertical scrolling in `lib/embed.js` by setting `html` and `body` to `overflow-y: auto; height: 100%; -webkit-overflow-scrolling: touch; scroll-behavior: smooth;`.
  - Added subtle custom scrollbar styling (`::-webkit-scrollbar` with 6px width and rounded thumb) matching active light/dark themes.
  - Added extra bottom padding to `.container` (`24px` on body, `16px` on container) ensuring Card 3 controls and shortcuts are never clipped in narrow or short sidebar viewports.
- **Commented Out All Runtime Console Statements**:
  - Cleaned up `cat-facts.js`, `lib/embed.js`, `lib/api.js`, `lib/data/facts.js`, and `lib/data/images.js` by commenting out all active `console.log`, `console.warn`, and `console.error` invocations to eliminate noise in Amplenote developer console.
- **Fixed `TypeError: Cannot read properties of null (reading 'name')` / `(reading 'tags')`**:
  - Updated `insertMarkdownOrFallback` in `cat-facts.js` to return `""` (empty string) instead of `null` when selection replacement succeeds. This satisfies Amplenote's `insertText` String return contract and prevents `note_editor_app`'s postMessage dispatcher from crashing on `null`.

## v0.0.12 (2026-11-23)

### 🐛 Bug Fixes & Refinements
- **Streamlined Action Option Names (No Repetition)**:
  - Renamed `insertText` options from `"Random Cat Fact"`, `"Cat Fact Quote Card"`, `"Cat Fact with Photo"` to `"Random"`, `"Quote Card"`, and `"Photo Card"`. Since Amplenote automatically prefixes `Plugin: <Plugin Name>:`, this eliminates awkward word duplication like `Plugin: Cat Facts: Random Cat Fact` in favor of clean entries (`Plugin: Cat Facts: Random`, `Plugin: Cat Facts: Quote Card`, `Plugin: Cat Facts: Photo Card`).
  - Renamed `appOption` to `"Open Peek Viewer"` to avoid repeating "Cat Facts" in Quick Search (`Plugin: Cat Facts: Open Peek Viewer`).
- **Multi-Option Action Registration (`insertText` & `appOption`)**:
  - Converted `insertText` from a function to a standard dictionary (`"Random Cat Fact"`, `"Cat Fact Quote Card"`, `"Cat Fact with Photo"`), enabling Amplenote to register and display all 3 options in the `{` expression menu.
  - Converted `appOption` to a standard dictionary (`"Open Cat Facts"`), making the dashboard command discoverable in Quick Search / Jump-to-Note.
- **Markdown Escaping Resolution via `replaceSelection`**:
  - Implemented `insertMarkdownOrFallback`: uses `await app.context.replaceSelection(markdown)` and returns `null` so Amplenote renders rich blockquotes, bold badges, and contextual photos natively without escaping markdown syntax with backslashes (`\>`, `\*\*`, `!\[\]\(\)`).
- **Peek Viewer Action Controls & Latency Telemetry**:
  - Added round-trip response latency display (`.latency-ms`) directly inside the `🟢 Live API` badge.

## v0.0.10 (2026-11-22)

**Initial Open-Source Release**

Purrfect Cat Facts brings delightful feline wisdom and contextual photo matching into your Amplenote workspace, combining inline productivity commands with an interactive 3-card Peek Viewer dashboard.

### 🚀 New Features
- **Inline Text Insertion Commands (`insertText`)**:
  - `Random Cat Fact`: Inserts a clean, single-line fact prefixed with an unobtrusive status dot (`🟢` for Live API, `💾` for Curated Storage) without markdown URL clutter.
  - `Cat Fact Quote Card`: Inserts an elegant markdown blockquote with category emoji badge (e.g. `> 🟢 **💤 Sleep & Rest**`).
  - `Cat Fact with Photo`: Pairs the fact with a verified authentic cat photo in responsive markdown followed directly by the formatted quote card.
- **Interactive Peek Viewer Sidebar Dashboard (`appOption`)**:
  - Dedicated dashboard invoked via Quick Search / Jump-to-Note (`Open Cat Facts`).
  - Organized into 3 ergonomic cards tailored for narrow sidebars (300px to 420px): Fact Card FIRST, Image Card SECOND, Options Card THIRD.
  - Minimalist header design to maximize vertical reading and note-taking space.
- **Contextual Thematic Classifier (`lib/classifier.js`)**:
  - Real-time semantic analysis classifying facts into 11 distinct feline domains: Sleep & Rest, Vision & Senses, Whiskers & Ears, Kittens & Growth, Speed & Agility, Purring & Vocal, Grooming & Fur, Hunting & Wild, Black Cats & Magic, Ancient History, and Anatomy & Biology.
  - Pairs facts dynamically with authentic feline photos matching the identified topic.
- **70 Visually Audited Cat Photos (`lib/data/images.js`)**:
  - Hand-curated collection of 100% verified cats—zero dogs, zero controllers, zero cars, and zero dead links.
  - Shimmer skeleton loaders prevent visual layout shifts during image loading.
- **Click-to-Copy Fact**:
  - Click anywhere across the fact card body to copy the fact directly to your clipboard.
  - Features visual toast confirmation and iframe-resilient copy fallback.
- **Real-Time Live API Telemetry**:
  - Pulsing `🟢 Live API` status badge showing active upstream provider (`catfact.ninja` or `meowfacts`) and round-trip response latency in milliseconds.
- **Interactive Action Controls & Toggles**:
  - Quick action buttons: **🐾 Next Fact** and **📋 Copy Fact** (copies fact to clipboard with visual toast feedback).
  - Toggles for **Smart Match** (thematic matching vs random) and **Live API** (live network queries vs curated offline library).
  - Accessible keyboard shortcuts: <kbd>Space</kbd> or <kbd>→</kbd> for Next Fact, <kbd>C</kbd> to copy.

### ⚡ Improvements
- **Dataset Debloating (Appendix IV)**:
  - Externalized 139 facts (`facts.json` ~19.8 KB) and 70 photos (`images.json` ~24.6 KB) from the compiled distribution bundle.
  - Inlined starter seeds (`SEED_FACTS`, `SEED_IMAGES`) guarantee instant, zero-latency first paint on offline launch.
  - Dynamic hydration pipeline loads full catalogs from browser `localStorage` and multi-endpoint CDNs (GitHub Raw + jsDelivr).
  - Reduced compiled IIFE bundle from 82.5 KB to 48.8 KB (41% reduction).
- **Pre-Compiled Classification Weights**:
  - Pre-computed keyword scoring tuples during module initialization, eliminating `Object.entries()` allocations and string evaluations inside classification loops.
- **Single-Pass HTML Sanitization**:
  - Optimized `escapeHtml` with single-pass regex replacement map for fast, reliable XSS protection.
- **Compact Sidebar Ergonomics**:
  - Tuned font sizes (11px–13px) and card paddings (7px–11px) to prevent vertical overflow and render comfortably in narrow sidebars.

### 🐛 Bug Fixes
- **5-Tier API Failover Resilience**:
  - Automatic fallback cascade from `catfact.ninja` (6s timeout with `AbortController`) to `meowfacts.herokuapp.com` (4s timeout), browser `localStorage`, inlined starter seeds, and safe default strings.
- **Defensive Host Boundaries**:
  - Defensive payload handling (`payload ?? {}`) and optional chaining in host RPC bridge (`onEmbedCall`).
  - Cascades note insertion safely: `context.replaceSelection` ➔ `app.insertContent` ➔ `app.insertNoteContent({ uuid })`.
- **Bound-Safe Fact Access**:
  - Normalized index retrieval in `getFactByIndex` with wrap-around modulo and non-integer sanitization.

### 📚 Documentation
- **Complete Plugin Manual**: Standardized [README.md](README.md) featuring a 6-step installation guide, settings table, and usage walkthrough.
- **Architecture & Philosophy**: In-depth [CODE_DOCUMENTATION.md](CODE_DOCUMENTATION.md) and [DESIGN_PHILOSOPHY.md](DESIGN_PHILOSOPHY.md).
- **YouTube Production Guide**: Complete [youtube/PREP.md](youtube/PREP.md) with metadata, Gemini 3.8 Flash TTS director prompt, and user-centric walkthrough script.
- **Full JSDoc Standardization**: Complete parameter and return type coverage across all functions.

### 🏗️ Infrastructure & Maintenance
- **Automated Test Suite**: 7 comprehensive Jest test suites covering 76 unit and regression tests (100% pass rate).
- **Security Audit**: Documented in [SECURITY.md](SECURITY.md) with 0 secrets, 0 code injections, sanitized XSS, HTTPS transport, and referrer isolation (`referrerpolicy="no-referrer"`).
- **Open-Source Licensing**: Standardized under GNU General Public License v3.0 (GPL-3.0) with copyright header.

