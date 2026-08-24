import { chromium } from '@playwright/test';
import { createReadStream, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(process.argv[2]||join(root,'review-artifacts'));
const themes=['institution','terminal','whitepaper','brutalist','command','protocol','calm','archive','swiss','bauhaus','glass','solarpunk','mono','cyber','space','zen','retroos','datascape','blueprint','newspaper','memphis','noir','biotech','clay','museum','industrial','hologram','cartographic'];
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.png':'image/png'};

const server=await new Promise(resolveServer=>{
  const instance=createServer((request,response)=>{
    const requestPath=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const relative=normalize(requestPath==='/'?'index.html':requestPath.replace(/^\/+/,''));
    const file=join(root,relative);
    if(!file.startsWith(root)){response.writeHead(403).end();return;}
    try{if(!statSync(file).isFile())throw new Error();response.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'});createReadStream(file).pipe(response);}catch{response.writeHead(404).end('Not found');}
  });
  instance.listen(0,'127.0.0.1',()=>resolveServer(instance));
});

mkdirSync(output,{recursive:true});
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
const captures=[];

try{
  for(const theme of themes){
    const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1,reducedMotion:'reduce'});
    await context.addInitScript(selected=>localStorage.setItem('sf-visual-theme',selected),theme);
    const page=await context.newPage();
    await page.goto(`${base}/index.html`,{waitUntil:'networkidle'});
    const path=join(output,`${theme}.png`);
    await page.screenshot({path});
    captures.push({theme,path});
    await context.close();
  }

  const contact=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
  const cards=captures.map(({theme,path})=>`<figure><img src="data:image/png;base64,${readFileSync(path).toString('base64')}" alt="${theme}"><figcaption>${theme}</figcaption></figure>`).join('');
  await contact.setContent(`<!doctype html><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#111;color:#fff;font:700 13px/1.2 system-ui}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}figure{margin:0;border:1px solid #444;background:#1b1b1b}img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top}figcaption{padding:9px 11px;text-transform:uppercase;letter-spacing:.08em}</style><div class="grid">${cards}</div>`,{waitUntil:'load'});
  await contact.screenshot({path:join(output,'28-theme-contact-sheet.png'),fullPage:true});
}finally{
  await browser.close();
  server.close();
}

console.log(`Captured ${themes.length} laptop previews and ${join(output,'28-theme-contact-sheet.png')}.`);
