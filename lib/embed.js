/**
 * @file embed.js
 * @description Generates the interactive Peek Viewer HTML embed for Amplenote,
 * organized into 3 distinct clean cards (Fact Card, Image Card, Options Card)
 * with an ultra-minimal header, responsive light/dark styling, and reliable image handling.
 */

import { SEED_IMAGES } from "./data/images.js";
import { SEED_FACTS } from "./data/facts.js";
import { CATEGORY_DEFINITIONS } from "./classifier.js";

/**
 * Renders the full interactive Peek Viewer HTML application.
 *
 * @param {object} app - Amplenote app interface.
 * @param {object} [options={}] - Optional initial state.
 * @returns {string} Complete HTML document for the iframe.
 */
export function renderCatFactsEmbed(app, options = {}) {
  // Pre-serialize seed images, facts, and category definitions into client script
  const imagesJson = JSON.stringify(SEED_IMAGES);
  const factsJson = JSON.stringify(SEED_FACTS);
  const categoriesJson = JSON.stringify(CATEGORY_DEFINITIONS);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Purrfect Cat Facts</title>
  <style>
    :root {
      --bg-primary: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-subtle: #f1f5f9;
      --bg-card-subtle-hover: #e2e8f0;
      --text-primary: #0f172a;
      --text-secondary: #334155;
      --text-muted: #64748b;
      --accent: #f97316;
      --accent-gradient: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      --accent-hover: #ea580c;
      --accent-active: #c2410c;
      --accent-subtle: #fff7ed;
      --accent-border: #fed7aa;
      --border: #e2e8f0;
      --border-dark: #cbd5e1;
      --success: #10b981;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 10px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 12px 28px -4px rgba(0, 0, 0, 0.12), 0 6px 12px -4px rgba(0, 0, 0, 0.06);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #0b1120;
        --bg-card: #1e293b;
        --bg-card-subtle: #293548;
        --bg-card-subtle-hover: #334155;
        --text-primary: #ffffff;
        --text-secondary: #f1f5f9;
        --text-muted: #cbd5e1;
        --accent: #fb923c;
        --accent-gradient: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
        --accent-hover: #f97316;
        --accent-active: #ea580c;
        --accent-subtle: rgba(251, 146, 60, 0.15);
        --accent-border: rgba(251, 146, 60, 0.35);
        --border: #334155;
        --border-dark: #475569;
        --success: #34d399;
        --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4);
        --shadow-md: 0 4px 10px -1px rgba(0, 0, 0, 0.5);
        --shadow-lg: 0 12px 28px -4px rgba(0, 0, 0, 0.6);
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: var(--border-dark) transparent;
      -webkit-overflow-scrolling: touch;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--bg-primary);
      color: var(--text-primary);
      padding: 7px 9px 24px 9px;
      line-height: 1.45;
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      -webkit-font-smoothing: antialiased;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: var(--border-dark) transparent;
    }

    /* WebKit & Blink custom scrollbar styling */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--border-dark);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-muted);
    }

    .container {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      gap: 7px;
      padding-bottom: 16px;
    }

    /* Enhanced Emoji Typography */
    .emoji-icon {
      font-size: 13.5px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: -1px;
      font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
    }

    .emoji-lg {
      font-size: 16px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: -1px;
      font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", sans-serif;
    }

    /* Minimal Header */
    .header-minimal {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .brand-title-compact {
      font-weight: 800;
      font-size: 12.5px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: -0.01em;
    }

    .brand-title-compact .emoji-lg {
      font-size: 16px;
    }

    .source-link-compact a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 700;
      transition: opacity 0.15s ease;
    }

    .source-link-compact a:hover {
      text-decoration: underline;
      opacity: 0.9;
    }

    /* Shared Card Styles (Bento Card Aesthetic) */
    .card {
      background: var(--bg-card);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
      overflow: hidden;
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      border-color: var(--border-dark);
    }

    /* --- CARD 1: FACT CARD (FIRST) --- */
    .card-fact {
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .fact-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
    }

    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 10px;
      background: var(--bg-card-subtle);
      color: var(--text-primary);
      border: 1px solid var(--border);
      letter-spacing: 0.01em;
    }

    .pill-badge.smart-match {
      background: var(--accent-subtle);
      color: var(--accent);
      border-color: var(--accent-border);
      font-weight: 700;
    }

    .pill-badge.pill-live {
      background: rgba(16, 185, 129, 0.16);
      color: #059669;
      border-color: rgba(16, 185, 129, 0.45);
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
    }

    @media (prefers-color-scheme: dark) {
      .pill-badge.pill-live {
        background: rgba(16, 185, 129, 0.25);
        color: #34d399;
        border-color: rgba(52, 211, 153, 0.55);
      }
    }

    .pill-badge.pill-live.offline {
      background: var(--bg-card-subtle);
      color: var(--text-secondary);
      border-color: var(--border);
    }

    .live-pulse {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .latency-ms {
      font-weight: 700;
      font-size: 10px;
      opacity: 0.95;
    }

    .fact-body {
      min-height: 44px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 11px;
      background: var(--bg-card-subtle);
      border-left: 3px solid var(--accent);
      border-radius: var(--radius-sm);
      transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }

    .fact-body:hover {
      background: var(--bg-card-subtle-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .fact-body:active {
      transform: translateY(1px) scale(0.99);
    }

    .fact-text {
      font-size: 13px;
      line-height: 1.45;
      color: var(--text-primary);
      font-weight: 700;
      transition: opacity 0.2s ease;
    }

    .fact-text.fade {
      opacity: 0.25;
    }

    .fact-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-secondary);
      padding-top: 6px;
      border-top: 1px solid var(--border);
    }

    .context-match-detail {
      color: var(--accent);
      background: var(--accent-subtle);
      border: 1px solid var(--accent-border);
      padding: 2px 6px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 10.5px;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    /* --- CARD 2: IMAGE CARD (SECOND) --- */
    .card-image {
      padding: 0;
      position: relative;
    }

    .image-container {
      position: relative;
      width: 100%;
      height: 200px;
      background: var(--bg-card-subtle);
      overflow: hidden;
    }

    .cat-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .image-container:hover .cat-img.loaded {
      transform: scale(1.03);
    }

    .cat-img.loaded {
      opacity: 1;
    }

    .image-skeleton {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(90deg, var(--bg-card-subtle) 25%, var(--border) 50%, var(--bg-card-subtle) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      color: var(--text-secondary);
      font-size: 11.5px;
      font-weight: 700;
      gap: 5px;
    }

    .image-skeleton.hidden {
      display: none;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .image-caption {
      position: absolute;
      bottom: 7px;
      left: 7px;
      right: 7px;
      font-size: 10.5px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      background: rgba(15, 23, 42, 0.82);
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
    }

    .image-caption::before {
      content: "🐾 ";
      font-size: 13px;
      vertical-align: -1px;
      opacity: 0.95;
    }

    /* --- CARD 3: OPTIONS CARD (THIRD) --- */
    .card-options {
      padding: 9px 11px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .primary-btn-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 11px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      white-space: nowrap;
    }

    .btn:active {
      transform: translateY(1px) scale(0.98);
    }

    .btn-primary {
      background: var(--accent-gradient);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(249, 115, 22, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .btn-primary:hover {
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.38);
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: var(--bg-card-subtle);
      color: var(--text-primary);
      border-color: var(--border);
    }

    .btn-secondary:hover {
      background: var(--bg-card-subtle-hover);
      border-color: var(--border-dark);
      transform: translateY(-1px);
    }

    /* Toggles Bar */
    .toggles-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 9px;
      background: var(--bg-card-subtle);
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      font-size: 11px;
      font-weight: 700;
      color: var(--text-primary);
    }

    .toggle-group {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      color: var(--text-primary);
      cursor: pointer;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 28px;
      height: 16px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background-color: var(--border-dark);
      transition: .22s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 20px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 12px;
      width: 12px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: .22s cubic-bezier(0.16, 1, 0.3, 1);
      border-radius: 50%;
    }

    input:checked + .slider {
      background: var(--accent-gradient);
    }

    input:checked + .slider:before {
      transform: translateX(12px);
    }

    .shortcut-hint {
      text-align: center;
      font-size: 10px;
      font-weight: 700;
      color: var(--text-secondary);
      padding-top: 1px;
    }

    kbd {
      font-family: inherit;
      padding: 1px 5px;
      border-radius: 4px;
      background: var(--bg-card-subtle);
      border: 1px solid var(--border);
      border-bottom: 2px solid var(--border-dark);
      font-size: 9.5px;
      font-weight: 800;
      color: var(--text-primary);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* Toast Notification */
    .toast {
      position: fixed;
      bottom: 14px;
      left: 50%;
      transform: translateX(-50%) translateY(40px);
      background: var(--text-primary);
      color: var(--bg-primary);
      padding: 6px 14px;
      border-radius: 24px;
      font-size: 11.5px;
      font-weight: 700;
      box-shadow: var(--shadow-lg);
      opacity: 0;
      pointer-events: none;
      transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid var(--border);
    }

    #toastIcon {
      font-size: 15px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    :focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Minimal Header Row -->
    <div class="header-minimal">
      <div class="brand-title-compact">
        <span class="emoji-lg">🐾</span>
        <span>Purrfect Cat Facts</span>
      </div>
      <div class="source-link-compact">
        <a href="https://catfact.ninja/" target="_blank" rel="noopener">catfact.ninja</a>
      </div>
    </div>

    <!-- CARD 1: Cat Fact Card (Comes FIRST) -->
    <div class="card card-fact">
      <div class="fact-header">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span class="pill-badge" id="categoryBadge"><span class="emoji-icon">🐾</span> <span>Feline Wisdom</span></span>
          <span class="pill-badge pill-live" id="liveBadge" title="Live feline facts API"><span class="live-pulse"></span><span>Live API</span></span>
        </div>
        <span class="pill-badge smart-match" id="smartBadge"><span class="emoji-icon">✨</span> <span>Contextual</span></span>
      </div>
      <div class="fact-body" id="factBody" title="Click to copy">
        <p class="fact-text" id="factText">Loading your first cat fact...</p>
      </div>
      <div class="fact-footer">
        <span id="factSourceLabel"><span class="emoji-icon">🟢</span> <span>catfact.ninja</span></span>
        <span class="context-match-detail" id="matchDetail"><span class="emoji-icon">✨</span> <span>Theme Matched</span></span>
      </div>
    </div>

    <!-- CARD 2: Cat Image Card (Comes SECOND) -->
    <div class="card card-image">
      <div class="image-container">
        <div class="image-skeleton" id="imgSkeleton">
          <span class="emoji-icon">🐾</span>
          <span>Loading kitty companion...</span>
        </div>
        <img id="catImg" class="cat-img" style="display: none;" referrerpolicy="no-referrer" alt="" />
        <div class="image-caption" id="imageCaption">Cat companion</div>
      </div>
    </div>

    <!-- CARD 3: Options Card (Comes THIRD) -->
    <div class="card card-options">
      <div class="primary-btn-row">
        <button class="btn btn-primary" id="btnNext" title="Shortcut: Spacebar or Right Arrow">
          <span class="emoji-icon">🐾</span>
          <span>Next Fact</span>
        </button>
        <button class="btn btn-secondary" id="btnCopy" title="Shortcut: C">
          <span class="emoji-icon">📋</span>
          <span>Copy Fact</span>
        </button>
      </div>

      <!-- Toggles -->
      <div class="toggles-bar">
        <label class="toggle-group" for="toggleSmart" title="Enable smart semantic matching of cat photos to fact topics">
          <span style="display: inline-flex; align-items: center; gap: 5px;"><span class="emoji-icon">✨</span> <span>Smart Match</span></span>
          <span class="toggle-switch">
            <input type="checkbox" id="toggleSmart" checked />
            <span class="slider"></span>
          </span>
        </label>
        <label class="toggle-group" for="toggleLive" title="Fetch live facts from catfact.ninja or use fast offline library">
          <span style="display: inline-flex; align-items: center; gap: 5px;"><span class="emoji-icon">🌐</span> <span>Live API</span></span>
          <span class="toggle-switch">
            <input type="checkbox" id="toggleLive" checked />
            <span class="slider"></span>
          </span>
        </label>
      </div>

      <div class="shortcut-hint">
        Press <kbd>Space</kbd> for next • <kbd>C</kbd> or click fact to copy
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" id="toast">
    <span id="toastIcon">✅</span>
    <span id="toastMsg">Copied!</span>
  </div>

  <!-- Client-side Logic -->
  <script type="text/javascript">
    (function() {
      // Injected datasets (initial seed for instant offline paint)
      let ALL_IMAGES = ${imagesJson};
      let ALL_FACTS = ${factsJson};
      const CATEGORY_DEFS = ${categoriesJson};

      // Dataset debloating: hydrate full catalogs from localStorage or remote GitHub Raw / jsDelivr
      const FACTS_CACHE_KEY = "CatFacts_Facts_Cache";
      const IMAGES_CACHE_KEY = "CatFacts_Images_Cache";

      try {
        if (typeof localStorage !== "undefined") {
          const cachedF = localStorage.getItem(FACTS_CACHE_KEY);
          if (cachedF) {
            const parsedF = JSON.parse(cachedF);
            if (Array.isArray(parsedF) && parsedF.length > ALL_FACTS.length) {
              ALL_FACTS = parsedF;
            }
          }
          const cachedI = localStorage.getItem(IMAGES_CACHE_KEY);
          if (cachedI) {
            const parsedI = JSON.parse(cachedI);
            if (Array.isArray(parsedI) && parsedI.length > ALL_IMAGES.length) {
              ALL_IMAGES = parsedI;
            }
          }
        }
      } catch (e) {}

      // Background async fetch for initial download if not cached
      setTimeout(async function() {
        if (ALL_FACTS.length <= 10) {
          try {
            const resF = await fetch("https://raw.githubusercontent.com/krishnakanthb13/anp-29-cat-facts/main/lib/data/facts.json");
            if (resF && resF.ok) {
              const dataF = await resF.json();
              if (Array.isArray(dataF) && dataF.length > 0) {
                ALL_FACTS = dataF;
                try { if (typeof localStorage !== "undefined") localStorage.setItem(FACTS_CACHE_KEY, JSON.stringify(dataF)); } catch (e) {}
              }
            }
          } catch (e) {}
        }
        if (ALL_IMAGES.length <= 11) {
          try {
            const resI = await fetch("https://raw.githubusercontent.com/krishnakanthb13/anp-29-cat-facts/main/lib/data/images.json");
            if (resI && resI.ok) {
              const dataI = await resI.json();
              if (Array.isArray(dataI) && dataI.length > 0) {
                ALL_IMAGES = dataI;
                try { if (typeof localStorage !== "undefined") localStorage.setItem(IMAGES_CACHE_KEY, JSON.stringify(dataI)); } catch (e) {}
              }
            }
          } catch (e) {}
        }
      }, 100);

      // State
      let currentFact = "";
      let isCurrentFactLive = true;
      let currentImage = null;
      let currentClassification = null;
      let isSmartMatch = true;
      let isLiveApi = true;
      let isLoading = false;
      let factIndex = Math.floor(Math.random() * ALL_FACTS.length);

      // DOM Elements
      const catImg = document.getElementById("catImg");
      const imgSkeleton = document.getElementById("imgSkeleton");
      const imageCaption = document.getElementById("imageCaption");
      const categoryBadge = document.getElementById("categoryBadge");
      const liveBadge = document.getElementById("liveBadge");
      const smartBadge = document.getElementById("smartBadge");
      const factBody = document.getElementById("factBody");
      const factText = document.getElementById("factText");
      const factSourceLabel = document.getElementById("factSourceLabel");
      const matchDetail = document.getElementById("matchDetail");
      const btnNext = document.getElementById("btnNext");
      const btnCopy = document.getElementById("btnCopy");
      const toggleSmart = document.getElementById("toggleSmart");
      const toggleLive = document.getElementById("toggleLive");
      const toast = document.getElementById("toast");
      const toastMsg = document.getElementById("toastMsg");
      const toastIcon = document.getElementById("toastIcon");

      // Toast notification helper
      function showToast(msg, icon = "✅") {
        toastMsg.textContent = msg;
        if (toastIcon) {
          toastIcon.textContent = icon;
        }
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2200);
      }

      // Helper to format badge strings with prominent emoji typography
      function formatBadgeHtml(badgeStr) {
        if (!badgeStr) return "";
        const spaceIdx = badgeStr.indexOf(" ");
        if (spaceIdx > 0) {
          const emoji = badgeStr.slice(0, spaceIdx);
          const label = badgeStr.slice(spaceIdx + 1);
          return '<span class="emoji-icon">' + emoji + '</span> <span>' + label + '</span>';
        }
        return badgeStr;
      }

      // Classifier implementation in browser
      function classifyFactText(text) {
        if (!text) return { category: "general", label: "General Feline", badge: "🐱 Feline Wisdom", matchedKeywords: [] };
        const lower = text.toLowerCase();
        let bestCategory = null;
        let maxScore = 0;
        let matched = [];

        for (const [key, def] of Object.entries(CATEGORY_DEFS)) {
          let score = 0;
          const currentMatches = [];
          for (const word of def.keywords) {
            if (lower.includes(word)) {
              const weight = word.includes(" ") ? 4 : word.length > 5 ? 2 : 1;
              score += weight;
              currentMatches.push(word);
            }
          }
          if (score > maxScore) {
            maxScore = score;
            bestCategory = key;
            matched = currentMatches;
          }
        }

        if (bestCategory && maxScore > 0) {
          const def = CATEGORY_DEFS[bestCategory];
          return {
            category: bestCategory,
            label: def.label,
            badge: def.badge,
            matchedKeywords: matched
          };
        }

        return {
          category: "general",
          label: "General Feline",
          badge: "🐱 Feline Wisdom",
          matchedKeywords: []
        };
      }

      // Select image for fact
      function pickImage(factText, smartMode, previousUrl) {
        if (!smartMode) {
          const pool = ALL_IMAGES.filter(i => i.url !== previousUrl);
          const choice = pool[Math.floor(Math.random() * pool.length)] || ALL_IMAGES[0];
          return {
            image: choice,
            classification: { category: "random", label: "Random Cat", badge: "🎲 Random Cat", matchedKeywords: [] },
            isContextual: false
          };
        }

        const classification = classifyFactText(factText);
        if (classification.category !== "general") {
          const pool = ALL_IMAGES.filter(i => i.category === classification.category && i.url !== previousUrl);
          const fallbackPool = ALL_IMAGES.filter(i => i.category === classification.category);
          const candidateList = pool.length > 0 ? pool : fallbackPool;
          const choice = candidateList[Math.floor(Math.random() * candidateList.length)] || ALL_IMAGES[0];
          return {
            image: choice,
            classification,
            isContextual: true
          };
        }

        const pool = ALL_IMAGES.filter(i => i.url !== previousUrl);
        const choice = pool[Math.floor(Math.random() * pool.length)] || ALL_IMAGES[0];
        return {
          image: choice,
          classification,
          isContextual: false
        };
      }

      // Fetch fact (online API with secondary live fallback and local library fallback)
      async function fetchFact() {
        if (isLiveApi) {
          const startTime = Date.now();
          // 1. Primary endpoint: catfact.ninja
          try {
            const controller = new AbortController();
            const tid = setTimeout(() => controller.abort(), 6000);
            const res = await fetch("https://catfact.ninja/fact", {
              headers: { "Accept": "application/json" },
              signal: controller.signal
            });
            clearTimeout(tid);
            if (res.ok) {
              const data = await res.json();
              if (data && data.fact) {
                const latency = Date.now() - startTime;
                // console.log("[CatFacts] 🟢 Live API Success (catfact.ninja):", data.fact, "(" + latency + "ms)");
                return {
                  fact: data.fact.trim(),
                  source: "catfact.ninja",
                  isLive: true,
                  latency: latency
                };
              }
            }
          } catch (e) {
            // console.warn("[CatFacts] Primary catfact.ninja API failed:", e.message);
          }

          // 2. Secondary endpoint: meowfacts.herokuapp.com
          try {
            const controller2 = new AbortController();
            const tid2 = setTimeout(() => controller2.abort(), 4000);
            const res2 = await fetch("https://meowfacts.herokuapp.com/", {
              signal: controller2.signal
            });
            clearTimeout(tid2);
            if (res2.ok) {
              const data2 = await res2.json();
              if (data2 && Array.isArray(data2.data) && data2.data[0]) {
                const latency2 = Date.now() - startTime;
                // console.log("[CatFacts] 🟢 Secondary Live API Success (meowfacts):", data2.data[0], "(" + latency2 + "ms)");
                return {
                  fact: data2.data[0].trim(),
                  source: "meowfacts",
                  isLive: true,
                  latency: latency2
                };
              }
            }
          } catch (e2) {
            // console.warn("[CatFacts] Secondary meowfacts API failed:", e2.message);
          }
        }

        // Offline curated library fallback
        factIndex = (factIndex + 1) % ALL_FACTS.length;
        // console.log("[CatFacts] 💾 Serving from local curated collection:", ALL_FACTS[factIndex]);
        return {
          fact: ALL_FACTS[factIndex],
          source: "Curated Library",
          isLive: false,
          latency: 0
        };
      }

      // Display updated fact & image
      async function updateDisplay() {
        if (isLoading) return;
        isLoading = true;
        btnNext.disabled = true;
        factText.classList.add("fade");

        try {
          const { fact, source, isLive, latency } = await fetchFact();
          currentFact = fact;
          isCurrentFactLive = isLive;

          const selection = pickImage(fact, isSmartMatch, currentImage ? currentImage.url : null);
          currentImage = selection.image;
          currentClassification = selection.classification;

          // Safe Image Loading (prevents broken image icon flashing)
          imgSkeleton.classList.remove("hidden");
          catImg.style.display = "none";
          catImg.classList.remove("loaded");
          imageCaption.textContent = currentImage.alt;

          const tempImg = new Image();
          tempImg.referrerPolicy = "no-referrer";
          tempImg.onload = function() {
            catImg.src = currentImage.url;
            catImg.alt = currentImage.alt;
            catImg.style.display = "block";
            catImg.classList.add("loaded");
            imgSkeleton.classList.add("hidden");
          };
          tempImg.onerror = function() {
            catImg.src = ALL_IMAGES[0].url;
            catImg.alt = ALL_IMAGES[0].alt;
            catImg.style.display = "block";
            catImg.classList.add("loaded");
            imgSkeleton.classList.add("hidden");
          };
          tempImg.src = currentImage.url;

          // Update text and badges
          factText.textContent = fact;
          factText.classList.remove("fade");

          // Live API status indicator & footer
          if (isLive) {
            liveBadge.className = "pill-badge pill-live";
            liveBadge.innerHTML = '<span class="live-pulse"></span><span>Live API</span>' + (latency ? ' <span class="latency-ms">(' + latency + 'ms)</span>' : '');
            liveBadge.title = source + (latency ? " (" + latency + "ms)" : "");
            factSourceLabel.innerHTML = '<span><span class="emoji-icon">🟢</span> <span>' + source + '</span>' + (latency ? ' <small style="font-weight:700; opacity:0.9">(' + latency + 'ms)</small>' : '') + '</span>';
          } else {
            liveBadge.className = "pill-badge pill-live offline";
            liveBadge.innerHTML = '<span><span class="emoji-icon">💾</span> <span>Offline Library</span></span>';
            liveBadge.title = isLiveApi ? "Network unavailable, using offline facts" : "Live API toggled off";
            factSourceLabel.innerHTML = '<span><span class="emoji-icon">💾</span> <span>' + source + '</span></span>';
          }

          if (selection.isContextual) {
            categoryBadge.innerHTML = formatBadgeHtml(selection.classification.badge);
            categoryBadge.style.display = "inline-flex";
            smartBadge.style.display = "inline-flex";
            smartBadge.innerHTML = '<span class="emoji-icon">✨</span> <span>Contextual</span>';
            smartBadge.classList.add("smart-match");

            const kw = selection.classification.matchedKeywords.slice(0, 3).join(", ");
            matchDetail.innerHTML = '<span class="emoji-icon">✨</span> <span>' + (kw || "Theme Matched") + '</span>';
            matchDetail.style.display = "inline-flex";
          } else {
            categoryBadge.innerHTML = formatBadgeHtml(isSmartMatch ? "🐱 Feline Wisdom" : "🎲 Random Cat");
            categoryBadge.style.display = "inline-flex";
            smartBadge.style.display = isSmartMatch ? "none" : "inline-flex";
            smartBadge.innerHTML = '<span class="emoji-icon">🎲</span> <span>Random</span>';
            smartBadge.classList.remove("smart-match");
            matchDetail.style.display = "none";
          }
        } catch (err) {
          // console.error("Update error:", err);
        } finally {
          isLoading = false;
          btnNext.disabled = false;
        }
      }

      // Safe image fallback on element directly
      catImg.onerror = function() {
        if (catImg.src !== ALL_IMAGES[0].url) {
          catImg.src = ALL_IMAGES[0].url;
        }
      };

      // Copy text to clipboard
      async function copyFact() {
        if (!currentFact) return;
        const textToCopy = (isCurrentFactLive ? "🟢 " : "") + currentFact;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            showToast("Fact copied to clipboard!", "📋");
            return;
          }
        } catch (e) {
          // console.warn("[CatFacts] navigator.clipboard failed, attempting fallback:", e);
        }

        // Robust fallback for iframes or restricted environments
        try {
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          textarea.style.top = "-9999px";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);
          if (successful) {
            showToast("Fact copied to clipboard!", "📋");
          } else {
            showToast("Copy failed", "⚠️");
          }
        } catch (e2) {
          showToast("Failed to copy", "⚠️");
        }
      }

      // Event Listeners
      btnNext.addEventListener("click", updateDisplay);
      btnCopy.addEventListener("click", copyFact);
      factBody.addEventListener("click", copyFact);

      toggleSmart.addEventListener("change", function(e) {
        isSmartMatch = e.target.checked;
        showToast(isSmartMatch ? "Smart Contextual Match ON" : "Pure Random Image Mode", isSmartMatch ? "✨" : "🎲");
        if (currentFact) {
          const selection = pickImage(currentFact, isSmartMatch, null);
          currentImage = selection.image;
          currentClassification = selection.classification;
          catImg.src = currentImage.url;
          imageCaption.textContent = currentImage.alt;
          if (selection.isContextual) {
            categoryBadge.innerHTML = formatBadgeHtml(selection.classification.badge);
            smartBadge.innerHTML = '<span class="emoji-icon">✨</span> <span>Contextual</span>';
            smartBadge.classList.add("smart-match");
            const kw = selection.classification.matchedKeywords.slice(0, 3).join(", ");
            matchDetail.innerHTML = '<span class="emoji-icon">✨</span> <span>' + (kw || "Theme Matched") + '</span>';
            matchDetail.style.display = "inline-flex";
          } else {
            categoryBadge.innerHTML = formatBadgeHtml(isSmartMatch ? "🐱 Feline Wisdom" : "🎲 Random Cat");
            smartBadge.innerHTML = '<span class="emoji-icon">🎲</span> <span>Random</span>';
            smartBadge.classList.remove("smart-match");
            matchDetail.style.display = "none";
          }
        }
      });

      toggleLive.addEventListener("change", function(e) {
        isLiveApi = e.target.checked;
        showToast(isLiveApi ? "Live API ON (catfact.ninja)" : "Offline Library ON (Curated)", isLiveApi ? "🟢" : "💾");
        updateDisplay();
      });

      // Keyboard navigation
      window.addEventListener("keydown", function(e) {
        if (e.code === "Space" || e.code === "ArrowRight") {
          e.preventDefault();
          updateDisplay();
        } else if (e.code === "KeyC" && (e.ctrlKey || e.metaKey)) {
          // Allow normal copy
        } else if (e.code === "KeyC") {
          copyFact();
        }
      });

      // Initial load
      updateDisplay();
    })();
  </script>
</body>
</html>`;
}
