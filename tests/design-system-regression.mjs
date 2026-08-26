import { chromium } from '@playwright/test';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const allThemes=['institution','terminal','whitepaper','brutalist','command','protocol','calm','archive','swiss','bauhaus','glass','solarpunk','mono','cyber','space','zen','retroos','datascape','blueprint','newspaper','memphis','noir','biotech','clay','museum','industrial','hologram','cartographic','bento','riso','kinetic','spatialos','quietlux','civic','parametric','vernacular','aero','manga'];
const allPages=['index.html','case-study.html','thesis.html','architecture.html','economics.html','build.html','mvp.html','journal.html','systems.html','compare.html','projects.html','studio.html','visual-review-2045.html','homepage-standalone.html','build-standalone.html'];
const themes=process.env.TEST_THEMES?allThemes.filter(theme=>process.env.TEST_THEMES.split(',').includes(theme)):allThemes;
const pages=process.env.TEST_PAGES?allPages.filter(page=>process.env.TEST_PAGES.split(',').includes(page)):allPages;
const viewports=[{name:'desktop',width:1440,height:900},{name:'laptop',width:1280,height:800}];
const probes=['.theme-option','.hero-lede','.hero h1 .soft','.nav-status','.eyebrow','.section-head .kicker','.status-cell .v','.status-cell .l','.metric-label','.metric-sub','.flow-center span','.schem-core span','th','.cite','.figure-no','.claim-badge','.callout h3','.callout p','.callout .micro','.btn.primary','.btn:not(.primary)','.page-hero .crumb','.data-tag span','.data-tag strong','.service-card .price','.time-row .state','.journal-meta span','.research-time span','.lab-panel p','.lab-swatch strong','.lab-type-row span','.lab-alert span','.compare-toolbar p','.footer-copy','.footer-bottom','.sf-edit-toggle','.sf-edit-panel>header span','.sf-edit-panel>header strong','.sf-edit-panel>header button','.sf-edit-actions button:not([disabled])','.sf-edit-actions label','.sf-edit-scope>span','.sf-edit-scope button','.sf-edit-scope p','.sf-edit-navigator label','.sf-edit-navigator input','.sf-edit-navigator button','.sf-edit-selected span','.sf-edit-selected strong','.sf-edit-group h3','.sf-edit-group label','.sf-edit-group input:not([type="color"]):not([type="range"])','.sf-edit-group select','.sf-edit-group textarea','.sf-edit-help','.sf-edit-reset button','.sf-edit-reset p','.studio-toolbar span','.studio-toolbar button','.studio-theme-control','.studio-sidebar .studio-panel-title strong','.studio-pages button','.studio-library button','.studio-outline-item','.studio-stage-meta','.studio-device-bar span','.studio-output-nav strong','.studio-output-nav a','.studio-inspector>header span','.studio-inspector>header h2','.studio-inspector>header button','.studio-inspector form label','.studio-inspector form input','.studio-inspector form textarea','.studio-version-empty','.project-summary span','.project-summary strong','.project-summary p','.project-card-body p','.project-card-meta span'];
probes.push('.exhibition-sequence-title','.exhibition-sequence li>span','.exhibition-sequence li small');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.svg':'image/svg+xml'};

function startServer(){
  return new Promise(resolve=>{
    const server=createServer((request,response)=>{
      const requestPath=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
      const relative=normalize(requestPath==='/'?'index.html':requestPath.replace(/^\/+/,''));
      const file=join(root,relative);
      if(!file.startsWith(root)){response.writeHead(403).end();return;}
      try{if(!statSync(file).isFile())throw new Error('not a file');response.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'});createReadStream(file).pipe(response);}catch{response.writeHead(404).end('Not found');}
    });
    server.listen(0,'127.0.0.1',()=>resolve(server));
  });
}

function assertStaticContracts(){
  const css=readFileSync(join(root,'shared/styles.css'),'utf8');
  const js=readFileSync(join(root,'shared/site.js'),'utf8');
  const studioJS=readFileSync(join(root,'shared/studio.js'),'utf8');
  const studioCSS=readFileSync(join(root,'shared/studio.css'),'utf8');
  const failures=[];
  if(/html\[data-theme="calm"\] \.hero h1 \.soft\{color:#/i.test(css))failures.push('Calm soft text bypasses --soft');
  if(/html\[data-theme="clay"\] \.hero h1 \.soft\{color:#/i.test(css))failures.push('Clay soft text bypasses --soft');
  if(!/html\[data-theme="brutalist"\] th\{color:#fff!important\}/.test(css))failures.push('Brutalist filled table header is not explicitly paired with white ink');
  const calloutTokens=['--callout-bg','--callout-ink','--callout-muted','--callout-accent'];
  for(const theme of allThemes.slice(28)){
    const declarations=[...css.matchAll(new RegExp(`html\\[data-theme="${theme}"\\]\\{([^}]*)\\}`,'g'))].map(match=>match[1]).join(';');
    for(const token of calloutTokens)if(!declarations.includes(`${token}:`))failures.push(`${theme} recipe is missing explicit ${token}`);
  }
  if(!css.includes('html[data-theme="hologram"] .theme-review{background-color:#cfe0e8;background-image:linear-gradient'))failures.push('Hologram review bar is missing its solid gradient fallback');
  if(!probes.includes('.theme-option'))failures.push('Theme selector chips are missing from contrast probes');
  const gateBlock=js.slice(js.indexOf('const GOVERNANCE_GATES={'),js.indexOf('const ORDER=',js.indexOf('const GOVERNANCE_GATES={')));
  if((gateBlock.match(/^    [a-z]+:'/gm)||[]).length!==38)failures.push('Theme-specific governance gates are incomplete');
  for(const marker of ['Copy tokens (JSON)','renderTokenPair','recipe-scale-type',"recipe-header').focus({preventScroll:true})",'self-funding.design-system.tokens/v1'])if(!js.includes(marker))failures.push(`Recipe contract missing: ${marker}`);
  for(const marker of ['LAB_SYSTEMS','initSystemsLab','initCompare','data-compare-viewport'])if(!js.includes(marker))failures.push(`Systems Lab contract missing: ${marker}`);
  for(const marker of ['initEditMode','VISUAL INSPECT 2.1','Inspect specimen','sf-live-edit-v1','self-funding.live-edit/v2','data-editor-content','data-editor-export','data-editor-scope','data-editor-navigator','data-editor-canvas','data-sf-editor-canvas','rebuildResponsiveStyle','data-editor-copy','data-editor-reset-component','beforeThemeChange'])if(!js.includes(marker))failures.push(`Specimen inspector contract missing: ${marker}`);
  if(js.includes("{href:'studio.html',label:'Studio'")||js.includes("{href:'projects.html',label:'Projects'"))failures.push('Archived builder routes are still exposed in public navigation');
  for(const marker of ['systems38.projects.v1','systems38.project/v1','systems38.production-site/v1','SECTION_LIBRARY','data-save-version','data-export-site','buildSiteZip','zipStore','LIVE EDIT MODE'])if(!studioJS.includes(marker))failures.push(`Project Studio contract missing: ${marker}`);
  for(const marker of ['.studio-workspace','.studio-preview','.studio-inspector','.project-grid','data-theme="retroos"','data-theme="swiss"'])if(!studioCSS.includes(marker))failures.push(`Project Studio style contract missing: ${marker}`);
  for(const file of ['index.html','case-study.html','projects.html','studio.html'])if(!statSync(join(root,file)).isFile())failures.push(`Product route missing: ${file}`);
  if(failures.length)throw new Error(failures.join('\n'));
}

async function collectContrastFailures(page,theme,file){
  return page.evaluate(({probes,theme,file})=>{
    const parse=value=>{const match=String(value).match(/rgba?\(([^)]+)\)/);if(!match)return null;const values=match[1].split(/[\s,\/]+/).filter(Boolean).map(Number);return values.length>=3?[values[0],values[1],values[2],Number.isFinite(values[3])?values[3]:1]:null;};
    const blend=(top,bottom)=>{const alpha=top[3]+bottom[3]*(1-top[3]);if(alpha===0)return[255,255,255,1];return[(top[0]*top[3]+bottom[0]*bottom[3]*(1-top[3]))/alpha,(top[1]*top[3]+bottom[1]*bottom[3]*(1-top[3]))/alpha,(top[2]*top[3]+bottom[2]*bottom[3]*(1-top[3]))/alpha,alpha];};
    const background=element=>{let layers=[],node=element;while(node){const color=parse(getComputedStyle(node).backgroundColor);if(color&&color[3]>0)layers.push(color);node=node.parentElement;}let result=[255,255,255,1];for(const layer of layers.reverse())result=blend(layer,result);return result;};
    const luminance=rgb=>rgb.slice(0,3).map(value=>{const channel=value/255;return channel<=.04045?channel/12.92:Math.pow((channel+.055)/1.055,2.4);}).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
    const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    const failures=[];
    for(const selector of probes){for(const element of document.querySelectorAll(selector)){
      const rect=element.getBoundingClientRect(),style=getComputedStyle(element),text=(element.textContent||element.value||element.placeholder||'').trim();
      if(!text||rect.width<1||rect.height<1||style.visibility==='hidden'||style.display==='none')continue;
      const foreground=parse(style.color);if(!foreground)continue;
      const bg=background(element),composited=blend(foreground,bg),value=ratio(composited,bg);
      const size=parseFloat(style.fontSize),weight=parseInt(style.fontWeight,10)||400,large=size>=24||(size>=18.66&&weight>=700),minimum=large?3:4.5;
      if(value+0.015<minimum)failures.push({theme,file,selector,text:text.slice(0,48),ratio:Number(value.toFixed(2)),minimum,size,weight});
    }}
    return failures;
  },{probes,theme,file});
}

assertStaticContracts();
const server=await startServer();
const address=server.address();
const base=`http://127.0.0.1:${address.port}`;
const browser=await chromium.launch({headless:true});
const failures=[];
const runtimeErrors=[];

try{
  for(const theme of themes){
    for(const viewport of viewports){
      const context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},reducedMotion:'reduce'});
      await context.addInitScript(selected=>localStorage.setItem('sf-visual-theme-v2',selected),theme);
      const page=await context.newPage();
      page.on('console',message=>{if(message.type()==='error')runtimeErrors.push(`${theme}/${viewport.name}: ${message.text()}`);});
      page.on('pageerror',error=>runtimeErrors.push(`${theme}/${viewport.name}: ${error.message}`));
      for(const file of pages){
        const fixture=`${file}@${viewport.name}`;
        const response=await page.goto(`${base}/${file}`,{waitUntil:'networkidle'});
        if(!response?.ok())throw new Error(`${theme}/${fixture} returned ${response?.status()}`);
        const state=await page.evaluate(()=>({theme:document.documentElement.dataset.theme,options:document.querySelectorAll('.theme-option').length,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
        if(state.theme!==theme||state.options!==38||state.overflow>1)failures.push({theme,file:fixture,selector:'document',text:`theme=${state.theme} options=${state.options} overflow=${state.overflow}`,ratio:0,minimum:0});
        failures.push(...await collectContrastFailures(page,theme,fixture));
        if(file==='index.html'&&viewport.name==='desktop'){
          const original=await page.locator('.hero h1 em').textContent();
          await page.locator('.sf-edit-toggle').click();
          await page.locator('.hero h1 em').click();
          await page.locator('[data-editor-content]').fill(`Edited ${theme}`);
          await page.locator('[data-style="font-size"]').fill('48');
          await page.locator('[data-nudge="8,0"]').click();
          const edited=await page.evaluate(()=>({active:document.documentElement.hasAttribute('data-sf-editing'),text:document.querySelector('.hero h1 em')?.textContent,size:document.querySelector('.hero h1 em')?.style.fontSize,x:document.querySelector('.hero h1 em')?.style.getPropertyValue('--sf-edit-x'),saved:document.querySelector('[data-editor-status]')?.textContent,undo:!document.querySelector('[data-editor-undo]')?.disabled,scopes:document.querySelectorAll('[data-editor-scope]').length,navigator:document.querySelectorAll('[data-editor-navigator] option').length,copy:!!document.querySelector('[data-editor-copy]')}));
          await page.locator('[data-editor-scope="mobile"]').click();
          await page.locator('[data-style="font-size"]').fill('34');
          const responsive=await page.evaluate(()=>({scope:document.documentElement.dataset.sfEditScope,size:document.querySelector('.hero h1 em')?.style.fontSize,priority:document.querySelector('.hero h1 em')?.style.getPropertyPriority('font-size'),css:document.querySelector('[data-sf-responsive]')?.textContent}));
          await page.locator('[data-editor-scope="base"]').click();
          const baseAgain=await page.locator('.hero h1 em').evaluate(element=>element.style.fontSize);
          await page.locator('[data-editor-canvas]').click();
          const canvas=await page.evaluate(()=>({active:document.documentElement.hasAttribute('data-sf-editing'),canvas:document.documentElement.hasAttribute('data-sf-editor-canvas'),panel:document.querySelector('.sf-edit-panel')?.classList.contains('is-canvas'),toggle:document.querySelector('.sf-edit-toggle')?.textContent.trim()}));
          await page.locator('.sf-edit-toggle').click();
          const inspectorRestored=await page.evaluate(()=>!document.documentElement.hasAttribute('data-sf-editor-canvas')&&document.querySelector('.sf-edit-panel')?.classList.contains('is-open'));
          await page.locator('[data-editor-reset]').click();
          const reset=await page.evaluate(()=>({text:document.querySelector('.hero h1 em')?.textContent,size:document.querySelector('.hero h1 em')?.style.fontSize,x:document.querySelector('.hero h1 em')?.style.getPropertyValue('--sf-edit-x')}));
          await page.locator('[data-editor-close]').click();
          if(!edited.active||edited.text!==`Edited ${theme}`||edited.size!=='48px'||edited.x!=='8px'||edited.saved!=='Study saved locally'||!edited.undo||edited.scopes!==4||edited.navigator<100||!edited.copy||responsive.scope!=='mobile'||responsive.size!=='34px'||responsive.priority!=='important'||!responsive.css?.includes('@media (max-width:700px)')||baseAgain!=='48px'||!canvas.active||!canvas.canvas||!canvas.panel||!canvas.toggle.includes('Inspector')||!inspectorRestored||reset.text!==original||reset.size||reset.x)failures.push({theme,file:fixture,selector:'specimen-inspector',text:JSON.stringify({original,edited,responsive,baseAgain,canvas,inspectorRestored,reset}),ratio:0,minimum:0});
        }
        if(file==='systems.html'&&viewport.name==='desktop'){
          const lab=await page.evaluate(()=>({name:document.querySelector('[data-lab-name]')?.textContent,swatches:document.querySelectorAll('.lab-swatch').length,patterns:document.querySelectorAll('[data-lab-patterns] li').length,download:!!document.querySelector('[data-download-tokens]'),nav:!!document.querySelector('.nav-links a[href="compare.html"]')}));
          if(!lab.name||lab.swatches!==6||lab.patterns<3||!lab.download||!lab.nav)failures.push({theme,file:fixture,selector:'systems-lab',text:JSON.stringify(lab),ratio:0,minimum:0});
          await page.locator('[role="tab"][data-panel]').nth(1).click();
          const tabText=await page.locator('[data-tab-panel]').innerText();
          await page.locator('[data-open-dialog]').click();
          const dialogOpen=await page.locator('.lab-dialog').evaluate(element=>element.open);
          await page.locator('[data-close-dialog]').click();
          await page.locator('[data-open-recipe]').last().click();
          const handoffOpen=await page.locator('.theme-recipe-dialog').evaluate(element=>element.open);
          await page.locator('.recipe-close').click();
          if(!tabText.includes('bounded compute reserves')||!dialogOpen||!handoffOpen)failures.push({theme,file:fixture,selector:'systems-lab-interaction',text:JSON.stringify({tabText,dialogOpen,handoffOpen}),ratio:0,minimum:0});
        }
        if(file==='compare.html'&&viewport.name==='desktop'){
          const compare=await page.evaluate(()=>({selectors:document.querySelectorAll('[data-compare-theme] option').length,frames:[...document.querySelectorAll('.compare-frame iframe')].map(frame=>frame.getAttribute('src')),embeddedEditors:[...document.querySelectorAll('.compare-frame iframe')].filter(frame=>frame.contentDocument?.querySelector('.sf-edit-toggle')).length,nav:!!document.querySelector('.nav-links a[href="systems.html"]')}));
          if(compare.selectors!==114||compare.frames.length!==3||compare.frames.some(src=>!src?.includes('embed=1'))||compare.embeddedEditors!==0||!compare.nav)failures.push({theme,file:fixture,selector:'compare',text:JSON.stringify(compare),ratio:0,minimum:0});
        }
        if(file==='projects.html'&&viewport.name==='desktop'){
          const projectsState=await page.evaluate(()=>({empty:!document.querySelector('[data-project-empty]')?.hidden,cards:document.querySelectorAll('[data-project-card]').length,themeOptions:document.querySelectorAll('[data-project-theme] option').length,editor:document.querySelectorAll('.sf-edit-toggle').length,publicBuilderLinks:document.querySelectorAll('.nav-links a[href="studio.html"],.nav-links a[href="projects.html"]').length,archive:!!document.querySelector('.studio-experiment-banner'),noindex:document.querySelector('meta[name="robots"]')?.content}));
          if(!projectsState.empty||projectsState.cards!==0||projectsState.themeOptions!==38||projectsState.editor!==0||projectsState.publicBuilderLinks!==0||!projectsState.archive||projectsState.noindex!=='noindex,nofollow')failures.push({theme,file:fixture,selector:'projects-archive',text:JSON.stringify(projectsState),ratio:0,minimum:0});
          await page.locator('[data-new-project]').first().click();
          const dialogOpen=await page.locator('[data-project-dialog]').evaluate(element=>element.open);
          await page.locator('[data-close-project]').first().click();
          if(!dialogOpen)failures.push({theme,file:fixture,selector:'projects-dialog',text:'New project dialog did not open',ratio:0,minimum:0});
        }
        if(file==='studio.html'&&viewport.name==='desktop'){
          const studioState=await page.evaluate(()=>({pages:document.querySelectorAll('[data-page-id]').length,library:document.querySelectorAll('[data-add-section]').length,outline:document.querySelectorAll('[data-outline-id]').length,preview:document.querySelectorAll('[data-studio-section]').length,editor:document.querySelectorAll('.sf-edit-toggle').length,theme:document.querySelector('[data-studio-theme]')?.value,status:document.querySelector('[data-studio-save-status]')?.textContent}));
          if(studioState.pages!==3||studioState.library!==10||studioState.outline!==5||studioState.preview!==5||studioState.editor!==0||studioState.theme!==theme||!studioState.status)failures.push({theme,file:fixture,selector:'project-studio',text:JSON.stringify(studioState),ratio:0,minimum:0});
          if(theme==='retroos'){
            await page.locator('[data-add-section="gallery"]').click();
            await page.locator('[data-section-form] [name="title"]').fill('Regression gallery');
            await page.locator('[data-add-page]').click();
            await page.locator('[data-page-form] [name="name"]').fill('Services');
            await page.locator('[data-page-form] [name="slug"]').fill('services');
            await page.locator('[data-page-form] button[type="submit"]').click();
            await page.locator('[data-save-version]').click();
            await page.locator('[data-version-form] [name="name"]').fill('Regression checkpoint');
            await page.locator('[data-version-form] button[type="submit"]').click();
            await page.locator('[data-studio-viewport="mobile"]').click();
            await page.waitForTimeout(350);
            const downloadPromise=page.waitForEvent('download');
            await page.locator('[data-export-site]').click();
            const download=await downloadPromise;
            const interaction=await page.evaluate(()=>({pages:document.querySelectorAll('[data-page-id]').length,versions:document.querySelectorAll('.studio-version-card').length,viewport:document.querySelector('[data-studio-stage]')?.dataset.viewport,width:Math.round(document.querySelector('.studio-device')?.getBoundingClientRect().width||0),status:document.querySelector('[data-studio-save-status]')?.textContent}));
            interaction.file=download.suggestedFilename();
            if(interaction.pages!==4||interaction.versions!==1||interaction.viewport!=='mobile'||interaction.width!==390||!interaction.status?.includes('exported')||!interaction.file.endsWith('-website.zip'))failures.push({theme,file:fixture,selector:'project-studio-interaction',text:JSON.stringify(interaction),ratio:0,minimum:0});
          }
        }
        if(file==='index.html'&&viewport.name==='desktop'){
          await page.locator('.theme-recipe-link').first().click();
          const recipe=await page.evaluate(()=>({pairs:document.querySelectorAll('.recipe-pair').length,tokenButton:!!document.querySelector('[data-copy="tokens"]'),governance:document.querySelector('.recipe-governance')?.textContent.length||0,focus:document.activeElement?.classList.contains('recipe-header')}));
          if(recipe.pairs!==6||!recipe.tokenButton||recipe.governance<80||!recipe.focus)failures.push({theme,file:fixture,selector:'recipe',text:JSON.stringify(recipe),ratio:0,minimum:0});
          await page.locator('.recipe-close').click();
        }
      }
      await context.close();
    }
  }
}finally{
  await browser.close();
  server.close();
}

if(runtimeErrors.length||failures.length){
  if(runtimeErrors.length)console.error(`Runtime errors (${runtimeErrors.length})\n${runtimeErrors.join('\n')}`);
  if(failures.length){
    const grouped=new Map();
    for(const failure of failures){const key=`${failure.theme} / ${failure.selector} / ${failure.text}`;const current=grouped.get(key)||{...failure,count:0,files:[]};current.count++;if(current.files.length<3)current.files.push(failure.file);grouped.set(key,current);}
    console.error(`Design-system failures (${failures.length}; ${grouped.size} unique)\n${JSON.stringify([...grouped.values()],null,2)}`);
  }
  process.exit(1);
}

console.log(`PASS: ${themes.length} themes × ${pages.length} pages × ${viewports.length} desktop/laptop viewports; ${probes.length} contrast probes; ${themes.length} recipe dialogs; no overflow or runtime errors.`);
