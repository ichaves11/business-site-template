const http=require('node:http');const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end('Bad request')}
const relative=url==='/'?'index.html':url.slice(1);const allowed=['index.html','site.css','site.js','site.config.js','scrollcraft.css','scrollcraft.js'].includes(relative)||relative.startsWith('assets/');const file=path.resolve(root,relative);
if(!allowed||!file.startsWith(root+path.sep)){res.writeHead(404);return res.end('Not found')}
fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data)});
}).listen(4517,'127.0.0.1',()=>console.log('Template preview: http://localhost:4517'));
