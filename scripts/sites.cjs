const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
function catalog(root = ROOT) {
  const sites = JSON.parse(fs.readFileSync(path.join(root, 'websites.json'), 'utf8'));
  const ids = new Set(), ports = new Set(), directories = new Set();
  for (const site of sites) {
    if (!Number.isInteger(site.id) || ids.has(site.id) || ports.has(site.port) || directories.has(site.directory)) throw new Error('Website IDs, ports and directories must be unique.');
    if (!Number.isInteger(site.port) || site.port < 1024 || site.port > 65535) throw new Error(`Invalid port for website ${site.id}`);
    if (!/^websites\/[a-z0-9-]+$/.test(site.directory)) throw new Error(`Invalid directory for website ${site.id}`);
    if (!['ready', 'planned'].includes(site.status)) throw new Error(`Invalid status for website ${site.id}`);
    ids.add(site.id); ports.add(site.port); directories.add(site.directory);
  }
  return sites.map(site => ({...site, root: path.join(root, site.directory)}));
}
function getSite(id = '1', root = ROOT) {
  if (!/^\d+$/.test(String(id))) throw new Error(`Unknown website: ${id}`);
  const site = catalog(root).find(site => site.id === Number(id));
  if (!site) throw new Error(`Unknown website: ${id}`);
  if (site.status !== 'ready') throw new Error(`Website #${site.id} is reserved and has not been built yet. Website #1 is available with npm run dev:1.`);
  return site;
}
function publicFiles(site) {
  const manifest = JSON.parse(fs.readFileSync(path.join(site.root, 'site.manifest.json'), 'utf8'));
  const files = [];
  function visit(relative) {
    if (typeof relative !== 'string' || !relative || relative.split('/').some(part => !part || part.startsWith('.')) || path.isAbsolute(relative) || relative.includes('\\')) throw new Error(`Invalid public path: ${relative}`);
    const absolute = path.join(site.root, relative), stat = fs.lstatSync(absolute);
    if (stat.isSymbolicLink()) throw new Error(`Public assets must not be symlinks: ${relative}`);
    if (stat.isDirectory()) for (const child of fs.readdirSync(absolute)) visit(`${relative}/${child}`);
    else if (stat.isFile()) files.push(relative);
    else throw new Error(`Unsupported file: ${relative}`);
  }
  if (!Array.isArray(manifest.public) || !manifest.public.includes('index.html')) throw new Error('The public manifest must include index.html.');
  for (const relative of manifest.public) visit(relative);
  return [...new Set(files)];
}
module.exports = { ROOT, catalog, getSite, publicFiles };
