# Security Audit — Purrfect Cat Facts (`anp-29-cat-facts`)

**Date**: 2026-11-23  
**Auditor**: Agent (`anp_security`)  
**Scope**: `anp-29-cat-facts/` (`cat-facts.js`, `lib/`, `build/`, `test/`, `package.json`)

---

## Summary

| Severity | Count | Status |
|:---|:---:|:---|
| 🔴 **Critical** | 0 | None found |
| 🟡 **Warning**  | 0 | None found |
| 🟢 **Passed**   | 8 | All checks passed |

---

## Findings

### 🔴 Critical
*No critical vulnerabilities found.*

### 🟡 Warning
*No warnings found.*

### 🟢 Passed

1. **Hardcoded Secrets & Credential Leakage**:
   - Automated regex search across all source, library, and test files detected zero hardcoded API keys, bearer tokens, passwords, private keys, or secrets.
   - Upstream endpoints (`https://catfact.ninja/fact` and `https://meowfacts.herokuapp.com/`) are public, read-only feline information APIs that require no authentication tokens or user credentials.

2. **Code Execution & Injection Defense**:
   - Zero occurrences of `eval()`, `new Function()`, `document.write()`, or string-evaluated timer patterns (`setTimeout("...", ...)`).
   - No unauthorized dynamic `<script>` tag injections or untrusted remote code evaluation.

3. **Cross-Site Scripting (XSS) Prevention & Output Encoding**:
   - Dynamic error messaging in `renderEmbed` is strictly sanitized via `escapeHtml(err?.message || String(err))` using a single-pass regex dictionary replacement (`/[&<>"']/g`).
   - In the interactive Peek Viewer embed (`lib/embed.js`), dynamic text nodes (`factText.textContent`, `imageCaption.textContent`, `toastMsg.textContent`) strictly utilize safe `.textContent` setters, preventing script injection from untrusted remote API payloads.
   - Dynamic badge rendering (`formatBadgeHtml`) operates strictly on validated internal metadata defined in `CATEGORY_DEFINITIONS`.
   - Inline seed/category JSON is injected through `serializeForScript()`, which escapes `<`, `>`, and `&` (`\u003c`, `\u003e`, `\u0026`) so no dataset value can terminate the surrounding `<script>` element.

4. **Network Transport Security & Referrer Isolation**:
   - All network queries (live endpoints, remote debloated JSON assets on GitHub/jsDelivr, and image CDNs on Unsplash/TheCatAPI) are exclusively enforced over HTTPS.
   - All image elements explicitly specify `referrerpolicy="no-referrer"` to prevent referer leakage of the host Amplenote environment to third-party CDNs.
   - Upstream links include `rel="noopener"` to prevent reverse tab-jacking.
   - `AbortController` signals enforce strict timeouts (6 seconds for primary, 4 seconds for secondary) preventing hung sockets or resource exhaustion.

5. **Data Privacy & Zero Exfiltration**:
   - Strict read-only interaction with external endpoints: outbound queries are clean HTTP GET requests with zero query parameters or request bodies.
   - Zero user notes, tags, note titles, or client metadata are ever transmitted or logged.
   - Zero analytics, telemetry, tracking pixels, or third-party tracking scripts.

6. **Defensive Host Boundaries & RPC Hardening**:
   - `onEmbedCall` incorporates defensive nullish normalization (`const data = payload ?? {};`) and optional chaining (`app?.context`, `app?.insertContent`, `app?.alert`), preventing unhandled runtime exceptions on malformed RPC messages or restricted host permissions.
   - Numeric index inputs in `getFactByIndex` are sanitized against `NaN` or non-integer values via `Number.isFinite(index) ? Math.floor(index) : 0` and wrapped with a true modulo (`((n % len) + len) % len`), so negative indices resolve to the end of the list.

7. **Remote Dataset Validation & Request Bounds**:
   - Both the runtime loaders (`lib/data/*`) and the embed validate every remote payload (`isValidFactList` / `isValidImageList`) before use, rejecting malformed arrays that could produce broken `undefined` image sources.
   - Every dataset request is bounded by an `AbortController` timeout (`fetchJsonWithTimeout`, 6s in the loaders, 5s in the embed) and falls back to the next CDN or the inlined seeds.
   - `localStorage` caches are only accepted when they are valid and larger than the inlined seed, preventing a truncated or poisoned small cache from degrading the catalog.

8. **Supply Chain & Production Bundle**:
   - The compiled distribution bundle (`build/cat-facts.compiled.js`) has **zero external production runtime dependencies**.
   - Offline resilience is guaranteed via lightweight inlined seed constants (`SEED_FACTS` and `SEED_IMAGES`), ensuring 100% functionality even in zero-network environments.
   - Repository-level development dependencies (`jest`, `eslint`, `prettier`, `esbuild`) are confined to local developer tooling and do not enter the production runtime sandbox.

