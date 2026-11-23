# YouTube Video Preparation (PREP.md)

This document contains packaging metadata, an optimized Google & Gemini 3.8 Flash TTS director prompt, a user-centric walkthrough script, and a technical maintainer architecture tour for the **Purrfect Cat Facts Plugin** (`anp-29-cat-facts`) in Amplenote.

---

## 1. Packaging Metadata

### Title Options
*   **Option A (Clear & Direct):** How to Use the Purrfect Cat Facts Plugin in Amplenote
*   **Option B (Benefit-driven):** Delight Your Notes with Smart Cat Facts & Contextual Photos in Amplenote!

### Thumbnail Plan
- **Background:** Amplenote dark mode solid background color (`#1E1E1E`).
- **Text Formatting:**
  - **"AMPLENOTE PLUGIN:"** in uppercase, styled in vibrant feline orange (`#F97316`) or Amplenote blue (`#007AFF`), centered at the top.
  - **"PURRFECT CAT FACTS"** positioned directly beneath in stark white, extra-large, bold typography.
- **Visuals / Icons:**
  - Official Amplenote logo/icon anchored in the bottom right corner.
  - An expressive, high-contrast cat visual or playful paw icon (`🐾`) adjacent to the title text.

### Description

🐱 COMPLETE GUIDE TO THE PURRFECT CAT FACTS PLUGIN FOR AMPLENOTE

A straightforward, fact-based walkthrough of the Purrfect Cat Facts plugin for Amplenote. In this video, we explore every single user-facing feature this delightful utility provides—from lightning-fast inline text insertions and formatted quote cards to an interactive 3-card Peek Viewer sidebar dashboard featuring 70 visually audited authentic cat photos, real-time live API telemetry, and an intelligent contextual matching engine that automatically pairs photos with fact topics.

Whether you need a quick burst of joy during intense writing sessions, educational trivia for daily jots, or a relaxing sidebar companion while organizing projects, this plugin offers zero-configuration ease with 100% offline resilience.

🔗 ESSENTIAL LINKS & RESOURCES
* GitHub Repo: https://github.com/krishnakanthb13/anp-29-cat-facts
* Try Amplenote (Sign Up): https://www.amplenote.com/signup?ref=7JGSMI4H0
* Explore My Amplenote Plugins: https://krishnakanthb13.github.io/A/
* Alternative Plugins Page: https://public.amplenote.com/Y3dy91/krishna-plugins
* Browse Official Amplenote Plugins: https://www.amplenote.com/plugins
* Support My Work & Development: https://krishnakanthb13.github.io/S/

🕒 VIDEO TIMESTAMPS
0:00 - Introduction & Overview
0:38 - Zero-Config Setup & Marketplace Availability
1:04 - Quick Text Insertion Commands (insertText)
2:12 - Launching the Interactive Peek Viewer (appOption)
2:48 - Card 1: Fact Card, Live API Telemetry & Click-to-Copy
3:42 - Card 2: Contextual Image Matching & 70 Audited Photos
4:32 - Card 3: Action Controls, Toggles & Keyboard Shortcuts
5:20 - Conclusion & Resources

📋 FEATURE BREAKDOWN

TEXT INSERTION COMMANDS (insertText)
* Random: Inserts a single-line fact prefixed with an unobtrusive status dot (🟢 for Live API, 💾 for Curated Storage) without markdown link clutter.
* Quote Card: Inserts a formatted markdown blockquote displaying the thematic category badge, status indicator, and fact copy.
* Photo Card: Embeds a thematically matched cat photo in clean markdown followed directly by the styled quote card.

PEEK VIEWER SIDEBAR DASHBOARD (appOption)
* Quick Launch: Instant invocation via Quick Search / Jump-to-Note by typing "Open Peek Viewer".
* Ergonomic 3-Card Layout: Tailored specifically for narrow sidebars (300px to 420px) with Fact Card FIRST, Image Card SECOND, and Options Card THIRD.
* Live API Telemetry: Real-time pulsing 🟢 indicator showing response latency in milliseconds and active upstream provider (catfact.ninja or meowfacts), with seamless offline fallback.
* Click-to-Copy: Click anywhere across the fact card body to immediately copy the fact text to your clipboard with instant toast feedback.
* Contextual Thematic Matching: NLP classifier analyzes facts across 11 distinct domains (Sleep, Eyes & Vision, Whiskers & Ears, Kittens, Agility, Purring, Grooming, Hunting, Black Cats, History, and Anatomy) to dynamically match the visual photo.
* 70 Audited Feline Photos: 100% verified authentic cat photos with zero dogs, zero controllers, zero cars, and zero dead links.
* Keyboard Accessibility: Quick browsing via Space or Right Arrow for the next fact, and C to copy to clipboard.

#Amplenote #PKM #ProductivityTools #NoteTaking #CatFacts #PeekViewer #WritingTools #DelightfulProductivity

---

## 2. Gemini 3.8 Flash TTS Director Prompt

Use this complete prompt block directly in **Google AI Studio** (Speech / Audio generation workspace) or via the **Gemini API** using `gemini-3.8-flash-tts` or `gemini-3.8-flash-lite-tts`:

```text
AUDIO PROFILE:
Voice: Warm, friendly, articulate tech educator and productivity enthusiast.
Accent: Crisp, natural, neutral American accent.
Pacing: Steady, conversational tempo with deliberate pauses between features.

SCENE:
Setting: Quiet recording studio booth, close-mic screencast narration with clean room tone and zero echo.

DIRECTOR'S NOTES:
Maintain a conversational, factual delivery without artificial hype.
Use official angle-bracketed pause tags: <long pause> for section transitions.
Never speak bracketed pause words aloud.
Spell out acronyms phonetically: A-P-I, C-D-N, N-L-P, U-R-L, and R-P-C.
Speak command syntax naturally without reciting raw punctuation or code brackets.

TRANSCRIPT:
[warmly] Hello everyone! In this video, we're doing a complete walkthrough of the Purrfect Cat Facts Plugin for Amplenote. Whether you want to drop a fascinating piece of feline trivia into your daily journal, format an elegant quote card with a photo, or keep a delightful interactive companion open in your sidebar while taking notes, this plugin brings joy and polish to your workspace. It features three text insertion commands, an intelligent contextual image classifier, and a dedicated 3-card Peek Viewer dashboard. Let's look at how it works.

<long pause>

[confident] To get started, you can install Purrfect Cat Facts directly from the Amplenote Plugin Marketplace with a single click. Best of all, it requires zero configuration. There are no complicated API keys to obtain and no settings tables to set up. It works immediately out of the box with intelligent defaults and automatic network failover.

<long pause>

[clear enunciate] First, let's explore the text insertion commands. You can invoke these anywhere inside your notes by typing open brace, or by accessing the slash command menu.

The first option is Random Cat Fact. This inserts a clean, single-line fact into your note. It is thoughtfully prefixed with a small status indicator dot: green for a fresh live A-P-I fetch, or a floppy disk icon for an offline curated fact. Notice that it provides clean text without cluttering your notes with unnecessary web links.

The second option is Cat Fact Quote Card. This generates a styled markdown blockquote complete with a thematic category badge, such as Sleep and Rest or Vision and Senses, followed by the fact body. It looks great in reading lists and daily reflections.

The third option is Cat Fact with Photo. This takes note aesthetics to the next level by automatically analyzing the fact, finding a verified cat photo that directly matches the topic, and inserting both the photo and the formatted quote card into your note in one smooth action.

<long pause>

[warmly] Now let's explore the plugin's standout visual feature: the interactive Peek Viewer sidebar dashboard. You can open it at any time from anywhere in Amplenote by pressing Control-O or Command-O, typing "Open Cat Facts", and pressing Enter. The dashboard docks neatly into your sidebar with an ultra-minimal header that preserves maximum vertical reading space.

<long pause>

[confident] The dashboard is organized into three clean cards.

Card One is the Fact Card, positioned right at the top. Here, you see the topic badge, the fact text, and any matched keyword highlights. Up in the header, you will notice a pulsing green Live A-P-I badge that shows the upstream provider and your live round-trip latency in milliseconds. If connectivity drops, it transitions seamlessly to the offline library without interrupting your flow. You can also click anywhere on the fact card body to immediately copy the fact to your clipboard, complete with a clean toast notification.

<long pause>

[thoughtful] Card Two is the Image Card. This is powered by an intelligent contextual matching engine. The plugin maintains a catalog of seventy visually audited, authentic feline photos across eleven thematic categories, including agility, whiskers, kittens, purring, ancient history, and anatomy. When a fact discusses night vision, you see a cat with glowing green eyes. When it talks about Egyptian worship, you see a regal, statuesque cat. An integrated shimmer skeleton prevents layout shift while photos load, and preloaded fallbacks ensure you never encounter a broken image link.

<long pause>

[clear enunciate] Card Three is the Options Card at the bottom.

Here, you have quick action buttons to fetch the next fact or copy the current fact to your clipboard. Below the buttons, you will find two helpful switches: the Smart Match toggle lets you alternate between contextual topic matching and pure random photos, while the Live A-P-I toggle lets you switch between live network queries and the curated offline collection. You can also use handy keyboard shortcuts: tap the Space bar or Right Arrow for the next fact, or press the C key to copy.

<long pause>

[warmly] That covers everything you need to know to enjoy the Purrfect Cat Facts plugin in Amplenote. It combines genuine utility with moments of joy, backed by robust offline reliability. All links to the open-source repository and documentation are in the description below. Thanks for watching, and happy note-taking!
```

---

## 3. Walkthrough Script (Fact-Based & User-Focused)

### **Introduction & Overview**
> **Speaker**: "Hello everyone! In this video, we're doing a complete walkthrough of the **Purrfect Cat Facts Plugin** for Amplenote. Whether you want to drop a fascinating piece of feline trivia into your daily journal, format an elegant quote card with a photo, or keep a delightful interactive companion open in your sidebar while taking notes, this plugin brings joy and polish to your workspace. It features three text insertion commands, an intelligent contextual image classifier, and a dedicated 3-card Peek Viewer dashboard. Let's look at how it works."

---

### **Section 1: Setup & Marketplace Availability**
> **Speaker**: "To get started, you can install Purrfect Cat Facts directly from the **Amplenote Plugin Marketplace** with a single click.
> 
> Best of all, it requires zero configuration. There are no complicated API keys to obtain and no settings tables to set up. It works immediately out of the box with intelligent defaults and automatic network failover."
> 
> **TL;DR Highlights**:
> - **Installation**: Single-click installation via Amplenote Plugin Marketplace.
> - **Configuration**: Zero setup required; instant plug-and-play.
> - **Resilience**: Operates seamlessly online and offline.

---

### **Section 2: Text Insertion Commands (`insertText`)**
> **Speaker**: "First, let's explore the **text insertion commands**. You can invoke these anywhere inside your notes by typing `{` or by accessing the slash command menu.
> 
> **Option 1: Random Cat Fact**
> When you select `{ Random Cat Fact }`, the plugin inserts a clean, single-line fact into your note. It is thoughtfully prefixed with a small status indicator dot: `🟢` for a fresh live API fetch, or a `💾` floppy disk icon for an offline curated fact. Notice that it provides clean text without cluttering your notes with unnecessary web links.
> 
> **Option 2: Cat Fact Quote Card**
> The `{ Cat Fact Quote Card }` command generates a styled markdown blockquote complete with a thematic category badge—such as *💤 Sleep & Rest* or *👁️ Vision & Senses*—followed by the fact copy. It looks great in reading lists and daily reflections.
> 
> **Option 3: Cat Fact with Photo**
> `{ Cat Fact with Photo }` takes note aesthetics to the next level. It automatically analyzes the fact, finds a verified cat photo that directly matches the topic, and inserts both the photo and the formatted quote card into your note in one smooth action."
> 
> **TL;DR Options**:
> - `{ Random Cat Fact }`: Fast single-line insertion with live/offline status indicator.
> - `{ Cat Fact Quote Card }`: Styled markdown blockquote with topic emoji badge.
> - `{ Cat Fact with Photo }`: Responsive markdown image paired with topic quote card.

---

### **Section 3: Launching the Interactive Peek Viewer (`appOption`)**
> **Speaker**: "Now let's explore the plugin's standout visual feature: the **interactive Peek Viewer sidebar dashboard**.
> 
> You can open it at any time from anywhere in Amplenote by pressing <kbd>Ctrl</kbd>+<kbd>O</kbd> or <kbd>Cmd</kbd>+<kbd>O</kbd>, typing **`Open Cat Facts`**, and pressing <kbd>Enter</kbd>. The dashboard docks neatly into your sidebar with an ultra-minimal header that preserves maximum vertical reading space."
> 
> **TL;DR Invocation**:
> - **Shortcut**: Press <kbd>Ctrl</kbd>+<kbd>O</kbd> / <kbd>Cmd</kbd>+<kbd>O</kbd> (or <kbd>Ctrl</kbd>+<kbd>J</kbd> / <kbd>Cmd</kbd>+<kbd>J</kbd>).
> - **Command**: Type `Open Cat Facts` and press <kbd>Enter</kbd>.
> - **Viewport**: Fits comfortably in compact sidebars (300px to 420px).

---

### **Section 4: Card 1 — Fact Card, Telemetry & Click-to-Copy**
> **Speaker**: "The dashboard is organized into three clean cards.
> 
> **Card One is the Fact Card**, positioned right at the top. Here, you see the topic badge, the fact text, and any matched keyword highlights. 
> 
> Up in the header, you will notice a pulsing `🟢 Live API` badge that shows the upstream provider (`catfact.ninja` or `meowfacts`) and your live round-trip latency in milliseconds. If connectivity drops, it transitions seamlessly to the offline library without interrupting your flow. 
> 
> You can also click anywhere on the fact card body to immediately copy the fact to your clipboard, complete with a clean toast notification."
> 
> **TL;DR Features**:
> - **Telemetry**: Live latency in milliseconds and active API endpoint provider.
> - **Click-to-Copy**: Click the fact text anywhere for instant clipboard copy.
> - **Keyword Attribution**: Displays the specific keywords detected in the fact.

---

### **Section 5: Card 2 — Contextual Matching & 70 Audited Photos**
> **Speaker**: "Card Two is the **Image Card**.
> 
> This is powered by an intelligent contextual matching engine. The plugin maintains a catalog of seventy visually audited, authentic feline photos across eleven thematic categories—including agility, whiskers, kittens, purring, ancient history, and anatomy. 
> 
> When a fact discusses night vision, you see a cat with glowing green eyes. When it talks about Egyptian worship, you see a regal, statuesque cat. An integrated shimmer skeleton prevents layout shift while photos load, and preloaded fallbacks ensure you never encounter a broken image link."
> 
> **TL;DR Engine**:
> - **11 Thematic Themes**: Sleep, Eyes, Whiskers, Kittens, Agility, Purr, Grooming, Hunting, Black Cats, History, Anatomy.
> - **100% Cat Verified**: 70 hand-curated photos; 0 dogs, 0 controllers, 0 cars.
> - **Layout Stability**: Shimmer skeleton loader eliminates visual jank.

---

### **Section 6: Card 3 — Action Controls, Toggles & Keyboard Shortcuts**
> **Speaker**: "Card Three is the **Options Card** at the bottom.
> 
> Here, you have quick action buttons:
> - Click **🐾 Next Fact** to load a new fact and matching image.
> - Click **📋 Copy Fact** to copy text with toast confirmation.
> 
> Below the buttons, you will find two helpful switches:
> - The **Smart Match** toggle lets you alternate between contextual topic matching and pure random photos.
> - The **Live API** toggle lets you switch between live network queries and the curated offline collection.
> 
> You can also use handy keyboard shortcuts: tap the <kbd>Space</kbd> bar or <kbd>→</kbd> Right Arrow for the next fact, or press the <kbd>C</kbd> key to copy."
> 
> **TL;DR Controls**:
> - **Actions**: Next Fact and Copy Fact.
> - **Smart Match Toggle**: Contextual topic matching vs. random browsing.
> - **Live API Toggle**: Live network queries vs. offline curated storage.
> - **Shortcuts**: <kbd>Space</kbd> / <kbd>→</kbd> for Next; <kbd>C</kbd> to copy.

---

### **Section 7: Conclusion & Wrap-Up**
> **Speaker**: "That covers everything you need to know to enjoy the Purrfect Cat Facts plugin in Amplenote. It combines genuine utility with moments of joy, backed by robust offline reliability. All links to the open-source repository and documentation are in the description below. Thanks for watching, and happy note-taking!"

---

## 4. Maintainer Code Walkthrough (Technical Architecture)

*Note: This section is strictly for developers and maintainers interested in the codebase architecture and internal implementation.*

### **Architecture Overview**
The plugin is structured as an ESM modular codebase compiled into a single IIFE bundle via `esbuild`:

```
anp-29-cat-facts/
├── cat-facts.js                  # Main plugin entry point (Amplenote actions & defensive RPC)
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
├── test/                        # 7 Jest test suites (78 passing tests, 100% coverage)
└── build/
    └── cat-facts.compiled.js    # Production-ready IIFE bundle for Amplenote
```

### **Key Technical Innovations**
1. **5-Tier Failover Resilience (`lib/api.js`)**:
   - Primary: `catfact.ninja/fact` (6s timeout with `AbortController`).
   - Secondary: `meowfacts.herokuapp.com/` (4s timeout).
   - Tertiary: Browser `localStorage` cache (137 facts).
   - Quaternary: Inlined starter seed (`SEED_FACTS`, 10 facts) for zero-latency initial paint.
   - Quinary: Safe static string fallback ensuring catch blocks never throw uncaught exceptions.
2. **Pre-Compiled Classification Weights (`lib/classifier.js`)**:
   - Keyword weights are pre-compiled at module initialization into static tuples (`weight = keyword.includes(" ") ? 4 : keyword.length > 5 ? 2 : 1`).
   - Eliminates `Object.entries()` allocations and string evaluations inside high-frequency classification loops.
3. **Dataset Debloating (Appendix IV)**:
   - Full catalogs (`facts.json` ~19.2 KB and `images.json` ~24.0 KB) are externalized during bundling via `esbuild.js` (`external: ["*.json"]`).
   - Current compiled bundle is ~64.5 KB (includes the runtime hydration loaders) while supporting multi-endpoint CDN hydration from GitHub Raw and jsDelivr with `localStorage` persistence.
4. **Defensive Host Boundaries (`cat-facts.js`)**:
   - Host RPC bridge (`onEmbedCall`) defensively sanitizes incoming payloads (`payload ?? {}`).
   - Cascades note insertion gracefully: `context.replaceSelection` ➔ `app.insertContent` ➔ `app.insertNoteContent({ uuid })`.
5. **Comprehensive Test Suite**:
   - 7 test suites covering API resilience, classification accuracy (including whole-word boundary regressions), DOM embed generation, dataset integrity, markdown formatting, and host RPC handlers (78/78 passing tests).

