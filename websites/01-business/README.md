# Business website template

A responsive, buildless business landing page inspired by the composition and interaction quality of Foresee and Audience Map. Built with Nate Herk's Scroll Craft skill and its unchanged runtime.

## Preview

From the repository root, run `npm run dev:1`, then open http://localhost:4517. No build step or API credentials are required.

## Make it yours

- `site.config.js`: brand, page title, description and optional HTTPS booking URL. When a booking URL is set, the two primary “Let’s build” links point there and use `bookingLabel`. Otherwise they open the working growth planner.
- `index.html`: headlines, services, process and questions. “Studio” is a neutral placeholder identity, not a real business claim.
- `site.css`: palette tokens, typography and responsive layouts.
- `site.js`: the three growth routes and downloadable project brief.
- `assets/`: bundled photograph, font, mark and license notices. Replace imagery and mark for your brand. The star is an editable template mark.

The route selector is stored in this browser only. The brief is generated locally as a text download. There is no backend, analytics, email delivery or fake submission success. A real booking service can be connected through the configuration.

## Files to publish

`index.html`, `site.css`, `site.js`, `site.config.js`, `scrollcraft.css`, `scrollcraft.js` and `assets/`.

`npm run build:1` copies exactly these public files to `dist/`. Never publish the repository root or `lab/`, which contains development evidence. The generated `dist/` is suitable for static hosting.

## Checks

`npm run check` validates application JavaScript. The redesign was also checked in headless Chrome at 1440px, 390px and 360px, with reduced motion and JavaScript disabled. See `VERIFICATION.md` for results and limitations.

## Credits

See `assets/CREDITS.md`, `assets/Manrope-OFL.txt` and `assets/ScrollCraft-LICENSE.txt`.
