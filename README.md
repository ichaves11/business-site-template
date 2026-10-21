# Three website templates

Each website owns its HTML, styles, scripts, assets, configuration, documentation and `dist/` output. Root scripts only select, check, serve and package a site.

| Website | Folder | Preview command | Local URL |
|---|---|---|---|
| #1 · Approved business template | `websites/01-business` | `npm run dev:1` | http://localhost:4517 |
| #2 · Opus | `websites/02-template` | `npm run dev:2` | http://localhost:4518 |
| #3 · Reserved | `websites/03-template` | `npm run dev:3` | http://localhost:4519 |

Run commands from this repository's root. `npm run dev` remains an alias for website #1. A reserved website gives a clear message until it has been implemented. Stop an older preview with Ctrl+C before restarting it after this reorganization.

## Commands

- `npm run build:1`, `build:2`, `build:3`: build one site into its own `dist/`.
- `npm run build:all`: build every ready site.
- `npm run check`: validate scripts, catalog, links and public assets.
- `npm test`: check independent previews/builds and cross-site isolation.

Publish only the chosen site's `dist/` folder. Each site is designed to be hosted at the root of its own domain/deployment. Do not deploy the repository root. Ports are unique; browser storage for new templates must use site-specific keys.

## Structure

```
websites.json             # Site status, directory and preview port
scripts/                  # Shared development tools, no website UI
websites/
  01-business/            # Approved website #1
  02-template/            # Opus, website #2
  03-template/            # Reserved for website #3
lab/                      # Ignored browser evidence, grouped by website
```

Site-specific public files are explicitly listed in `site.manifest.json`. Documentation and test artifacts are excluded from builds and previews. No website imports styles, scripts or assets from another website.

## Saved approved version

Git tag `website-01-approved` identifies the approved website before reorganization. Its runtime files are preserved byte-for-byte in `websites/01-business/`. Site-specific instructions are in each folder's README.
