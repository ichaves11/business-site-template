const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ROOT, catalog, publicFiles } = require('./sites.cjs');
for (const file of fs.readdirSync(__dirname).filter(name => name.endsWith('.cjs'))) execFileSync(process.execPath, ['--check', path.join(__dirname,file)]);
for (const site of catalog()) {
  if (!fs.existsSync(path.join(site.root,'README.md'))) throw new Error(`Website ${site.id} needs a README.`);
  if (site.status === 'planned') { console.log(`Website #${site.id}: reserved`); continue; }
  const files = publicFiles(site), allowed = new Set(files);
  for (const file of files.filter(file => /\.(c?js|mjs)$/.test(file))) execFileSync(process.execPath, ['--check',path.join(site.root,file)]);
  const html = fs.readFileSync(path.join(site.root,'index.html'),'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(url)) continue;
    if (url.startsWith('#')) { if (!ids.has(url.slice(1))) throw new Error(`Broken anchor in website ${site.id}: ${url}`); }
    else if (!allowed.has(url.split(/[?#]/)[0])) throw new Error(`Missing public asset in website ${site.id}: ${url}`);
  }
  console.log(`Website #${site.id}: syntax, public assets and internal links pass`);
}
console.log(`Repository: ${ROOT}`);
