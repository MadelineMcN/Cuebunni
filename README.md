# Cuebunni 🐰

**Open the app:** [Cuebunni on GitHub Pages](https://madelinemcn.github.io/Cuebunni/)

A responsive Pilates class programming and personal cue library app for phones, tablets, and desktop browsers.

## Included in this repository
- `index.html` — app shell, original class builder, saved programs and editing logic
- `repertoire.js` — Essential and Intermediate movement catalogs for Mat and Reformer
- `enhancements.js`, `library-ui.js` — appearance preferences, searchable card grid and exercise detail inspector
- `themes.css`, `responsive.css` — Y2K, Sage & Sand, Minimal, tablet/desktop layout and navigation
- `manifest.webmanifest` — Home Screen web-app metadata
- `sw.js` — versioned offline asset cache
- `icon.svg` — temporary bunny icon
- `package.json`, `capacitor.config.json` — starter configuration for potential native iOS packaging

## Features
- Editable exercise library (setup, repetitions/timing, spring notes, cues, awareness prompts, compensations, and adaptations)
- Personal notes and favorite teaching cues
- Sample Reformer class builder and draft sequences for Essential/Intermediate Mat or Reformer
- Filterable and sortable library with responsive card/list view and detailed cue inspector
- Combinable Equipment, Level, Focus (arms/upper body, lower body, abdominals/core, mobility), and Props (Ball, Fitness Circle, Maple Pole, Long Box, Short Box) filters
- Editable exercise-level prop tags, with repertoire-named Long Box and Short Box movements tagged automatically; no assumption that untagged prop variations are official
- Three persistent themes: Glossy Y2K, Sage & Sand, and Minimal
- Tablet/desktop sidebar navigation and flexible two-column workspace
- Local saved programs, backup export/import
- Basic rule-based class check

## Run and install
The page needs to be hosted over HTTPS for reliable mobile browser testing and Home Screen installation. GitHub Pages uses the project URL linked above when Pages is enabled for the repository (Settings → Pages; deploy from `main` / root). Opening downloaded HTML in iOS Files/ChatGPT preview may not execute its JavaScript.

Once hosted, open the HTTPS address in Safari, test all buttons, and use Share → Add to Home Screen. Offline caching is rudimentary and should be tested on device. There is no signed IPA or App Store application yet.

## Important content and safety limitations
This is a **prototype, not a validated STOTT teaching tool**. The original cue text is illustrative, and modifications, spring colors and full repertoire details have *not* been verified as official STOTT instructions. Verify any recommendations against authorized Merrithew materials and qualified instructors before using with clients. Cuebunni is not affiliated with Merrithew.

Local browser storage may be erased. Export backups regularly. Do not store client-identifiable medical information in this prototype. Do not put API credentials in browser code.

## Next steps
1. Deploy a private/test copy to HTTPS and verify interactivity on iPhone/iPad.
2. Perform mobile accessibility and functional tests, including save/import/export.
3. Validate repertoire and spring references against the authorized teaching materials.
4. Add robust backups and app icon raster assets before broader use.
