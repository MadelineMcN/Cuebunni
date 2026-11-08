# Cuebunni 🐰

A mobile-first Pilates class programming and personal cue library app.

## Included in this repository
- `index.html` — current corrected, interactive Y2K mobile-first prototype (HTML/CSS/JavaScript in one file)
- `manifest.webmanifest` — Home Screen web-app metadata
- `sw.js` — initial offline asset cache
- `icon.svg` — temporary bunny icon
- `package.json`, `capacitor.config.json` — starter configuration for potential native iOS packaging

## Prototype features
- Editable exercise library (setup, repetitions/timing, spring notes, cues, awareness prompts, compensations, and adaptations)
- Personal notes and favorite teaching cues
- Sample Reformer class builder with editable sequences
- Local saved programs, backup export/import
- Basic rule-based class check

## Run and install
The page needs to be hosted over HTTPS for reliable mobile browser testing and Home Screen installation. The repository **is not published as a website**. Opening downloaded HTML in iOS Files/ChatGPT preview may not execute its JavaScript.

Once hosted, open the HTTPS address in Safari, test all buttons, and use Share → Add to Home Screen. Offline caching is rudimentary and should be tested on device. There is no signed IPA or App Store application yet.

## Important content and safety limitations
This is a **prototype, not a validated STOTT teaching tool**. The original cue text is illustrative, and modifications, spring colors and full repertoire details have *not* been verified as official STOTT instructions. Verify any recommendations against authorized Merrithew materials and qualified instructors before using with clients. Cuebunni is not affiliated with Merrithew.

Local browser storage may be erased. Export backups regularly. Do not store client-identifiable medical information in this prototype. Do not put API credentials in browser code.

## Next steps
1. Deploy a private/test copy to HTTPS and verify interactivity on iPhone/iPad.
2. Perform mobile accessibility and functional tests, including save/import/export.
3. Validate repertoire and spring references against the authorized teaching materials.
4. Add robust backups and app icon raster assets before broader use.
