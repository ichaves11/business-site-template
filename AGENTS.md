# Repository rules

- Website #1 is the approved design. Do not change its runtime files when working on #2 or #3 unless the user explicitly asks.
- All UI, images, styles, scripts, fonts and runtime configuration belong inside their own `websites/NN-*` folder. Never import from another website.
- Root `scripts/` contains development tooling only. Use `websites.json` for distinct preview ports and site status.
- Include public files explicitly in the site's `site.manifest.json`; exclude docs, source maps, credentials, tests and lab artifacts.
- Keep website-specific notes and briefs in that website's folder. Put browser evidence under `lab/website-NN/`.
- Namespace new browser-storage keys by website ID. Deploy each `dist/` as an independent website root.
- Run `npm run check`, `npm test`, and the affected site's build after structural changes. Verify the affected site in a browser. Do not claim untested physical-device support.
- Use Nate Herk's Scroll Craft skill for authored website work, available locally at `/Users/ignaciochaves/.claude/plugins/marketplaces/nateherk/plugins/nateherk-design/skills/scroll-craft/SKILL.md`.
