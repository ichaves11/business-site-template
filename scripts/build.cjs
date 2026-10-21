const fs = require('node:fs');
const path = require('node:path');
const { catalog, getSite, publicFiles } = require('./sites.cjs');
function buildSite(site) {
  const files = publicFiles(site); // Validate before touching the previous build.
  const output = path.join(site.root, 'dist');
  fs.rmSync(output, {recursive:true, force:true});
  fs.mkdirSync(output, {recursive:true});
  for (const file of files) {
    const target = path.join(output, file);
    fs.mkdirSync(path.dirname(target), {recursive:true});
    fs.copyFileSync(path.join(site.root, file), target);
  }
  return output;
}
if (require.main === module) {
  try {
    const selected = process.argv[2] || '1';
    const sites = selected === 'all' ? catalog().filter(site => site.status === 'ready') : [getSite(selected)];
    for (const site of sites) console.log(`Built website #${site.id}: ${buildSite(site)}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { buildSite };
