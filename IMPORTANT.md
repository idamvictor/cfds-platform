# Multi-language Support Documentation

This document provides instructions on how to re-enable multi-language support in the application. The multi-language support has been temporarily disabled to use English only.

## Changes Made

The following changes were made to disable multi-language support:

1. Commented out Google Translate script tags in `index.html`
2. Commented out the Language Selector component in the Settings page

## How to Revert Changes

Follow these steps to re-enable multi-language support:

### 1. Restore Google Translate scripts in index.html

Open `index.html` and uncomment the Google Translate script tags:

```html
<!-- Change this: -->
<!-- Google Translate script commented out as per requirement to use English only -->
<!-- <script src="/js/gt.js"></script> -->

<!-- To this: -->
<script src="/js/gt.js"></script>
```

And further down in the file:

```html
<!-- Change this: -->
<!-- Google Translate elements commented out as per requirement to use English only
<div style="position:absolute;visibility:hidden;">
  <div id="google_translate_element2"></div>
</div>

<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2" onload="if(window.patchReactDOMForTranslate) window.patchReactDOMForTranslate()"></script>
-->

<!-- To this: -->
<div style="position:absolute;visibility:hidden;">
  <div id="google_translate_element2"></div>
</div>

<script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit2" onload="if(window.patchReactDOMForTranslate) window.patchReactDOMForTranslate()"></script>
```

### 2. Restore Language Selector in Settings Page

Open `src/pages/Preferences/settings-page.tsx` and:

1. Uncomment the LanguageSelector import:

```tsx
// Change this:
// import { LanguageSelector } from "@/components/settings/language-selector"; // Commented out as per requirement to use English only

// To this:
import { LanguageSelector } from "@/components/settings/language-selector";
```

2. Uncomment the Language Section in the JSX:

```tsx
// Change this:
{/* Language Section - Commented out as per requirement to use English only
<Card className="bg-card text-card-foreground">
  <CardHeader>
    <CardTitle>DASHBOARD LANGUAGE</CardTitle>
  </CardHeader>
  <CardContent>
    <LanguageSelector />
  </CardContent>
</Card>
*/}

// To this:
{/* Language Section */}
<Card className="bg-card text-card-foreground">
  <CardHeader>
    <CardTitle>DASHBOARD LANGUAGE</CardTitle>
  </CardHeader>
  <CardContent>
    <LanguageSelector />
  </CardContent>
</Card>
```

## Additional Information

The multi-language support in this application is implemented using Google Translate. The translation functionality is managed by the `gt.js` script, which handles:

1. Setting up translation cookies
2. Initializing the Google Translate widget
3. Changing languages based on user selection
4. Patching React DOM operations to prevent conflicts with Google Translate

When re-enabling multi-language support, make sure to test the application thoroughly to ensure that the translation functionality works correctly and doesn't cause any DOM-related errors.
