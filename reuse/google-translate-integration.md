# Google Translate Implementation + Badge Hiding

Reference for porting the existing Vite Google Translate setup (including the forced-hiding of Google's UI/badge) into the Next.js AI experience.

## Entry Point (`index.html`)
- `<script src="/js/gt.js"></script>` is loaded in `<head>` so the helper functions exist before Google injects its widget.
- Inline style hides the Google tooltip container: `#goog-gt-tt { display: none !important; }`.
- A hidden mount lives near the end of `<body>`: `<div style="position: absolute; visibility: hidden"><div id="google_translate_element2"></div></div>` so the default translator dropdown never shows.
- Google loads via `<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2"></script>`; the callback is defined in `gt.js`.

## Core Logic (`public/js/gt.js`)
- On load, sets `googtrans` cookies based on `localStorage.selectedLanguage` to pre-seed Google before its script initializes.
- Exposes globals: `googleTranslateElementInit2` (creates `google.translate.TranslateElement` targeting `google_translate_element2` with `includedLanguages`), `doGTranslate(lang_pair)`, and `GTranslateGetCurrentLang()`.
- `doGTranslate` prefers driving the hidden `.goog-te-combo` select; falls back to directly writing `googtrans` cookies (with host + root-domain variants) and reloads. English selection clears cookies. All selections persist to `localStorage`.
- Guards React from Google DOM mutations by monkey-patching `Node.prototype.removeChild/insertBefore` and providing `safeReloadForTranslation`.
- On `window.load`, re-applies any saved language after a React render delay and retries if the cookie did not stick.

## React Hooks/Components Using It
- `src/components/settings/language-selector.tsx` reads `GTranslateGetCurrentLang`, writes `selectedLanguage`, and calls `window.doGTranslate('en|xx')` from a radio list of languages.
- `src/components/TranslateButton.tsx` is a simpler dropdown that writes `googtrans=/en/{lang}` cookies and reloads.
- `src/components/TranslationErrorBoundary.tsx` catches DOM errors (removeChild/insertBefore conflicts, goog-te stack traces) and auto-recovers.

## Forcing the Google Badge/UI Hidden
- `index.html` hides the tooltip via `#goog-gt-tt { display: none !important; }` and keeps the translator mount `visibility: hidden`.
- `src/index.css` aggressively hides Google UI: `.goog-te-banner-frame`, `.skiptranslate`, `.goog-te-banner`, `.goog-tooltip`, `.goog-text-highlight`, plus the newer `.VIpgJd-*` class names are all set to `display: none !important;`. Body `top` is reset to avoid layout shifts.

## Porting Notes for Next.js AI
- Add the same hidden translate mount and Google script in `_document.tsx` or a client layout; keep the callback name `googleTranslateElementInit2` or update both places.
- Serve `gt.js` (or an equivalent) from `public/js/gt.js` so it runs before Google’s script; preserve the cookie + retry logic and the React DOM guards.
- Copy the CSS rules that hide the badge/banner/tooltips into the global stylesheet for Next.js to keep the UI invisible.
- Wire the language selector UI to `window.doGTranslate` / `GTranslateGetCurrentLang` and persist `selectedLanguage` in `localStorage` for continuity across reloads.
