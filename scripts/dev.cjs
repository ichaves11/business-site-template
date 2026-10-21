const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { getSite, publicFiles } = require('./sites.cjs');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.md':'text/plain; charset=utf-8','.mp4':'video/mp4','.json':'application/json'};
function createServer(site) {
  const allowed = new Set(publicFiles(site));
  return http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); return res.end(); }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); return res.end('Bad request'); }
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!allowed.has(relative)) { res.writeHead(404); return res.end('Not found'); }
    const absolute = path.join(site.root, relative);
    // Check the real target as well, in case a file was replaced after startup.
    try { if (fs.realpathSync(absolute) !== absolute) throw new Error('Unexpected symlink'); }
    catch { res.writeHead(404); return res.end('Not found'); }
    fs.readFile(absolute, (error, data) => {
      if (error) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {'Content-Type':types[path.extname(absolute)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff'});
      res.end(req.method === 'HEAD' ? undefined : data);
    });
  });
}
if (require.main === module) {
  try {
    const site = getSite(process.argv[2] || '1');
    const server = createServer(site);
    server.on('error', error => {
      console.error(error.code === 'EADDRINUSE' ? `Port ${site.port} is already in use. Stop the previous preview with Ctrl+C, then rerun this command.` : error.message);
      process.exitCode = 1;
    });
    server.listen(site.port, '127.0.0.1', () => console.log(`Website #${site.id}: ${site.name}\nhttp://localhost:${site.port}\nSource: ${site.root}`));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { createServer };
