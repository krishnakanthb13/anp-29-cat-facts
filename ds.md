# Code Audit & Remediation — Purrfect Cat Facts (`anp-29-cat-facts`)

**Audit date:** 2026-11-23
**Status:** ✅ Remediated — all High/Medium findings fixed, low-severity items fixed or explicitly accepted
**Scope:** `cat-facts.js`, `lib/` (`api.js`, `classifier.js`, `embed.js`, `utils.js`, `data/*`), `build/`, `test/`, docs

## Verification (post-fix)

| Check | Result |
| :--- | :--- |
| Jest suite | **7 / 7 suites, 78 / 78 tests passing** (~4.2s; network mocked) |
| Embed client script | Parses cleanly (`new Function` syntax check), no template leftovers |
| Compiled bundle | Rebuilt (`node esbuild.js 29`), **66,005 bytes (~64.5 KB)**, parses OK |
| Classifier corpus | `whiskers_senses` false positives dropped **26 → 8**; heart-rate fact now → `anatomy` |
| Dataset | **137** unique facts, **70** images, 70 unique IDs/URLs |

---

## 🔴 High-severity findings

### H1. `insertMarkdownOrFallback` could double-insert content — ✅ FIXED
**File:** `cat-facts.js:64-74`
`replaceSelection` was only treated as success when it returned a truthy value. A host resolving `undefined` after replacing the selection caused the markdown string to be returned, which Amplenote would insert again.

**Resolution:** Success is now defined as "did not throw"; the handler returns `""` after a non-throwing `replaceSelection`, and falls back to raw markdown only when the API is missing or rejects. Added a regression test (`plugin.test.js`) where `replaceSelection` resolves `undefined`.

### H2. Classifier substring matching caused false positives — ✅ FIXED
**Files:** `lib/classifier.js`, `lib/embed.js`
`String.includes` matched `ear`/`hear` inside `heart`, `earthquake`, `earliest`, `year`, `learn`, etc., and overlapping tokens (`eye`/`eyes`, `hear`/`hearing`) double-counted.

**Resolution:** Added a shared `hasWholeWordMatch(text, keyword)` helper (indexOf + boundary inspection, no regex) used by both the Node classifier and the browser embed. Added heart-rate anatomy keywords (`heart beats`, `heartbeat`, `beats`). Regression tests cover heart≠ear, earthquake/earliest, and eye/eyes double-count. Corpus result: `whiskers_senses` 26 → 8, and the heart-rate fact now classifies as `anatomy`.

### H3. Dataset-hydration loaders were dead code — ✅ FIXED
**Files:** `cat-facts.js`, `lib/data/*`, `lib/embed.js`
`loadFacts()`/`loadImages()` were only used by tests; the embed re-implemented hydration with one URL, no timeout, and no validation.

**Resolution:**
- `cat-facts.js` now has a memoized `hydrateDatasets()` warm-up called from every insert action and the Peek Viewer launch, so the full catalog is actually used in production.
- Loaders now use a shared `fetchJsonWithTimeout` (6s abort), shape validation, and a seed-size cache floor.
- The embed now tries **GitHub Raw + jsDelivr**, validates payloads, and uses the same timed fetch helper.
- Keyword data is shared from `CATEGORY_DEFINITIONS` (serialized into the embed), and the browser matcher mirrors the Node helper exactly.

---

## 🟠 Medium-severity findings

### M1. Unit tests made real network calls — ✅ FIXED
`plugin.test.js` now mocks `global.fetch` in `beforeEach` and restores it in `afterEach`. Suite runtime dropped from ~8.8s to ~4.2s and is fully deterministic.

### M2. Dataset fetches had no timeout — ✅ FIXED
`fetchJsonWithTimeout(url, timeoutMs)` moved to `lib/utils.js` and is used by `api.js`, `loadFacts`, `loadImages`, and the embed's client-side hydration. Timers are cleared in `finally`, including on abort/throw.

### M3. Corrupted fact in the dataset — ✅ FIXED
`facts.json[101]` (literal backslashes/quotes) replaced with clean prose. Also fixed the `tempetature` → `temperature` typo.

### M4. Factual drift and duplicates — ✅ FIXED
Reconciled "33" → "34" human vertebrae in `SEED_FACTS`; removed the two redundant facts (duplicate tremble fact and the shorter ear-muscle fact). Dataset is now **137** unique facts.

### M5. `black_cat` category contained non-black images — ✅ FIXED
Moved the calico/tortie, generic wicker-basket, and slate-grey images into `anatomy`. `black_cat` now holds 4 genuine black/tuxedo photos; `anatomy` holds 8.

### M6. Inconsistent cache-acceptance thresholds — ✅ FIXED
Both loaders now validate the cached payload and require it to be **larger than the inlined seed** before accepting it, matching the embed's behavior. A tiny/poisoned cache can no longer degrade the catalog.

### M7. `getFactByIndex` mishandled negative indices — ✅ FIXED
Now uses `((n % len) + len) % len` with `Number.isFinite` sanitization. Tests cover `0`, `1`, `len`, `-1`, and `NaN`.

---

## 🟡 Low-severity / quality findings

| # | Finding | Status |
| :-- | :--- | :--- |
| 1 | Unused `source` option in `formatFactMarkdown` / call sites | ✅ Removed from JSDoc and calls |
| 2 | Unused `icon` field in category definitions | ⏸️ Retained as harmless metadata (not rendered) |
| 3 | Docs claimed bi-directional RPC; embed never calls it | ✅ Docs corrected; `onEmbedCall` documented as a host-driven bridge |
| 4 | `renderEmbed`'s `app` parameter unused | ⏸️ Retained — required by the Amplenote host signature |
| 5 | Space-key double-fire with focused `btnNext` | ✅ Keyboard handler ignores focused inputs/buttons/labels |
| 6 | Smart-Match toggle re-picked with `previousUrl: null` | ✅ Now passes the current image URL |
| 7 | Live-API toggle ignored during in-flight fetch | ✅ `pendingRefresh` queue re-runs after the current load |
| 8 | Abort timers leaked on thrown fetch | ✅ Cleared in `finally` by the shared helper |
| 9 | Inline `JSON.stringify` not safe for `</script>` | ✅ `serializeForScript()` escapes `<`, `>`, `&` |
| 10 | Remote dataset shape trusted | ✅ `isValidFactList` / `isValidImageList` in loaders + embed |
| 11 | `escapeHtml` left non-strings unescaped | ✅ Coerces to string before escaping |
| 12 | Image fallbacks assumed `ALL_IMAGES[0]` exists | ✅ Guarded in both `onerror` handlers |
| 13 | Empty catch blocks hide diagnostics | ⏸️ Intentional per v0.0.13 console cleanup |
| 14 | `excludeFact` not applied to live results | ⏸️ Accepted limitation (live API returns random facts) |
| 15 | meowfacts assumed a string element | ✅ `typeof data2.data[0] === "string"` check added |
| 16 | `sampleRandom` uses reference equality | ⏸️ Acceptable; `getRandomCatImage` resolves by URL to the same reference |
| 17 | Markdown image URL/alt not escaped | ⏸️ Acceptable; curated URLs contain no spaces/parentheses |
| 18 | Nested `.git` inside the plugin folder | ⏸️ Intentional — powers the raw-CDN dataset URL |

---

## Documentation synced

Updated to reflect the remediated state (137 facts, 70 images, ~64.5 KB bundle, 78 tests, whole-word classifier, runtime hydration):

- `README.md`
- `CODE_DOCUMENTATION.md`
- `DESIGN_PHILOSOPHY.md`
- `SECURITY.md` (date bumped; added remote-dataset validation/request-bounds check; corrected `getFactByIndex` description)
- `RELEASE_NOTES.md` (new v0.0.15 entry)
- `SOCIAL_MEDIA.md`
- `test/cat-facts.test.md`
- `youtube/PREP.md`
- `package.json` (version → `0.0.15`)

---

## Remaining / accepted notes

1. **Dual classifier implementation.** The Node classifier and the browser copy still exist as two code paths (the embed must run standalone in an iframe). Mitigated by shared keyword JSON from `CATEGORY_DEFINITIONS`, an identical `hasWholeWordMatch` helper in both, and regression tests. True single-source would require build-time code generation.
2. **Bundle size grew** from the previously documented 48.8 KB to ~64.5 KB because the runtime hydration loaders, dual-CDN/validation logic, and the full embed are now bundled. This is documented everywhere rather than hidden.
3. **`onEmbedCall` notify path** remains host-driven only; the embed intentionally uses the clipboard directly (the "Insert Note" button was removed in v0.0.14).
4. **Empty catch blocks** remain intentional to keep the Amplenote console quiet; they all have documented fallbacks.
