(() => {
  const STORAGE_KEY='systems38.projects.v1';
  const ACTIVE_KEY='systems38.active-project.v1';
  const PROJECT_SCHEMA='systems38.project/v1';
  const SITE_SCHEMA='systems38.production-site/v1';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const uid=prefix=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const slugify=value=>String(value||'page').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'page';
  const formatDate=value=>new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
  const systems=()=>window.SFDesignSystems||{order:['retroos'],themes:{retroos:{label:'Retro OS',description:'desktop utility'}},current:'retroos',apply() {}};

  function loadProjects(){
    try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');return Array.isArray(value)?value:[];}catch(error){return [];}
  }
  function saveProjects(projects){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(projects));return true;}catch(error){return false;}}
  function setActive(id){try{localStorage.setItem(ACTIVE_KEY,id);}catch(error){}}
  function getActive(){try{return localStorage.getItem(ACTIVE_KEY)||'';}catch(error){return '';}}
  function download(name,content,type='application/json'){
    const blob=content instanceof Blob?content:new Blob([content],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=name;link.hidden=true;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  }

  const SECTION_LIBRARY={
    hero:{label:'Hero',hint:'Proposition',defaults:{eyebrow:'INTRODUCTION',title:'A clear idea deserves a complete visual system.',body:'Explain what matters, who it is for, and why this is the right moment.',primary:'Begin',secondary:'Learn more'}},
    features:{label:'Features',hint:'3–6 cards',defaults:{eyebrow:'CAPABILITIES',title:'Built around the work people need to do.',body:'Keep each capability concrete, distinct, and easy to scan.',items:'Clear direction | A hierarchy that makes the next action obvious.\nResponsive by default | Every section remains legible from phone to desktop.\nReady to evolve | Components and tokens change together as the system grows.'}},
    stats:{label:'Stats',hint:'Evidence',defaults:{eyebrow:'MEASURED OUTCOMES',title:'Let the evidence carry the claim.',items:'38 | design systems | one content model\n12 | page templates | tested together\n100% | portable | export and deploy'}},
    split:{label:'Split story',hint:'Narrative',defaults:{eyebrow:'THE APPROACH',title:'Structure before decoration.',body:'A useful design system makes recurring decisions predictable while leaving enough room for a product to have a point of view.\n\nStart with the information people need, then use typography, spacing, color, and motion to make that information easier to understand.'}},
    quote:{label:'Quote',hint:'Testimony',defaults:{quote:'The strongest visual language is the one that still works when the content becomes difficult.',citation:'Design systems principle'}},
    gallery:{label:'Gallery',hint:'Portfolio',defaults:{eyebrow:'SELECTED WORK',title:'A body of work, not a row of thumbnails.',body:'Give every project enough context to be understood.',items:'Project One | Identity and product direction\nProject Two | Research and editorial platform\nProject Three | Operational software system'}},
    pricing:{label:'Pricing',hint:'Offers',defaults:{eyebrow:'ENGAGEMENTS',title:'Choose the right level of commitment.',body:'Make scope and differences explicit.',items:'Foundation | $2,500 | Strategy, core system, and one production page.\nProduct | $7,500 | Complete component library and five-page site.\nPartnership | Let’s talk | Ongoing design-system stewardship.'}},
    article:{label:'Article',hint:'Long form',defaults:{eyebrow:'FIELD NOTE',title:'Design is a system of consequential choices.',body:'Long-form content tests whether a visual direction can do more than make a first impression.\n\nUse this section for essays, documentation, case studies, policies, or any argument that needs room to develop.'}},
    cta:{label:'Call to action',hint:'Conversion',defaults:{eyebrow:'NEXT STEP',title:'Ready to make the system real?',body:'Turn the direction into a working project and carry it into production.',primary:'Start a conversation'}},
    footer:{label:'Footer',hint:'Closure',defaults:{brand:'Your Project',body:'A concise final statement about the work, the organization, or the promise.'}}
  };
  const FIELD_SCHEMAS={
    hero:[['eyebrow','Eyebrow'],['title','Headline','textarea'],['body','Introduction','textarea'],['primary','Primary action'],['secondary','Secondary action']],
    features:[['eyebrow','Eyebrow'],['title','Section title','textarea'],['body','Introduction','textarea'],['items','Cards — Title | Description, one per line','textarea']],
    stats:[['eyebrow','Eyebrow'],['title','Section title','textarea'],['items','Stats — Value | Label | Note, one per line','textarea']],
    split:[['eyebrow','Eyebrow'],['title','Section title','textarea'],['body','Story','textarea']],
    quote:[['quote','Quotation','textarea'],['citation','Citation']],
    gallery:[['eyebrow','Eyebrow'],['title','Section title','textarea'],['body','Introduction','textarea'],['items','Projects — Title | Description, one per line','textarea']],
    pricing:[['eyebrow','Eyebrow'],['title','Section title','textarea'],['body','Introduction','textarea'],['items','Offers — Name | Price | Description, one per line','textarea']],
    article:[['eyebrow','Eyebrow'],['title','Article title','textarea'],['body','Article body','textarea']],
    cta:[['eyebrow','Eyebrow'],['title','Headline','textarea'],['body','Supporting copy','textarea'],['primary','Action label']],
    footer:[['brand','Brand name'],['body','Closing statement','textarea']]
  };

  function section(type,overrides={}){const definition=SECTION_LIBRARY[type]||SECTION_LIBRARY.article;return{id:uid('section'),type,content:{...clone(definition.defaults),...overrides}};}
  function starterPage(kind='home',name){
    const pageName=name||({home:'Home',about:'About',contact:'Contact'}[kind]||'New Page'),slug=kind==='home'?'index':slugify(pageName);
    const sections=kind==='home'
      ?[section('hero'),section('features'),section('stats'),section('cta'),section('footer')]
      :kind==='about'
        ?[section('hero',{eyebrow:'ABOUT',title:'The thinking behind the work.',body:'Share the principles, experience, and point of view that make this project distinct.',primary:'See the work',secondary:'Get in touch'}),section('split'),section('quote'),section('footer')]
        :kind==='contact'
          ?[section('hero',{eyebrow:'CONTACT',title:'Begin with a useful conversation.',body:'Tell us what you are making, what is at stake, and where the current system falls short.',primary:'Write to us',secondary:'View availability'}),section('features',{eyebrow:'BEFORE YOU WRITE',title:'A good brief can be short.',body:'Three things help us understand the opportunity.',items:'Objective | What should become possible?\nAudience | Who needs the result and in what context?\nConstraint | What must remain true while we make it?'}),section('cta',{eyebrow:'DIRECT CONTACT',title:'hello@example.com',body:'Replace this placeholder with the channel you actually monitor.',primary:'Copy email'}),section('footer')]
          :[section('hero',{eyebrow:pageName.toUpperCase(),title:`${pageName}, made coherent.`,body:'Introduce the purpose of this page and the decision it helps a visitor make.'}),section('article'),section('cta'),section('footer')];
    return{id:uid('page'),name:pageName,slug,sections};
  }
  function createProject(name='Untitled Project',brief='',theme='retroos',pageKinds=['home']){
    const now=new Date().toISOString(),pages=(pageKinds.length?pageKinds:['home']).map(kind=>starterPage(kind));
    return{schema:PROJECT_SCHEMA,id:uid('project'),name:name.trim()||'Untitled Project',brief:brief.trim(),theme:systems().themes[theme]?theme:'retroos',createdAt:now,updatedAt:now,activePage:pages[0].id,pages,versions:[]};
  }

  const parseItems=value=>String(value||'').split('\n').map(line=>line.trim()).filter(Boolean).map(line=>line.split('|').map(part=>part.trim()));
  const paragraphs=value=>safe(value).split(/\n\s*\n/).map(text=>`<p>${text.replace(/\n/g,'<br>')}</p>`).join('');
  function sectionIntro(content){return `<div class="section-head"><div class="kicker">${safe(content.eyebrow)}</div><div><h2>${safe(content.title)}</h2>${content.body?`<p>${safe(content.body)}</p>`:''}</div></div>`;}
  function renderSection(item,selectedId='',exportMode=false){
    const content=item.content||{},selected=item.id===selectedId?' is-selected':'',attrs=exportMode?'':` data-studio-section="${safe(item.id)}"`;
    if(item.type==='hero')return `<header class="hero studio-output-hero studio-output-section${selected}"${attrs}><div class="wrap hero-layout"><div class="hero-copy"><div class="eyebrow"><span class="rule"></span>${safe(content.eyebrow)}</div><h1>${safe(content.title)}</h1><p class="hero-lede">${safe(content.body)}</p><div class="hero-actions"><a class="btn primary" href="#">${safe(content.primary)} <span>↗</span></a><a class="btn" href="#">${safe(content.secondary)}</a></div></div></div></header>`;
    if(item.type==='features'||item.type==='gallery'){
      const cards=parseItems(content.items).map((parts,index)=>`<article class="card span4"><div class="metric-label">${String(index+1).padStart(2,'0')}</div><h3>${safe(parts[0]||'Untitled')}</h3><p>${safe(parts[1]||'Add a clear description.')}</p></article>`).join('');
      return `<section class="section studio-output-section${selected}"${attrs}><div class="wrap">${sectionIntro(content)}<div class="grid">${cards}</div></div></section>`;
    }
    if(item.type==='stats'){
      const stats=parseItems(content.items).map((parts,index)=>`<div class="status-cell${index===0?' lead':''}"><div class="l">${safe(parts[1]||'Metric')}</div><div class="v${index===0?' mint':''}">${safe(parts[0]||'—')}</div>${parts[2]?`<small>${safe(parts[2])}</small>`:''}</div>`).join('');
      return `<section class="section compact studio-output-section${selected}"${attrs}><div class="wrap">${sectionIntro(content)}<div class="status-band">${stats}</div></div></section>`;
    }
    if(item.type==='split')return `<section class="section studio-output-section${selected}"${attrs}><div class="wrap">${sectionIntro(content)}<div class="manifesto"><div class="manifesto-index"><div class="manifesto-number">01</div><div class="micro">${safe(content.eyebrow)}</div></div><div class="manifesto-copy"><h3>${safe(content.title)}</h3>${paragraphs(content.body)}</div></div></div></section>`;
    if(item.type==='quote')return `<section class="section studio-output-quote studio-output-section${selected}"${attrs}><div class="wrap"><blockquote>“${safe(content.quote)}”</blockquote><cite>${safe(content.citation)}</cite></div></section>`;
    if(item.type==='pricing'){
      const cards=parseItems(content.items).map(parts=>`<article class="card span4 service-card"><div><div class="metric-label">${safe(parts[0]||'Offer')}</div><h3>${safe(parts[0]||'Offer')}</h3><p>${safe(parts[2]||'Describe what is included.')}</p></div><div class="price">${safe(parts[1]||'Custom')}</div></article>`).join('');
      return `<section class="section studio-output-section${selected}"${attrs}><div class="wrap">${sectionIntro(content)}<div class="grid">${cards}</div></div></section>`;
    }
    if(item.type==='article')return `<article class="section studio-output-article studio-output-section${selected}"${attrs}><div class="wrap"><div class="kicker">${safe(content.eyebrow)}</div><h2>${safe(content.title)}</h2>${paragraphs(content.body)}</div></article>`;
    if(item.type==='cta')return `<section class="section compact studio-output-cta studio-output-section${selected}"${attrs}><div class="wrap"><div class="callout"><div class="micro">${safe(content.eyebrow)}</div><h3>${safe(content.title)}</h3><p>${safe(content.body)}</p><div class="actions"><a class="btn primary" href="#">${safe(content.primary)} →</a></div></div></div></section>`;
    return `<footer class="studio-output-footer studio-output-section${selected}"${attrs}><strong>${safe(content.brand)}</strong><p>${safe(content.body)}</p></footer>`;
  }
  function renderPage(project,page,selectedId='',exportMode=false){
    const links=project.pages.map(item=>`<a href="${item.slug==='index'?'index':item.slug}.html">${safe(item.name)}</a>`).join('');
    return `<article class="studio-output"><nav class="studio-output-nav"><strong>${safe(project.name)}</strong><div>${links}</div></nav>${page.sections.map(item=>renderSection(item,selectedId,exportMode)).join('')}</article>`;
  }

  function themeOptions(selected){return systems().order.map(id=>`<option value="${safe(id)}"${id===selected?' selected':''}>${safe(systems().themes[id].label)}</option>`).join('');}

  function initHome(){
    document.querySelectorAll('[data-project-count]').forEach(element=>{const count=loadProjects().length;element.textContent=`${count} PROJECT${count===1?'':'S'}`;});
  }

  function initProjects(){
    const app=document.querySelector('[data-projects-app]');if(!app)return;
    const grid=app.querySelector('[data-project-grid]'),empty=app.querySelector('[data-project-empty]'),dialog=document.querySelector('[data-project-dialog]'),form=document.querySelector('[data-project-form]'),themeSelect=form.querySelector('[data-project-theme]');
    themeSelect.innerHTML=themeOptions(systems().current);
    const openDialog=()=>{form.reset();themeSelect.value=systems().current;form.querySelector('[value="home"]').checked=true;form.querySelector('[value="about"]').checked=true;form.querySelector('[value="contact"]').checked=true;dialog.showModal?.();};
    document.querySelectorAll('[data-new-project]').forEach(button=>button.addEventListener('click',openDialog));
    document.querySelectorAll('[data-close-project]').forEach(button=>button.addEventListener('click',()=>dialog.close?.()));
    function render(){
      const projects=loadProjects().sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
      empty.hidden=projects.length>0;grid.hidden=!projects.length;
      grid.innerHTML=projects.map(project=>`<article class="project-card" data-project-card="${safe(project.id)}"><div class="project-card-preview"><span>${safe(systems().themes[project.theme]?.label||project.theme)} // ${project.pages.length} PAGE${project.pages.length===1?'':'S'}</span><strong>${safe(project.name)}</strong></div><div class="project-card-body"><h3>${safe(project.name)}</h3><p>${safe(project.brief||'No brief yet. Open the Studio to define the intent.')}</p><div class="project-card-meta"><span>${project.pages.length} pages</span><span>${project.versions?.length||0} versions</span><span>${safe(formatDate(project.updatedAt))}</span></div><div class="project-card-actions"><a href="studio.html?project=${encodeURIComponent(project.id)}">Open Studio</a><button type="button" data-project-action="duplicate" title="Duplicate">Copy</button><button type="button" data-project-action="export" title="Export project JSON">JSON</button><button type="button" data-project-action="delete" title="Delete project">×</button></div></div></article>`).join('');
      app.querySelector('[data-project-total]').textContent=projects.length;app.querySelector('[data-page-total]').textContent=projects.reduce((sum,project)=>sum+project.pages.length,0);app.querySelector('[data-version-total]').textContent=projects.reduce((sum,project)=>sum+(project.versions?.length||0),0);
    }
    form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form),pages=data.getAll('pages'),project=createProject(data.get('name'),data.get('brief'),data.get('theme'),pages);const projects=loadProjects();projects.push(project);saveProjects(projects);setActive(project.id);dialog.close?.();location.href=`studio.html?project=${encodeURIComponent(project.id)}`;});
    grid.addEventListener('click',event=>{const button=event.target.closest('[data-project-action]');if(!button)return;const card=button.closest('[data-project-card]'),projects=loadProjects(),index=projects.findIndex(project=>project.id===card.dataset.projectCard);if(index<0)return;const project=projects[index],action=button.dataset.projectAction;if(action==='duplicate'){const copy=clone(project);copy.id=uid('project');copy.name=`${project.name} Copy`;copy.createdAt=new Date().toISOString();copy.updatedAt=copy.createdAt;copy.versions=[];copy.pages.forEach(page=>{page.id=uid('page');page.sections.forEach(item=>item.id=uid('section'));});copy.activePage=copy.pages[0]?.id;projects.push(copy);saveProjects(projects);render();}if(action==='export')download(`${slugify(project.name)}-project.json`,JSON.stringify({...project,schema:PROJECT_SCHEMA},null,2));if(action==='delete'&&confirm(`Delete “${project.name}”? Export it first if you may need it later.`)){projects.splice(index,1);saveProjects(projects);render();}});
    app.querySelector('[data-import-project]').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{const project=JSON.parse(await file.text());if(project.schema!==PROJECT_SCHEMA||!Array.isArray(project.pages))throw new Error('Invalid project');project.id=uid('project');project.name=`${project.name||'Imported Project'} (Imported)`;project.updatedAt=new Date().toISOString();const projects=loadProjects();projects.push(project);saveProjects(projects);render();}catch(error){alert('This file is not a compatible SYSTEMS/38 project.');}event.target.value='';});
    render();
  }

  const EXPORT_EXTRA_CSS=`
html{--review-w:0px!important;--review-h:0px!important}body{padding-left:0!important}.site-nav{top:0!important}.theme-review{display:none!important}
.studio-output{min-height:100%;background:var(--bg);color:var(--ink)}.studio-output-nav{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px clamp(18px,4vw,54px);border-bottom:1px solid var(--line);background:var(--panel-solid)}.studio-output-nav strong{font:800 12px/1 var(--theme-label);letter-spacing:.09em}.studio-output-nav div{display:flex;flex-wrap:wrap;gap:14px}.studio-output-nav a{color:var(--muted);font:650 9px/1 var(--theme-label);text-decoration:none}.studio-output-hero{min-height:auto;padding:clamp(54px,8vw,110px) 0}.studio-output-hero .hero-layout{display:block}.studio-output-hero h1{max-width:13ch}.studio-output-section .section-head{margin-bottom:34px}.studio-output-section .section-head h2{font-size:clamp(34px,5vw,62px)}.studio-output-section .grid{gap:14px}.studio-output-section .card{min-height:180px}.studio-output-quote blockquote{max-width:850px;margin:0;font:550 clamp(34px,5vw,66px)/1.02 var(--theme-display);letter-spacing:-.045em}.studio-output-quote cite{display:block;margin-top:24px;color:var(--muted);font:700 10px/1 var(--theme-label);font-style:normal;letter-spacing:.1em}.studio-output-article .wrap{max-width:880px}.studio-output-article p{font-size:17px;line-height:1.8;white-space:pre-line}.studio-output-footer{padding:48px clamp(18px,4vw,54px);border-top:1px solid var(--line);background:var(--panel-solid)}.studio-output-footer strong{font:800 18px/1 var(--theme-display)}.studio-output-footer p{max-width:560px;color:var(--muted)}
@media(max-width:700px){.studio-output-nav div{display:none}.studio-output-section .section-head,.studio-output-section .manifesto{grid-template-columns:1fr}.studio-output-section .grid{grid-template-columns:1fr}.studio-output-section .grid>*{grid-column:auto}.studio-output-section .status-band{grid-template-columns:1fr 1fr}}
`;
  function exportHTML(project,page){
    const title=page.slug==='index'?project.name:`${page.name} — ${project.name}`,description=project.brief||`The ${page.name} page for ${project.name}.`;
    return `<!doctype html>\n<html lang="en" data-theme="${safe(project.theme)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${safe(description)}"><title>${safe(title)}</title><link rel="stylesheet" href="shared/styles.css"></head><body data-page="project"><div class="noise"></div><div class="grid-bg"></div>${renderPage(project,page,'',true)}<!-- Exported from SYSTEMS/38 · ${new Date().toISOString()} --></body></html>`;
  }
  const crcTable=(()=>{const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0;}return table;})();
  function crc32(bytes){let crc=0xffffffff;for(const byte of bytes)crc=crcTable[(crc^byte)&255]^(crc>>>8);return(crc^0xffffffff)>>>0;}
  function zipStore(entries){
    const encoder=new TextEncoder(),files=entries.map(entry=>({name:encoder.encode(entry.name),data:entry.data instanceof Uint8Array?entry.data:encoder.encode(entry.data)})),local=[],central=[];let offset=0;
    const u16=(array,value)=>{array.push(value&255,(value>>>8)&255);},u32=(array,value)=>{array.push(value&255,(value>>>8)&255,(value>>>16)&255,(value>>>24)&255);};
    for(const file of files){const crc=crc32(file.data),header=[];u32(header,0x04034b50);u16(header,20);u16(header,0);u16(header,0);u16(header,0);u16(header,0);u32(header,crc);u32(header,file.data.length);u32(header,file.data.length);u16(header,file.name.length);u16(header,0);local.push(new Uint8Array(header),file.name,file.data);const record=[];u32(record,0x02014b50);u16(record,20);u16(record,20);u16(record,0);u16(record,0);u16(record,0);u16(record,0);u32(record,crc);u32(record,file.data.length);u32(record,file.data.length);u16(record,file.name.length);u16(record,0);u16(record,0);u16(record,0);u16(record,0);u32(record,0);u32(record,offset);central.push(new Uint8Array(record),file.name);offset+=header.length+file.name.length+file.data.length;}
    const centralSize=central.reduce((sum,part)=>sum+part.length,0),end=[];u32(end,0x06054b50);u16(end,0);u16(end,0);u16(end,files.length);u16(end,files.length);u32(end,centralSize);u32(end,offset);u16(end,0);return new Blob([...local,...central,new Uint8Array(end)],{type:'application/zip'});
  }
  async function buildSiteZip(project){
    const entries=project.pages.map(page=>({name:`${page.slug==='index'?'index':page.slug}.html`,data:exportHTML(project,page)}));
    let css='';try{const response=await fetch(new URL('shared/styles.css',location.href));if(response.ok)css=await response.text();}catch(error){}
    if(css)css=css.replace(/\/\* ={5,}\s*LIVE EDIT MODE[\s\S]*$/,'');else css=`@import url("https://lovejzzz.github.io/Self-Funding-System/shared/styles.css");`;
    entries.push({name:'shared/styles.css',data:`${css}\n${EXPORT_EXTRA_CSS}`});
    const fontNames=['archivo-latin-variable.woff2','space-grotesk-latin-variable.woff2','source-serif-4-latin-variable.woff2','ibm-plex-mono-latin-400.woff2','ibm-plex-mono-latin-500.woff2','ibm-plex-mono-latin-600.woff2','ibm-plex-mono-latin-700.woff2'];
    await Promise.all(fontNames.map(async name=>{try{const response=await fetch(new URL(`shared/fonts/${name}`,location.href));if(response.ok)entries.push({name:`shared/fonts/${name}`,data:new Uint8Array(await response.arrayBuffer())});}catch(error){}}));
    entries.push({name:'project.json',data:JSON.stringify({...project,schema:SITE_SCHEMA,exportedAt:new Date().toISOString()},null,2)});
    entries.push({name:'README.txt',data:`${project.name}\n\nExported from SYSTEMS/38 using ${systems().themes[project.theme]?.label||project.theme}.\nOpen index.html or deploy this folder to any static host.\nThe production package contains no Studio or Edit Mode runtime.\n`});
    return zipStore(entries);
  }

  function initStudio(){
    const app=document.querySelector('[data-studio-app]');if(!app)return;
    let projects=loadProjects(),requested=new URLSearchParams(location.search).get('project')||getActive(),project=projects.find(item=>item.id===requested)||projects.sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt))[0];
    if(!project){project=createProject('My First Website','A clear, useful website built from a complete design system.',systems().current,['home','about','contact']);projects.push(project);saveProjects(projects);history.replaceState(null,'',`studio.html?project=${encodeURIComponent(project.id)}`);}
    setActive(project.id);systems().apply(project.theme);
    let selectedId=project.pages.find(page=>page.id===project.activePage)?.sections[0]?.id||'',saveTimer;
    const nameInput=app.querySelector('[data-project-name]'),themeSelect=app.querySelector('[data-studio-theme]'),pagesEl=app.querySelector('[data-studio-pages]'),libraryEl=app.querySelector('[data-studio-library]'),outlineEl=app.querySelector('[data-studio-outline]'),preview=app.querySelector('[data-studio-preview]'),stage=app.querySelector('[data-studio-stage]'),form=app.querySelector('[data-section-form]'),empty=app.querySelector('[data-inspector-empty]'),inspectorTitle=app.querySelector('[data-inspector-title]'),versionList=app.querySelector('[data-version-list]'),status=document.querySelector('[data-studio-save-status]'),shell=app;
    const currentPage=()=>project.pages.find(page=>page.id===project.activePage)||project.pages[0];
    const selectedSection=()=>currentPage()?.sections.find(item=>item.id===selectedId);
    function persist(message='Saved locally'){
      project.updatedAt=new Date().toISOString();const index=projects.findIndex(item=>item.id===project.id);if(index>=0)projects[index]=project;else projects.push(project);const okay=saveProjects(projects);status.textContent=okay?message:'Local save unavailable';document.querySelector('[data-autosave-note]').textContent=okay?`Saved ${new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'}).format(new Date())}`:'Save failed';
    }
    function queuePersist(){clearTimeout(saveTimer);status.textContent='Saving…';saveTimer=setTimeout(()=>persist(),220);}
    function renderPages(){pagesEl.innerHTML=project.pages.map(page=>`<button type="button" data-page-id="${safe(page.id)}" aria-pressed="${page.id===project.activePage}"><span>${safe(page.name)}</span><small>/${safe(page.slug)}</small></button>`).join('');}
    function renderLibrary(){libraryEl.innerHTML=Object.entries(SECTION_LIBRARY).map(([type,item])=>`<button type="button" data-add-section="${type}"><span>${safe(item.label)}</span><small>${safe(item.hint)}</small></button>`).join('');}
    function renderOutline(){const page=currentPage();outlineEl.innerHTML=page?.sections.length?page.sections.map((item,index)=>`<div class="studio-outline-item${item.id===selectedId?' is-selected':''}" data-outline-id="${safe(item.id)}"><button type="button" data-section-command="select" aria-label="Select ${safe(SECTION_LIBRARY[item.type]?.label)}">${String(index+1).padStart(2,'0')}</button><div class="studio-outline-copy"><strong>${safe(SECTION_LIBRARY[item.type]?.label||item.type)}</strong><small>${safe(item.content.title||item.content.brand||item.content.eyebrow||'Section')}</small></div><div class="studio-outline-controls"><button type="button" data-section-command="up" aria-label="Move up">↑</button><button type="button" data-section-command="down" aria-label="Move down">↓</button></div></div>`).join(''):'<div class="studio-outline-empty">Add a section to begin this page.</div>';}
    function renderPreview(){const page=currentPage();preview.innerHTML=page?renderPage(project,page,selectedId):'<div class="project-empty"><h2>No page selected</h2></div>';document.querySelector('[data-preview-url]').textContent=`${slugify(project.name)}.local/${page?.slug==='index'?'':page?.slug||''}`;}
    function renderVersions(){const versions=project.versions||[];versionList.innerHTML=versions.length?versions.slice().reverse().map(version=>`<div class="studio-version-card"><div><strong>${safe(version.name)}</strong><small>${safe(formatDate(version.createdAt))}${version.note?` · ${safe(version.note)}`:''}</small></div><button type="button" data-restore-version="${safe(version.id)}">Restore</button></div>`).join(''):'<p class="studio-version-empty">No named versions yet. Autosave still protects the current working state.</p>';}
    function renderInspector(){const item=selectedSection();empty.hidden=!!item;form.hidden=!item;if(!item){inspectorTitle.textContent='Choose a section';form.innerHTML='';return;}const definition=SECTION_LIBRARY[item.type];inspectorTitle.textContent=definition?.label||item.type;form.innerHTML=(FIELD_SCHEMAS[item.type]||[]).map(([key,label,kind])=>`<label>${safe(label)}${kind==='textarea'?`<textarea name="${key}" rows="${key==='items'||key==='body'?5:3}">${safe(item.content[key])}</textarea>`:`<input name="${key}" value="${safe(item.content[key])}">`}</label>`).join('')+`<div class="studio-inspector-actions"><button type="button" data-inspector-action="duplicate">Duplicate</button><button type="button" data-inspector-action="delete">Delete section</button></div>`;}
    function renderAll(){nameInput.value=project.name;themeSelect.innerHTML=themeOptions(project.theme);renderPages();renderLibrary();renderOutline();renderPreview();renderInspector();renderVersions();}
    function selectSection(id){selectedId=id;renderOutline();renderPreview();renderInspector();if(innerWidth<=1180)shell.setAttribute('data-inspector-open','');}
    function addSection(type){const page=currentPage(),item=section(type);page.sections.push(item);selectSection(item.id);queuePersist();}
    function removeSection(id){const page=currentPage(),index=page.sections.findIndex(item=>item.id===id);if(index<0)return;page.sections.splice(index,1);selectedId=page.sections[Math.min(index,page.sections.length-1)]?.id||'';renderAll();queuePersist();}
    function duplicateSection(id){const page=currentPage(),index=page.sections.findIndex(item=>item.id===id);if(index<0)return;const copy=clone(page.sections[index]);copy.id=uid('section');page.sections.splice(index+1,0,copy);selectedId=copy.id;renderAll();queuePersist();}
    nameInput.addEventListener('input',()=>{project.name=nameInput.value||'Untitled Project';renderPreview();queuePersist();});
    themeSelect.addEventListener('change',()=>{project.theme=themeSelect.value;systems().apply(project.theme);renderPreview();queuePersist();});
    pagesEl.addEventListener('click',event=>{const button=event.target.closest('[data-page-id]');if(!button)return;project.activePage=button.dataset.pageId;selectedId=currentPage()?.sections[0]?.id||'';renderAll();queuePersist();});
    libraryEl.addEventListener('click',event=>{const button=event.target.closest('[data-add-section]');if(button)addSection(button.dataset.addSection);});
    outlineEl.addEventListener('click',event=>{const button=event.target.closest('[data-section-command]'),row=event.target.closest('[data-outline-id]');if(!button||!row)return;const page=currentPage(),index=page.sections.findIndex(item=>item.id===row.dataset.outlineId),command=button.dataset.sectionCommand;if(command==='select')return selectSection(row.dataset.outlineId);if(command==='up'&&index>0)[page.sections[index-1],page.sections[index]]=[page.sections[index],page.sections[index-1]];if(command==='down'&&index<page.sections.length-1)[page.sections[index+1],page.sections[index]]=[page.sections[index],page.sections[index+1]];renderOutline();renderPreview();queuePersist();});
    preview.addEventListener('click',event=>{const item=event.target.closest('[data-studio-section]');if(!item)return;event.preventDefault();selectSection(item.dataset.studioSection);});
    form.addEventListener('input',event=>{const item=selectedSection();if(!item||!event.target.name)return;item.content[event.target.name]=event.target.value;renderOutline();renderPreview();queuePersist();});
    form.addEventListener('click',event=>{const button=event.target.closest('[data-inspector-action]'),item=selectedSection();if(!button||!item)return;button.dataset.inspectorAction==='duplicate'?duplicateSection(item.id):removeSection(item.id);});
    app.querySelectorAll('[data-studio-viewport]').forEach(button=>button.addEventListener('click',()=>{stage.dataset.viewport=button.dataset.studioViewport;app.querySelectorAll('[data-studio-viewport]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));const widths={desktop:'1440',tablet:'820',mobile:'390'};document.querySelector('[data-preview-label]').textContent=`${button.dataset.studioViewport} preview · ${widths[button.dataset.studioViewport]}`;}));
    app.querySelector('[data-collapse-inspector]').addEventListener('click',()=>shell.removeAttribute('data-inspector-open'));
    app.querySelectorAll('[data-mobile-panel]').forEach(button=>button.addEventListener('click',()=>{shell.dataset.mobilePanel=button.dataset.mobilePanel;app.querySelectorAll('[data-mobile-panel]').forEach(item=>item.setAttribute('aria-selected',String(item===button)));if(button.dataset.mobilePanel==='inspector')shell.setAttribute('data-inspector-open','');else shell.removeAttribute('data-inspector-open');}));
    const pageDialog=document.querySelector('[data-page-dialog]'),pageForm=document.querySelector('[data-page-form]');app.querySelector('[data-add-page]').addEventListener('click',()=>{pageForm.reset();pageDialog.showModal?.();});document.querySelectorAll('[data-close-page]').forEach(button=>button.addEventListener('click',()=>pageDialog.close?.()));pageForm.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(pageForm),name=data.get('name'),page=starterPage('generic',name);page.slug=slugify(data.get('slug')||name);project.pages.push(page);project.activePage=page.id;selectedId=page.sections[0].id;pageDialog.close?.();renderAll();queuePersist();});
    const versionDialog=document.querySelector('[data-version-dialog]'),versionForm=document.querySelector('[data-version-form]');app.querySelector('[data-save-version]').addEventListener('click',()=>{versionForm.reset();versionDialog.showModal?.();});document.querySelectorAll('[data-close-version]').forEach(button=>button.addEventListener('click',()=>versionDialog.close?.()));versionForm.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(versionForm),snapshot=clone(project);delete snapshot.versions;project.versions||(project.versions=[]);project.versions.push({id:uid('version'),name:data.get('name'),note:data.get('note'),createdAt:new Date().toISOString(),snapshot});if(project.versions.length>30)project.versions.shift();versionDialog.close?.();renderVersions();persist('Version saved');});versionList.addEventListener('click',event=>{const button=event.target.closest('[data-restore-version]');if(!button)return;const version=project.versions.find(item=>item.id===button.dataset.restoreVersion);if(!version||!confirm(`Restore “${version.name}”? The current autosaved state will be replaced.`))return;const preservedVersions=project.versions;Object.assign(project,clone(version.snapshot));project.versions=preservedVersions;selectedId=currentPage()?.sections[0]?.id||'';systems().apply(project.theme);renderAll();persist('Version restored');});
    app.querySelector('[data-export-site]').addEventListener('click',async event=>{const button=event.currentTarget,original=button.textContent;button.disabled=true;button.textContent='Packaging…';status.textContent='Preparing website…';try{persist();const zip=await buildSiteZip(project);download(`${slugify(project.name)}-website.zip`,zip,'application/zip');status.textContent='Website exported';}catch(error){console.error(error);status.textContent='Export failed';alert('The website could not be packaged. Try again from the published site.');}finally{button.disabled=false;button.textContent=original;}});
    renderAll();persist('Project ready');
  }

  initHome();
  initProjects();
  initStudio();
})();
