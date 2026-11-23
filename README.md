# 🐱 Purrfect Cat Facts (`anp-29-cat-facts`)

> **An intelligent, delightful Amplenote plugin delivering fascinating feline wisdom with contextual photo matching, powered by [catfact.ninja](https://catfact.ninja/).**
>
> 🐾 **Features**: Text insertion, interactive Peek Viewer dashboard (3 distinct cards, minimal header), 70 visually verified 100% feline photos, real-time semantic classifier, and live API integration with 100% offline fallback.

---

## 🌟 Overview

**Purrfect Cat Facts** brings feline joy and education into your Amplenote workspace. Whether you want to quickly drop a surprising cat fact into a jot, format a beautiful quote card with a photo, or browse cats in the sidebar while taking notes, this plugin provides an effortless, responsive, and gorgeous experience.

The plugin solves the ultimate challenge: **it understands what each cat fact is about** (e.g. sleeping habits, night vision, whisker anatomy, ancient Egyptian history, kitten development, or acrobatic agility) and dynamically selects a photo that matches that topic!

Every single image in the collection has been **100% visually audited and confirmed**: zero dogs, zero controllers, zero cars, and zero broken links — only authentic, adorable cats!

---

## 🚀 Key Features

### 1. ✍️ Text Insertion (`insertText`)
Invoke via the `{` menu or quick command bar anywhere inside your notes (rendered cleanly via `app.context.replaceSelection` with zero markdown backslash escaping):
- **`Random`**: Inserts a clean fact prefixed with a live indicator dot (`🟢` for live API, `💾` for offline curated storage) without markdown URL clutter:
  ```markdown
  🟢 Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.
  ```
- **`Quote Card`**: Inserts an elegant, native markdown quote block with category badge and status indicator:
  ```markdown
  > 🟢 **💤 Sleep & Rest**
  > Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.
  ```
- **`Photo Card`**: Inserts the fact together with a thematically matched cat photo in markdown followed directly by the quote card:
  ```markdown
  ![💤 Sleep & Rest](https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80)

  > 🟢 **💤 Sleep & Rest**
  > Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.
  ```

---

### 2. 🪟 Interactive Peek Viewer Sidebar (`appOption`)
Open the dedicated Cat Facts dashboard directly in Amplenote's **Peek Viewer** sidebar via `Jump to Note` or `Quick Search`:
- **Organized into 3 Clean Cards**: Cat Fact Card FIRST, Image Card SECOND, Options Card THIRD.
- **Ultra-Minimal Header**: Compact branding to maximize vertical viewing space in narrow sidebars.
- **70 Visually Audited Cat Photos**: 100% verified authentic domestic and wild felines across 11 thematic categories. Zero dogs, zero controllers, zero dead links.
- **✨ Intelligent Contextual Matching**: Analyzes the fact text in real-time, extracts keywords, scores categories, and presents an image that directly reflects what the fact describes.
- **📋 Click-to-Copy Anywhere on the Fact**: Simply click anywhere on the fact card body to copy the fact directly to your clipboard, or click the **Copy Fact** button. Includes instant visual toast confirmation and an iframe-resilient copy fallback.
- **🟢 Real-Time Live API Indicator**: Distinct pulsing `🟢 Live API` status badge showing the exact upstream provider (`catfact.ninja` or `meowfacts`) and round-trip response latency in milliseconds.
- **🌐 Dual Live Endpoints + Offline Resilience**: Queries `https://catfact.ninja/fact` first with automatic fallback to `https://meowfacts.herokuapp.com/` and an offline curated library.
- **🔀 Smart Match & Live API Toggles**: Switch between live queries vs offline library, and intelligent topic matching vs pure random photos.
- **⌨️ Keyboard Shortcuts**:
  - <kbd>Space</kbd> or <kbd>→</kbd>: Fetch next fact & image.
  - <kbd>C</kbd>: Copy current fact to clipboard.
- **🌓 Adaptive Theme**: Automatically responds to Amplenote's light and dark modes with modern typography, smooth image fade-ins, and skeleton loaders.

---

### 3. 🧠 The Contextual Matching Engine

When a fact is retrieved (either live from `catfact.ninja` or from local storage), the semantic classifier identifies core feline topics. Keywords are matched on **whole-word boundaries** (never substrings), so a fact about the `heart` is never mistaken for one about `ears`, and overlapping tokens such as `eye`/`eyes` are not double-counted:

| Category | Emoji Badge | Sample Keywords | Example Fact |
| :--- | :--- | :--- | :--- |
| **Sleep & Rest** | `💤 Sleep & Rest` | *sleep, nap, snooze, yawn, dream, hours a day* | "Cats spend 70% of their lives sleeping..." |
| **Vision & Senses** | `👁️ Vision & Senses` | *eyes, vision, pupils, night vision, tapetum lucidum* | "Cats have a tapetum lucidum behind their retina..." |
| **Whiskers & Ears** | `📡 Whiskers & Ears` | *whiskers, vibrissae, ears, hearing, jacobson, scent* | "Whiskers roughly match cat body width..." |
| **Kittens & Growth** | `🍼 Kittens & Growth` | *kitten, baby cat, kindle, litter, newborn* | "A group of kittens is called a kindle..." |
| **Speed & Agility** | `⚡ Speed & Agility` | *sprint, speed, mph, jump, leap, height, climb, fall* | "Domestic cats can sprint up to 30 mph..." |
| **Purring & Vocal** | `😻 Purring & Vocal` | *purr, meow, vocal, frequency, healing, hiss, chatter* | "Purring vibrates at 20 to 140 Hz..." |
| **Grooming & Fur** | `🧼 Grooming & Fur` | *groom, lick, tongue, papillae, hairball, bezoar* | "A cat's tongue has backward-facing spines..." |
| **Hunting & Wild** | `🐾 Hunting & Wild` | *hunt, prey, mice, stalk, lion, tiger, predator* | "When stalking prey, cats keep their heads level..." |
| **Black Cats** | `🐈‍⬛ Black Cats & Magic` | *black cat, superstition, luck, folklore, witch* | "In Japan, black cats are symbols of good fortune..." |
| **Ancient History** | `🏛️ Ancient History` | *egypt, ancient, bastet, goddess, worship, sailor* | "In ancient Egypt, cats were revered as sacred..." |
| **Anatomy & Biology** | `🦴 Anatomy & Biology` | *bone, skeleton, collarbone, tail, claw, sweet, heart* | "Cats lack a rigid collarbone..." |

---

### 4. 🛡️ Offline-First Reliability & 5-Tier Failover Architecture

If external network endpoints or datasets are unreachable (airplane mode, API downtime, rate limits, or corporate firewalls), the plugin seamlessly falls back through **5 layers of defense**:

```
[User Requests Content]
        │
        ▼
Tier 1: Primary Live API (catfact.ninja) ──(Down / Timeout > 6s)──┐
                                                                  │
                                                                  ▼
Tier 2: Secondary Live API (meowfacts) ────(Down / Timeout > 4s)──┐
                                                                  │
                                                                  ▼
Tier 3: Browser Storage Cache (localStorage: 137 facts) ──(Empty)─┐
                                                                  │
                                                                  ▼
Tier 4: Inlined Starter Seed (SEED_FACTS: 10 curated facts) ─────► [Render Fact]
                                                                  │
                                              (Extreme Runtime Error)
                                                                  │
                                                                  ▼
Tier 5: Safe Hardcoded Fallback String ──────────────────────────► "🟢 Cats sleep for roughly 70%..."
```

* **Live Endpoints with `AbortController`**: Primary query to `https://catfact.ninja/fact` (6s timeout) with automatic failover to `https://meowfacts.herokuapp.com/` (4s timeout).
* **Guaranteed Inlined Seed**: Even on a fresh machine with zero internet and cleared cache, 10 curated facts (`SEED_FACTS`) and 11 authentic cat photos (`SEED_IMAGES`) are compiled directly into the bundle.
* **Preloaded Image Fallback**: Photos are pre-loaded in memory via `new Image()`. If any image URL fails, `onerror` immediately swaps to `ALL_IMAGES[0]` while an animated skeleton shimmer prevents layout shifts.
* **Status Telemetry**: Live fetches display `🟢 Live API (latency ms)`, while offline fallbacks display `💾 Offline Library`.
* **100% Client-Side Privacy**: No user notes, cursor contents, or workspace metadata are ever transmitted externally.

---

## 📦 Installation

Follow these steps to install and activate **Purrfect Cat Facts** in your Amplenote workspace:

1. **Create a Plugin Note**: Create a new note in Amplenote named **`Purrfect Cat Facts Plugin`**.
2. **Setup Metadata Table**: At the very top of the note, create a table with the following rows:

   | Field | Value |
   | :--- | :--- |
   | `name` | Purrfect Cat Facts |
   | `description` | Intelligent feline wisdom with contextual photo matching, powered by catfact.ninja |
   | `icon` | pets |

3. **Add Settings**: No additional configuration or API keys are required! The plugin operates zero-configuration out of the box with live API resilience and local fallback defaults.
4. **Insert Code Block**: Below the metadata table, create a single JavaScript code block (type ` ```javascript `).
5. **Paste Compiled Code**: Copy the entire content from [`build/cat-facts.compiled.js`](build/cat-facts.compiled.js) and paste it inside that code block.
6. **Activate**: Go to **Account Settings** -> **Plugins**, and select the **`Purrfect Cat Facts Plugin`** note you just created.

---

## 💡 Usage Guide

### 1. Text Insertion Commands (`insertText`)
Type `{` inside any Amplenote note, jot, or task to open the plugin insert menu:

| Command | Output Description | Example Format |
| :--- | :--- | :--- |
| **`Random`** | Inserts a clean, single-line fact prefixed with an unobtrusive status dot (`🟢` for Live API, `💾` for Curated Library). | `🟢 Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.` |
| **`Quote Card`** | Inserts a styled blockquote card displaying the semantic topic badge, status indicator, and fact body. | `> 🟢 **💤 Sleep & Rest**`<br>`> Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.` |
| **`Photo Card`** | Pairs the fact with a thematically matched cat photo in responsive markdown followed by the quote card. | `![💤 Sleep & Rest](https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=700&auto=format&fit=crop&q=80)`<br><br>`> 🟢 **💤 Sleep & Rest**`<br>`> Cats spend approximately 70% of their lives sleeping...` |

### 2. Global Search Command (`appOption`)
- Press <kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Cmd</kbd>+<kbd>O</kbd> (or <kbd>Ctrl</kbd>+<kbd>J</kbd> / <kbd>Cmd</kbd>+<kbd>J</kbd>) to open Amplenote's Quick Search / Jump-to-Note.
- Type **`Open Peek Viewer`** and press <kbd>Enter</kbd>.
- The dedicated **Peek Viewer** dashboard will instantly dock in your sidebar (or open in an embed frame).

### 3. Interactive Peek Viewer Dashboard
The dashboard is structured into 3 distinct cards designed for optimal vertical ergonomics in narrow sidebars (300px to 420px):

1. **Card 1 (Fact Card - FIRST)**:
   - **Category Pill Badge**: Displays the detected topic (e.g. `💤 Sleep & Rest`, `👁️ Vision & Senses`, `📡 Whiskers & Ears`).
   - **Live API Telemetry**: Pulsing `🟢 Live API` indicator showing latency in milliseconds and provider (`catfact.ninja` or `meowfacts`), or `💾 Offline Library` fallback.
   - **Click-to-Copy**: Click anywhere on the fact card to immediately copy the fact text to your clipboard.
   - **Context Keyword Attribution**: Displays matched keywords that triggered the classification.
2. **Card 2 (Image Card - SECOND)**:
   - **Contextually Matched Cat Photo**: Displays a verified authentic cat photo matching the fact's topic.
   - **Instant Image Shimmer**: Smooth skeleton shimmer prevents layout shift during image loading.
   - **Preloaded Failover**: Automatic fallback to alternative verified photos if a network hiccup occurs.
3. **Card 3 (Options & Actions Card - THIRD)**:
   - **🐾 Next Fact Button**: Fetches a new fact with matched photo.
   - **📋 Copy Fact Button**: Copies the fact to clipboard with visual toast confirmation.
   - **Smart Match Toggle**: Switch between contextual topic matching vs. pure random photos.
   - **Live API Toggle**: Switch between live network retrieval vs. offline curated storage.

### 4. Keyboard Shortcuts
When the Peek Viewer dashboard is focused:
- <kbd>Space</kbd> or <kbd>→</kbd> : Fetch the next cat fact and image.
- <kbd>C</kbd> : Copy the current fact text to your clipboard.

---

## 💻 Architecture & Technical Details

### 1. Modular Codebase Structure
The codebase follows an ESM modular design separating API communication, classification logic, UI generation, and data persistence:

```
anp-29-cat-facts/
├── cat-facts.js                  # Main plugin entry point (Amplenote actions & defensive RPC)
├── package.json                  # Scripts and package configuration
├── lib/
│   ├── api.js                   # catfact.ninja/meowfacts client with unified timeout & fallback
│   ├── classifier.js            # Semantic classifier with pre-compiled keyword weights
│   ├── embed.js                 # Peek Viewer HTML/CSS/JS dashboard generator
│   ├── utils.js                 # Single-pass HTML escaping, markdown formatting, array helpers
│   └── data/
│       ├── facts.js             # 137 verified curated cat facts & debloating loader
│       ├── facts.json           # Debloated facts catalog (external asset)
│       ├── images.js            # 70 verified authentic feline images with metadata
│       └── images.json          # Debloated images catalog (external asset)
├── test/
│   ├── api.test.js              # API unit tests (mocked & failover)
│   ├── classifier.test.js       # Classifier categorization & weight tests
│   ├── embed.test.js            # Peek Viewer DOM & RPC interface tests
│   ├── facts.test.js            # Facts dataset integrity & bounds tests
│   ├── images.test.js           # 70-photo catalog validation tests
│   ├── plugin.test.js           # Plugin actions & onEmbedCall payload tests
│   └── utils.test.js            # Single-pass escaping & markdown formatting tests
└── build/
    └── cat-facts.compiled.js    # Production-ready IIFE bundle for Amplenote
```

### 2. Dataset Debloating & Asset Hydration
In compliance with the [Dataset Debloating Guide](../../common-issues-and-fixes/dataset-debloating.md):
- Large JSON datasets (`facts.json` ~19.8 KB and `images.json` ~24.6 KB) are externalized during bundling to prevent bundle bloat.
- Inlined starter seeds (`SEED_FACTS` with 10 facts, `SEED_IMAGES` with 11 photos) ensure instant zero-latency first paint on offline launch.
- `loadFacts()` and `loadImages()` employ a 4-stage hydration pipeline: In-Memory Cache ➔ Browser `localStorage` ➔ Multi-CDN remote fetch (GitHub Raw + jsDelivr) ➔ Seed Fallback.

### 3. Bundling & Compilation
The plugin uses `esbuild` to compile ESM modules into a single self-contained Immediately Invoked Function Expression (IIFE) ready for pasting into an Amplenote note:
- **Command**: `node esbuild.js 29`
- **Output Target**: `build/cat-facts.compiled.js`
- **Optimizations**: Target `es2020`, minified whitespace; current bundle size ~64.5 KB (includes the runtime hydration loaders, dual-CDN logic, and embed dashboard).

---

## 🛠️ Development & Testing

```bash
# Run all 7 Jest test suites (from repository root)
node --experimental-vm-modules node_modules/jest/bin/jest.js anp-29-cat-facts/test

# Or run tests from within the anp-29-cat-facts directory
npm test

# Check code formatting and linting
npx prettier --check anp-29-cat-facts/
npx eslint anp-29-cat-facts/

# Rebuild compiled distribution bundle
node esbuild.js 29
```

---

## 📜 License

GNU General Public License v3.0 (GPL-3.0). See [LICENSE](LICENSE) for full terms and conditions. Free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation.
