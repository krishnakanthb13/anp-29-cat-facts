# Design Philosophy: Purrfect Cat Facts

## 1. Core Principles

### 1.1 Delight Meets Utility
Plugins should not merely provide functionality—they should provide moments of genuine joy during long writing and thinking sessions. Purrfect Cat Facts balances playful feline charm with clean, elegant typography that looks right at home in a professional note-taking environment.

### 1.2 The Contextual Matching Challenge
A generic cat fact plugin might display an arbitrary cat photo alongside a fact. However, pairing a fact about **ancient Egyptian temple worship** with a picture of a **noble Bastet-like statuesque cat**, or a fact about **night vision** with an **intense green-eyed nocturnal glance**, creates a cohesive multimedia experience.

### 1.3 Offline-First Reliability
External APIs can experience latency, network interruptions, or rate limits. A high-quality Amplenote plugin must work anywhere: on an airplane, in a coffee shop with spotty Wi-Fi, or during offline note-taking. 
- The plugin seeds an initial library of 139 rich, curated facts.
- It attempts live retrieval from `catfact.ninja` whenever connectivity permits.
- If any network failure occurs, the transition to local storage is 100% silent and instantaneous.

### 1.4 Non-Destructive Workspace Safety
- **Read-Safe Execution**: The plugin never deletes, overwrites, or modifies notes without explicit user initiation.
- **Explicit Insertion**: Text and image insertions only occur when explicitly triggered by the user via the `{` menu options (`Random`, `Quote Card`, `Photo Card`).
- **Zero Tracking / Data Privacy**: No user notes, titles, or tags are logged, tracked, or transmitted. Live API requests contain zero personal data or identifiable headers.

### 1.5 Ergonomic UI Design for Narrow Sidebars
Amplenote's Peek Viewer is often kept as a compact sidebar (300px to 450px wide). Every element in our dashboard is optimized for narrow viewports:
- Fixed-height aspect-ratio image container prevents layout shifts.
- Single-column card structure ensures no horizontal overflow.
- High-contrast, theme-adaptive CSS variables blend seamlessly with Amplenote's light and dark themes.
- Accessible keyboard shortcuts (<kbd>Space</kbd> for next fact, <kbd>C</kbd> for copy) allow rapid browsing without touching the mouse.

### 1.6 Performance-Safe & Defensive Engineering
Amplenote plugins execute within a rich note-taking environment where keystrokes, note switches, and editing actions must never experience lag.
- **Zero-Overhead Semantic Analysis**: Classification avoids runtime object allocations (`Object.entries()`) and scans against pre-compiled static keyword weights.
- **Single-Pass Sanitization**: String escaping utilizes single-pass regular expression lookups ($O(N)$) rather than chained multi-pass replacements.
- **Defensive Host Boundaries**: Host RPC calls (`onEmbedCall`) and API handlers normalize incoming payloads defensively (`payload ?? {}`) and use optional chaining, ensuring that mobile environments or missing note context fail gracefully without unhandled exceptions.

### 1.7 Markdown Fidelity & Clean Note Insertion
Amplenote's note editor parses strings returned from `insertText` as plain text, escaping markdown syntax characters with backslashes (`\>`, `\*\*`, `!\[`) to prevent accidental note formatting.
- **Native GFM Preservation**: Rich formatting (such as blockquotes `> ` and contextual photos `![alt](url)`) must be inserted through `app.context.replaceSelection(markdown)` and return `""` (empty string) to satisfy the string contract and prevent host null reference errors.
- **Zero-Clutter Delivery**: This ensures quotes and images render directly as native ProseMirror rich-text elements without backslash artifacts.
- **Resilient Fallback**: If `replaceSelection` is unavailable or throws, the plugin gracefully falls back to returning raw markdown, ensuring no user action ever results in silent failure.


