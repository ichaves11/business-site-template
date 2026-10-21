# Redesign verification

## Delivered design

Reusable business template with a neutral Studio identity. Uses Nate Herk's installed Scroll Craft skill and the unchanged Scroll Craft engine. Reference sites were visited in headless Chrome and their opening/intermediate states inspected. No generated images or paid generation calls.

Grammar: guided service configurator. The bespoke Growth Route carries the chosen goal through the visual path, recommended actions, remembered browser selection and downloadable project brief. Fingerprint differs from the prior filmic template on all six dimensions. The choice and alternative grammars are documented in BRIEF.md.

## Browser checks

Final `dist/` served from the actual local checkout and tested in headless Google Chrome:

- Desktop 1440 × 1000; phone 390 × 844; compact phone 360 × 640; reduced motion 1440 × 900.
- No horizontal overflow, page errors, or HTTP failures in those runs.
- All three route choices update their selected state, copy, diagram and brief.
- Selected goal survives reload. Storage errors are handled without interrupting the page.
- Download contains the selected route, entered project name and correct action list. No information is sent to a server.
- Service accordion changes the corresponding art; FAQ opens; mobile menu closes on selection and Escape.
- Keyboard skip link and 18 subsequent controls have visible focus outlines.
- Sampled static text/button contrast ratios range from 4.52:1 to 11.08:1. Transparent/photo backgrounds still require visual assessment; these calculations are not a full accessibility audit.
- No-JavaScript view retains readable content and a downloadable starter brief.
- Pointer-state screenshots show small changes in the hero's foreground labels.
- Nate's harness produced desktop, phone and reduced-motion section contact sheets. All were inspected. These are flow sections with no cue-based text, so the harness's dead-scroll and cue-contrast results do not establish timed-scene behavior or whole-page contrast.

## Refinements and evidence

An initial test read the native details toggle before its asynchronous event; the test now waits for the rendered state and passes. An initial keyboard test continued beyond the last control into browser chrome; it now stops at that boundary.

Visual inspection found the compact-phone heading wrapped to three lines; the mobile type ramp was corrected and the final 360px capture shows two complete lines. The final mobile contact sheet supersedes its earlier typography capture.

Observed visual sequence: calm → recognition → agency → confidence → clarity → resolve. The opening reads calmer than the intended curiosity, consistent with the requested professional direction. The route remains the largest section and primary interactive moment; the ending retains the selected choice and a real download.

Evidence: `../../lab/website-01/redesign/verification.json`, `accessibility.json`, desktop/mobile/compact screenshots, and `scroll-desktop/`, `scroll-reduced/`, `scroll-mobile-final/` contact sheets. Development evidence is ignored and excluded from `dist/`.

## Build checks and limits

`npm run check`, `npm run build`, and `git diff --check` pass. Public build contains only the HTML, styles, scripts and assets. Runtime files are unchanged. Existing untracked package-lock.json was preserved.

Not tested on physical iOS/Android hardware or Safari. No booking provider, backend, email delivery, analytics or hosting deployment is configured. The template has no invented testimonials or performance statistics. Copy and legal details should be adapted to the business using it.
