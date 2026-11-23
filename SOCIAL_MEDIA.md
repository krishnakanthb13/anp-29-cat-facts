# Social Media Release Drafts: Purrfect Cat Facts

## Released: Purrfect Cat Facts v0.0.10 (2026-11-22)

### LinkedIn

Excited to announce the official open-source release of Purrfect Cat Facts v0.0.10 for Amplenote! 🐱🚀

Taking notes and managing daily tasks requires sustained cognitive focus, and small moments of delight can make long writing sessions far more enjoyable. Purrfect Cat Facts combines feline wisdom with clean typography, contextual photo matching, and an ergonomic Peek Viewer sidebar dashboard.

Here is what makes this plugin special:

🐾 Instant Text Insertion: Quickly insert feline facts into any note via the { menu—choose between clean one-liners with live status dots, styled markdown quote cards, or full photo cards.

🧠 Semantic Contextual Classifier: Rather than pairing random photos with arbitrary facts, an NLP keyword engine analyzes fact themes across 11 domains (sleep, night vision, whisker anatomy, ancient Egyptian worship, kitten development, agility) and dynamically pairs each fact with an authentic, matching photo.

📸 70 Audited Cat Photos: Every single image in our collection has been 100% visually verified—zero dogs, zero controllers, zero cars, and zero dead links.

🪟 Interactive 3-Card Peek Viewer Dashboard: Dock a dedicated companion in your Amplenote sidebar tailored for narrow viewports (300px to 420px), complete with click-to-copy anywhere on the card, real-time live API telemetry (latency ms), and keyboard shortcuts (Space / C).

🛡️ 5-Tier Failover Resilience: Connects to live endpoints with automatic fallback to curated offline storage, ensuring it works anywhere—even in airplane mode.

Full open-source repository, documentation, and tests:
https://github.com/krishnakanthb13/anp-29-cat-facts

#Amplenote #Productivity #PKM #OpenSource #SoftwareEngineering #WebDev #JavaScript #NoteTaking #Cats

---

### Twitter / X

Purrfect Cat Facts v0.0.10 for @amplenote is out! 🐱✨

Smart feline facts paired with 70 audited photos via real-time topic matching! Features inline quotes, 1-click sidebar Peek Viewer, and 100% offline resilience.

Repo: https://github.com/krishnakanthb13/anp-29-cat-facts

#amplenote #pkm

---

### Bluesky

Purrfect Cat Facts v0.0.10 is now live for Amplenote! 🐱✨

Bring delightful feline wisdom to your notes:
• Inline text insertions & quote cards
• 70 visually audited authentic cat photos
• Semantic keyword classifier
• Interactive 3-card Peek Viewer dashboard

https://github.com/krishnakanthb13/anp-29-cat-facts

---

### Mastodon

Purrfect Cat Facts v0.0.10 for #Amplenote is officially released! 🐱🐾

An intelligent, delightful companion plugin for your notes:
• Instant text insertion: plain facts, quote blocks, and photo cards
• Real-time semantic classifier matching facts to 70 audited feline photos
• Interactive 3-card Peek Viewer sidebar dashboard
• 5-tier failover with 100% offline resilience
• 100% open-source under GPL v3 with 78 automated tests

Explore the repository:
https://github.com/krishnakanthb13/anp-29-cat-facts

#OpenSource #PKM #JavaScript

---

### Reddit

**Target Subreddits**: `r/Amplenote`, `r/PKM`, `r/NoteTaking`, `r/Productivity`, `r/javascript`, `r/webdev`, `r/SideProject`  
**Suggested Title**: I built Purrfect Cat Facts for Amplenote — an open-source plugin with semantic photo matching, 5-tier offline failover, and a Peek Viewer dashboard

Hey everyone,

Long note-taking and writing sessions can get intense, and sometimes a quick moment of fun makes a huge difference. I built **Purrfect Cat Facts** for Amplenote to combine feline trivia with contextual photography and zero-configuration ease.

#### What it does:
1. **Inline Text Insertions (`insertText`)**: Type `{` anywhere in your note to insert:
   - `Random`: Clean one-liner prefixed with a live indicator dot (`🟢` for live API, `💾` for offline library) with zero markdown link clutter.
   - `Quote Card`: Elegant markdown blockquote with category emoji badge.
   - `Photo Card`: Thematically matched photo paired with the quote card.
2. **Interactive Peek Viewer Sidebar (`appOption`)**: Press `Ctrl+O` / `Cmd+O`, type `Open Peek Viewer`, and a dedicated 3-card dashboard docks right in your sidebar.
   - **Card 1 (Fact)**: Shows the topic badge, fact text, matched keywords, and live latency in milliseconds. Click anywhere on the card to copy to clipboard!
   - **Card 2 (Image)**: 70 hand-curated cat photos (100% verified cats—zero dogs or cars!) with skeleton loaders to prevent layout jank.
   - **Card 3 (Options)**: Next fact, copy fact, and keyboard navigation (<kbd>Space</kbd> for next, <kbd>C</kbd> to copy).

#### Interesting Technical Challenges Solved:
- **Semantic Classification Without Heavy Models**: Running large ML models inside an Amplenote iframe wasn't practical. Instead, I built a lightweight keyword scoring engine with pre-compiled tuples. A fact about night vision automatically pulls a photo with luminous glowing eyes; a fact about ancient Egypt shows a statuesque, regal cat.
- **Dataset Debloating (Bundle Size Optimization)**: Inlining 137 facts and 70 photos bloated the bundle to 82 KB. I externalized them to JSON assets loaded dynamically from CDN/localStorage while inlining a 10-fact/11-photo starter seed for zero first-paint delay. The current bundle is ~64.5 KB with the runtime hydration loaders wired in.
- **5-Tier API Resilience**: Primary fetch to `catfact.ninja` (6s timeout) ➔ Secondary fetch to `meowfacts` (4s timeout) ➔ Browser `localStorage` cache ➔ Inlined seed ➔ Safe default strings. It never throws unhandled errors or freezes the note editor.

The project is fully open-source under GPL v3 with 78 automated Jest tests and a formal security audit.

Check out the repository, setup guide, and compiled bundle here:
https://github.com/krishnakanthb13/anp-29-cat-facts

Would love to hear your thoughts and feedback!

