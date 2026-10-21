# Website #2: Opus

A faithful blue adaptation of the user-selected reference at https://audience-map-six.vercel.app/. The original layout, DM Sans typography, photography/video, diagrams, interactive customer globe, scroll sequences, pricing layout and responsive behavior are retained. Audience Map is renamed Opus; green/lime/sage UI colors become blue.

## Preview and build

From the repository root:

```
npm run dev:2
npm run build:2
```

Preview: http://localhost:4518. Publish only this folder's `dist/`, at its own deployment root. Nothing is imported from website #1.

## Files

- `index.html`: semantic page content and reference layout.
- `site.css`: reference typography/layout, blue color tokens, final Opus overrides.
- `site.js`: reference animations, globe, filters, modal and accordions.
- `template.js`: honest template interactions and destination fallbacks.
- `site.config.js`: optional real HTTPS booking destination.
- `assets/`: deduplicated local images, icons, video and fonts. Names include content hashes for unambiguous references.
- `site.manifest.json`: exact public-file allowlist.

## Template behavior

Data, people, revenue figures and prices are illustrative reference content. This is a frontend template, not a connected analytics service. The default demo form downloads a brief locally; it does not send email, save personal information or book a meeting. Campaign controls explain their preview state instead of pretending to send. A real booking link can be configured in `site.config.js`.

The reference's public self-contained HTML was adapted and separated into maintainable local files. See `SOURCE.md` for provenance. No new imagery was generated.
