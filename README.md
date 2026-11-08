# Cuebunni 🐰

A mobile-first Pilates class programming and personal cue library app.

## Project goals
- Build and edit Pilates exercise records with setup, movement instructions, equipment, spring information, breath, body-awareness prompts, common compensations, modifications, and personal teaching notes.
- Generate and customize class sequences.
- Save classes and export or import backups.
- Run offline in an installable iPhone-friendly Progressive Web App.
- Preserve the pink-and-purple Y2K desktop-inspired design.

## Status
**Early prototype; not a signed iOS app.** This private repository is initialized for source control. The previously generated offline prototype is **not yet migrated into this repository**.

## Source verification policy
The app is not affiliated with Merrithew or STOTT PILATES. STOTT repertoire names, spring recommendations, and modifications must be verified against authorized materials, with source and edition recorded. Unverified information must be visibly labeled. Instructor-written cues must not be presented as official wording.

## Safety and data
- No client-identifiable health information in example records.
- Keep saved classes and custom cues local-first with exportable backups.
- Do not embed API keys in frontend JavaScript.
- Treat generated programming guidance as instructor-review material, not certification or safety approval.

## Setup roadmap
1. Import the corrected Cuebunni prototype into `www/`.
2. Add iOS mobile interaction tests.
3. Verify spring colors and official exercise details against authorized manuals.
4. Deploy as HTTPS PWA only after button functionality is confirmed.
