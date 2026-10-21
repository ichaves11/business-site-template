# Verification — Opus

Verified October 21, 2026 in automated local Chrome.

- Desktop 1440×1000, mobile 390×844, compact 360×640, and reduced-motion 1440×900 passed.
- No JavaScript errors, failed HTTP responses, external runtime requests, or document horizontal overflow across all 13 content sections.
- Customer segment filters, desktop zoom, FAQ toggles, mobile menu and Escape, required form fields, local brief download and modal dismissal passed. Zoom controls follow the reference and are hidden on mobile.
- Built `dist/` loads successfully; template dialog has an accessible name and closes with Escape.
- At 1440×1000, all 18 measured reference elements match section width, height, vertical position, font family and font size. This measures layout fidelity, not pixel identity; branding, palette and honest template interactions intentionally differ.
- `npm run check`, `npm test`, and `npm run build:all` passed. Isolation tests cover public allowlists, traversal protection, separate preview roots and independent build output.
- All 13 website #1 public files remain byte-for-byte identical to Git tag `website-01-approved`.

Evidence is in ignored `../../lab/website-02/`: viewport screenshots, `results.json`, `fidelity.json`, `package.json`, and browser scripts. Physical phones and Safari were not tested. This is an illustrative frontend template with no live analytics, campaign delivery or booking backend.
