import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { build } from "vite";
const temp=mkdtempSync(join(tmpdir(),"ss-bundle-"));
function files(root,path=root){return readdirSync(path,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(root,join(path,entry.name)):[relative(root,join(path,entry.name))]).sort();}
try{
  await build({configFile:"vite.lib.config.js",build:{outDir:temp},logLevel:"error"});
  const committed=files("web"),rebuilt=files(temp);
  if(JSON.stringify(committed)!==JSON.stringify(rebuilt))throw new Error("web/ has different files. Run npm run build:web.");
  for(const name of committed){
    if(name.endsWith(".js")&&name!=="slap_stickers.js"&&!name.startsWith(".lazy/"))throw new Error(`Unexpected ComfyUI extension: ${name}`);
    if(!readFileSync(join("web",name)).equals(readFileSync(join(temp,name))))throw new Error(`Stale bundle: ${name}. Run npm run build:web.`);
  }
  console.log(`Bundle matches source (${committed.length} files); workers and chunks are in .lazy/.`);
}finally{rmSync(temp,{recursive:true,force:true});}
