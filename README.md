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
Invoke via the `{` menu or quick command bar anywhere inside your notes:
- **`Random Cat Fact`**: Inserts a clean fact prefixed with a live indicator dot (`🟢` for live API, `💾` for offline curated storage) without markdown URL clutter:
  ```markdown
  🟢 Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.
  ```
- **`Cat Fact Quote Card`**: Inserts an elegant markdown quote block with the category badge and status indicator:
  ```markdown
  > 🟢 **💤 Sleep & Rest**
  > Cats spend approximately 70% of their lives sleeping, which equates to around 13 to 16 hours every day.
  ```
- **`Cat Fact with Photo`**: Inserts the fact together with a thematically matched cat photo in markdown:
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

When a fact is retrieved (either live from `catfact.ninja` or from local storage), the semantic classifier identifies core feline topics:

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
Tier 3: Browser Storage Cache (localStorage: 139 facts) ──(Empty)─┐
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

## 📦 Installation in Amplenote

1. Create a new note in your Amplenote workspace named **`Plugin: Cat Facts`**.
2. Add a table with the plugin metadata:
   | Key | Value |
   | :--- | :--- |
   | `name` | `Cat Facts` |
   | `icon` | `pets` |
   | `description` | `Smart cat facts with contextual photos powered by catfact.ninja` |
3. In the code block below the metadata table, paste the bundled plugin code from [`build/cat-facts.compiled.js`](build/cat-facts.compiled.js).
4. Save the note. The plugin is now ready!

---

## 💻 Architecture & Code Structure

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
│       ├── facts.js             # 139 verified curated cat facts & debloating loader
│       ├── facts.json           # Debloated facts catalog
│       ├── images.js            # 70 verified authentic feline images with metadata
│       └── images.json          # Debloated images catalog
├── test/
│   ├── api.test.js              # API unit tests (mocked & failover)
│   ├── classifier.test.js       # Classifier categorization & weight tests
│   ├── facts.test.js            # Facts dataset integrity & bounds tests
│   ├── images.test.js           # 70-photo catalog validation tests
│   ├── plugin.test.js           # Plugin actions & onEmbedCall payload tests
│   └── utils.test.js            # Single-pass escaping & markdown formatting tests
└── build/
    └── cat-facts.compiled.js    # Production-ready IIFE bundle for Amplenote
```

---

## 🛠️ Development & Testing

```bash
# Run all unit tests for this plugin (from repository root)
node --experimental-vm-modules node_modules/jest/bin/jest.js anp-29-cat-facts/test

# Or from within the anp-29-cat-facts directory
npm test

# Compile and bundle for Amplenote
node esbuild.js 29
```

---

## 📜 License

MIT License. Free to use, modify, and distribute.
