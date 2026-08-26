import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const check=process.argv.includes('--check');
const encodeFile=(path,mime)=>`data:${mime};base64,${readFileSync(path).toString('base64')}`;

let css=readFileSync(join(root,'shared/styles.css'),'utf8');
for(const [file,mime] of [
  ['archivo-latin-variable.woff2','font/woff2'],
  ['space-grotesk-latin-variable.woff2','font/woff2'],
  ['source-serif-4-latin-variable.woff2','font/woff2'],
  ['ibm-plex-mono-latin-400.woff2','font/woff2'],
  ['ibm-plex-mono-latin-500.woff2','font/woff2'],
  ['ibm-plex-mono-latin-600.woff2','font/woff2'],
  ['ibm-plex-mono-latin-700.woff2','font/woff2']
])css=css.replaceAll(`fonts/${file}`,encodeFile(join(root,'shared/fonts',file),mime));

css=css.replaceAll('</style','<\\/style');
const js=readFileSync(join(root,'shared/site.js'),'utf8').replaceAll('</script','<\\/script');
const favicon=encodeFile(join(root,'favicon.png'),'image/png');

function render(source){
  return readFileSync(join(root,source),'utf8')
    .replace(/<link rel="stylesheet" href="shared\/styles\.css(?:\?[^"']*)?">/,()=>`<style>\n${css}\n</style>`)
    .replace(/\s*<link rel="stylesheet" href="shared\/studio\.css(?:\?[^"']*)?">/,'')
    .replace('<link rel="icon" type="image/png" href="favicon.png">',()=>`<link rel="icon" type="image/png" href="${favicon}">`)
    .replace(/<script src="shared\/site\.js(?:\?[^"']*)?"><\/script>/,()=>`<script>\n${js}\n</script>`)
    .replace(/<script src="shared\/studio\.js(?:\?[^"']*)?"><\/script>/,'');
}

const outputs=[
  ['index.html','homepage-standalone.html'],
  ['index.html','visual-review-2045.html'],
  ['build.html','build-standalone.html']
];

const stale=[];
for(const [source,target] of outputs){
  const next=render(source),path=join(root,target);
  if(check){if(readFileSync(path,'utf8')!==next)stale.push(target);}
  else writeFileSync(path,next);
}

if(stale.length){
  console.error(`Standalone previews are stale: ${stale.join(', ')}. Run npm run build:standalone.`);
  process.exit(1);
}

console.log(check?'PASS: standalone previews match shared CSS, JavaScript, fonts, and favicon.':'Built homepage-standalone.html, build-standalone.html, and visual-review-2045.html.');
