const fs=require('node:fs');const path=require('node:path');const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','site.css','site.js','site.config.js','scrollcraft.css','scrollcraft.js','assets'])fs.cpSync(path.join(root,file),path.join(out,file),{recursive:true});
console.log('Static website built in dist/');
