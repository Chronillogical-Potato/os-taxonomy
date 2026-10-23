/* Reuses ../experience-vocabulary.js interaction treatment with an Otter Forest lexicon and drag-safe term activation. */
(()=>{
'use strict';
if(window.learningVocabulary)return;
const entries=[
 ['sea star',['sea star','sea stars'],'A sea animal with arms spreading out from its centre. Many kinds have five arms.'],
 ['mussel',['mussel','mussels'],'An animal with two shells joined together. It filters tiny bits of food from water.'],
 [
  "kelp forest",
  [
   "kelp forest",
   "kelp forests"
  ],
  "An underwater area where lots of tall kelp grow together."
 ],
 [
  "kelp",
  [
   "kelp"
  ],
  "Large seaweed that grows underwater and can form tall forests."
 ],
 [
  "otter",
  [
   "otter",
   "otters"
  ],
  "A furry animal. Sea otters spend most of their time in coastal water."
 ],
 [
  "urchin",
  [
   "urchin",
   "urchins",
   "sea urchin",
   "sea urchins"
  ],
  "A small sea animal with a round body covered in spines."
 ],
 [
  "algae",
  [
   "algae",
   "algal"
  ],
  "Living things that usually use sunlight to make food. Many kinds live in water."
 ],
 [
  "eelgrass",
  [
   "eelgrass"
  ],
  "A flowering plant that grows underwater in shallow coastal water."
 ],
 [
  "sea slug",
  [
   "sea slug",
   "sea slugs",
   "slug",
   "slugs"
  ],
  "A soft-bodied sea animal related to a snail, without an obvious outside shell."
 ],
 [
  "crab",
  [
   "crab",
   "crabs"
  ],
  "An animal with a hard outer shell, claws and legs that bend at joints."
 ],
 [
  "reef",
  [
   "reef",
   "reefs"
  ],
  "A raised area on the seabed, made of rock or built up by living things such as corals."
 ],
 [
  "meadow",
  [
   "meadow",
   "meadows"
  ],
  "A place covered in low-growing plants. Here, the plants grow underwater."
 ],
 [
  "inlet",
  [
   "inlet",
   "inlets"
  ],
  "A place where the sea reaches into the land, such as a small bay."
 ],
 [
  "species",
  [
   "species"
  ],
  "A kind of living thing, such as a particular kind of animal or plant."
 ],
 [
  "population",
  [
   "population",
   "populations"
  ],
  "All the living things of one kind in a particular place."
 ],
 [
  "community",
  [
   "community",
   "communities"
  ],
  "The different kinds of living things that live together in one place."
 ],
 [
  "ecosystem",
  [
   "ecosystem",
   "ecosystems"
  ],
  "Living things in a place, together with the water, light and other surroundings they depend on."
 ],
 [
  "habitat",
  [
   "habitat",
   "habitats"
  ],
  "The place where a living thing lives."
 ],
 [
  "food chain",
  [
   "food chain",
   "food chains"
  ],
  "A way to show a sequence of living things linked by who eats whom."
 ],
 [
  "predator",
  [
   "predator",
   "predators"
  ],
  "An animal that hunts and eats other animals."
 ],
 [
  "predation",
  [
   "predation"
  ],
  "One animal hunting and eating another animal."
 ],
 [
  "prey",
  [
   "prey"
  ],
  "An animal another animal hunts for food."
 ],
 [
  "grazer",
  [
   "grazer",
   "grazers"
  ],
  "An animal that eats algae or plants by nibbling or scraping them."
 ],
 [
  "grazing",
  [
   "graze",
   "grazes",
   "grazing"
  ],
  "Eating algae or plants by nibbling or scraping them."
 ],
 [
  "nutrient pulse",
  [
   "nutrient pulse",
   "nutrient pulses"
  ],
  "A temporary increase in nutrients entering the water."
 ],
 [
  "nutrient enrichment",
  [
   "nutrient enrichment"
  ],
  "An increase in the amount of nutrients available in a place."
 ],
 [
  "nutrient",
  [
   "nutrient",
   "nutrients"
  ],
  "Substances living things take in to grow and stay alive."
 ],
 [
  "consumer",
  [
   "consumer",
   "consumers"
  ],
  "A living thing that gets food by eating other living things or parts of them."
 ],
 [
  "reproduce",
  [
   "reproduce",
   "reproduces",
   "reproduction"
  ],
  "Make new living things of the same kind."
 ],
 [
  "persist",
  [
   "persist",
   "persists",
   "persisting"
  ],
  "Keep existing over time."
 ],
 [
  "intervention",
  [
   "intervention",
   "interventions"
  ],
  "A change you deliberately make to see or improve what happens."
 ],
 [
  "disturbance",
  [
   "disturbance",
   "disturbances"
  ],
  "An event or change that affects living things and their surroundings."
 ],
 [
  "observation",
  [
   "observation",
   "observations"
  ],
  "Something you notice by watching or checking carefully."
 ],
 [
  "baseline",
  [
   "baseline"
  ],
  "The starting state or comparison you use to judge a change."
 ]
];
const aliases=new Map(),definitions=new Map();for(const [key,words,text]of entries){definitions.set(key,text);for(const word of words)aliases.set(word,key);}
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('\\b('+[...aliases.keys()].sort((a,b)=>b.length-a.length).map(escape).join('|')+')\\b','gi');
const style=document.createElement('style');style.textContent=`
 body .vocab-term{display:inline!important;font:inherit!important;color:inherit!important;line-height:inherit!important;letter-spacing:inherit!important;border:0!important;border-radius:2px!important;padding:0!important;margin:0!important;background:none!important;box-shadow:none!important;text-decoration-line:underline;text-decoration-style:dashed;text-decoration-thickness:1.5px;text-underline-offset:.16em;cursor:help;pointer-events:auto!important;white-space:normal;transform:none!important;translate:none!important;min-height:0!important}
 body .vocab-term:hover,body .vocab-term:active{background:none!important;box-shadow:none!important;color:inherit!important;transform:none!important;translate:none!important}
 body .vocab-term:focus-visible{outline:3px solid #774dc7!important;outline-offset:4px}
 #vocab-popover{position:fixed;z-index:1000;width:max-content;max-width:min(330px,calc(100vw - 32px));margin:0;padding:18px 52px 20px 20px;border:2px solid #242722;border-radius:20px;background:#fffdf6;color:#253e38;box-shadow:0 5px 0 #242722;font-family:'Baloo 2',sans-serif;text-align:left;pointer-events:auto;box-sizing:border-box}
 #vocab-popover[hidden]{display:none!important}#vocab-word{display:block;margin:0 0 6px;font-size:16px;font-weight:500;line-height:1.2;opacity:.75}#vocab-definition{margin:0;font:500 21px/1.23 'Baloo 2',sans-serif;letter-spacing:-.2px}
 #vocab-close{position:absolute;right:4px;top:4px;display:grid;place-items:center;width:44px;height:44px;min-height:44px;margin:0;padding:0;border:0;border-radius:50%;background:transparent;color:#253e38;box-shadow:none;cursor:pointer;transform:none;translate:none}
 #vocab-close:hover{background:#efe7ce}#vocab-close svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}#vocab-close:focus-visible{outline:3px solid #774dc7;outline-offset:-3px}
 @media(max-width:600px){#vocab-definition{font-size:19px}#vocab-popover{max-width:calc(100vw - 32px)}}
 `;document.head.append(style);
const popup=document.createElement('aside');popup.id='vocab-popover';popup.hidden=true;popup.setAttribute('role','region');popup.setAttribute('aria-label','Word meaning');popup.dataset.vocabSkip='';
popup.innerHTML='<strong id="vocab-word"></strong><p id="vocab-definition"></p><button id="vocab-close" type="button" aria-label="Close definition"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button>';document.body.append(popup);
let descriptionTarget=null,savedDescription=null;
let anchor=null,pinned=false,leaveTimer=0,scheduled=false,restoringFocus=false;
function visible(el){return el?.isConnected&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden'&&!el.closest('[inert]');}
function position(){if(!anchor)return;const r=(anchor.closest('#instruction')||anchor).getBoundingClientRect(),w=popup.offsetWidth,h=popup.offsetHeight;popup.style.left=Math.max(16,Math.min(innerWidth-w-16,r.left+r.width/2-w/2))+'px';const below=r.bottom+12,top=below+h<=innerHeight-16?below:r.top-h-12;popup.style.top=Math.max(16,Math.min(innerHeight-h-16,top))+'px';}
function close(restore=false){clearTimeout(leaveTimer);const old=anchor;if(old&&old.getAttribute('role')==='button')old.setAttribute('aria-expanded','false');if(descriptionTarget){if(savedDescription===null)descriptionTarget.removeAttribute('aria-describedby');else descriptionTarget.setAttribute('aria-describedby',savedDescription);descriptionTarget=null;savedDescription=null;}anchor=null;pinned=false;popup.hidden=true;if(restore&&visible(old)){restoringFocus=true;(old.closest('button')||old).focus({preventScroll:true});restoringFocus=false;}}
function open(term,pin=false){if(!visible(term))return;clearTimeout(leaveTimer);if(anchor!==term)close();anchor=term;pinned=pinned||pin;popup.querySelector('#vocab-word').textContent=term.textContent;popup.querySelector('#vocab-definition').textContent=definitions.get(term.dataset.vocabKey);if(term.getAttribute('role')==='button')term.setAttribute('aria-expanded','true');if(!descriptionTarget){descriptionTarget=term.closest('button,a')||term;savedDescription=descriptionTarget.getAttribute('aria-describedby');}descriptionTarget.setAttribute('aria-describedby',((savedDescription||'')+' vocab-definition').trim());popup.hidden=false;position();}
function activate(term){if(anchor===term&&pinned)close();else open(term,true);}
function laterClose(){clearTimeout(leaveTimer);if(!pinned)leaveTimer=setTimeout(()=>{if(!popup.matches(':hover')&&!anchor?.matches(':hover')&&document.activeElement!==anchor&&!popup.contains(document.activeElement))close();},180);}
// Keep interactive term wrapping outside live regions. Mirror only changed plain
// text into dedicated announcers, so one instruction update produces one update.
const liveSources=new Map();
function prepareAnnouncements(){
 for(const source of document.querySelectorAll('[aria-live],[role="status"],[role="alert"]')){
  if(source.closest('[data-vocab-skip]')||liveSources.has(source))continue;
  const mode=source.getAttribute('aria-live')||(source.getAttribute('role')==='alert'?'assertive':'polite');
  if(mode==='off')continue;
  const announcer=document.createElement('div');announcer.dataset.vocabSkip='';
  announcer.className='vocab-announcer';announcer.setAttribute('aria-live',mode);announcer.setAttribute('aria-atomic','true');
  announcer.style.cssText='position:fixed;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;pointer-events:none';
  source.setAttribute('aria-live','off');
  if(['status','alert'].includes(source.getAttribute('role')))source.removeAttribute('role');
  document.body.append(announcer);liveSources.set(source,{announcer,text:''});
 }
}
function syncAnnouncements(){
 for(const [source,entry]of liveSources){
  if(!source.isConnected){entry.announcer.remove();liveSources.delete(source);continue;}
  const text=visible(source)?source.textContent.trim():'';
  if(text!==entry.text){entry.text=text;entry.announcer.textContent=text;}
 }
}
function annotate(){
 prepareAnnouncements();
 if(anchor&&!visible(anchor))close();
 const nodes=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
  const p=n.parentElement;if(!p||!n.data.trim()||p.closest('script,style,svg,canvas,textarea,input,option,button,[role=button],a,label,summary,.vocab-term,#vocab-popover,[data-vocab-skip]'))return NodeFilter.FILTER_REJECT;
  pattern.lastIndex=0;return pattern.test(n.data)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
 }});while(walker.nextNode())nodes.push(walker.currentNode);
 for(const n of nodes){if(!n.isConnected)continue;const label=n.parentElement.closest('label');if(label?.control&&!label.control.hasAttribute('aria-label'))label.control.setAttribute('aria-label',label.textContent.trim());pattern.lastIndex=0;const matches=[...n.data.matchAll(pattern)],frag=document.createDocumentFragment();let end=0;
  for(const m of matches){frag.append(document.createTextNode(n.data.slice(end,m.index)));const term=document.createElement('span');term.className='vocab-term';term.dataset.vocabKey=aliases.get(m[0].toLowerCase());term.textContent=m[0];const control=n.parentElement.closest('button,a');if(!control){term.tabIndex=0;term.setAttribute('role','button');term.setAttribute('aria-label','Explain '+m[0]);}if(!control){term.setAttribute('aria-controls','vocab-popover');term.setAttribute('aria-expanded','false');}frag.append(term);end=m.index+m[0].length;}
  frag.append(document.createTextNode(n.data.slice(end)));n.replaceWith(frag);
 }
 syncAnnouncements();
}
const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;annotate();});});observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','inert','class','data-screen']});
document.addEventListener('pointerover',e=>{if(e.pointerType!=='mouse')return;const term=e.target.closest('.vocab-term');if(term)open(term);else if(popup.contains(e.target))clearTimeout(leaveTimer);});
document.addEventListener('pointerout',e=>{if(e.pointerType==='mouse'&&(e.target.closest('.vocab-term')||popup.contains(e.target)))laterClose();});
document.addEventListener('pointerdown',e=>{if(e.target.closest('.vocab-term')){e.stopImmediatePropagation();return;}if(anchor&&!popup.contains(e.target)&&!e.target.closest('.vocab-term'))close();},true);
document.addEventListener('pointerup',e=>{if(e.target.closest('.vocab-term'))e.stopImmediatePropagation();},true);
document.addEventListener('click',e=>{const term=e.target.closest('.vocab-term');if(!term)return;e.preventDefault();e.stopImmediatePropagation();activate(term);},true);
document.addEventListener('focusin',e=>{if(restoringFocus)return;const term=e.target.closest('.vocab-term')||e.target.closest('button,a')?.querySelector('.vocab-term');if(term&&e.target.matches(':focus-visible'))open(term);else if(!popup.contains(e.target)&&!e.target.closest('.vocab-term'))close();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&anchor){e.preventDefault();e.stopImmediatePropagation();close(true);return;}const term=e.target.closest('.vocab-term');if(term&&!term.closest('button,a')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();activate(term);}},true);
popup.querySelector('button').onclick=()=>close(true);
addEventListener('resize',()=>{if(anchor){if(visible(anchor))position();else close();}});document.addEventListener('scroll',()=>{if(anchor)position();},true);
window.learningVocabulary={refresh:annotate,close,definitions:()=>Object.fromEntries(definitions)};annotate();
})();
