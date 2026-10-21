import './vocabulary.js';
import {createWorld,copy,step,metrics,addOtter,addUrchin,addSmall,plant,DT} from './model.mjs';
import {challenges,challengeWorld,goalState,advanceGoal,editedGoal,goalRequirements,questions} from './challenges.mjs';
import {createView} from './visuals.js';
const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const paths={
 star:'M12 2l3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1Z',mussel:'M6 20Q0 8 13 3q11 1 7 12Q17 24 6 20Zm0 0L16 7',
 crab:'M5 12h14M7 9q5-5 10 0v5q-5 5-10 0ZM5 10 2 7V3m17 7 3-3V3M7 14l-4 5m8-3-1 5m7-7 4 5',slug:'M3 17q0-7 6-7h7V5m-2 6 6-5m-4 6q7 1 5 6Q10 23 3 17Z',algae:'M6 21Q0 12 8 3m4 18Q5 10 15 2m2 19q-4-7 5-14',
 next:'M4 12h16m-6-6 6 6-6 6',play:'m8 4 12 8-12 8Z',pause:'M8 4v16M16 4v16',
 reset:'M4 8a8 8 0 1 1 0 8M4 3v5h5',help:'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 4v.1',
 eye:'M2 12C5 5 19 5 22 12C19 19 5 19 2 12ZM9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
 up:'m5 11 7-7 7 7M12 4v17',down:'m5 13 7 7 7-7M12 3v17',same:'M3 9h18M3 15h18',
 zoom:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 7 7M7 10h6m-3-3v6',
 plus:'M12 3v18M3 12h18',minus:'M4 12h16',check:'m4 12 5 5L20 6',
 kelp:'M12 22V3M12 8C3 9 3 3 4 2c5 0 8 2 8 6ZM12 14c9 1 10-5 9-7-6 0-9 3-9 7ZM12 20C4 20 2 14 3 12c6 0 9 4 9 8Z',
 urchin:'M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3M7 12a5 5 0 1 0 10 0 5 5 0 0 0-10 0Z',
 otter:'M7 8C4 6 5 2 8 4c3-2 5-2 8 0 3-2 4 2 1 4 3 3 2 8 0 10-2 3-8 3-10 0-2-3-3-7 0-10ZM9 9h.1M15 9h.1M10 12q2 2 4 0M8 17l-3 4m11-4 3 4',
 fish:'M4 12c4-8 11-8 15 0-4 8-11 8-15 0Zm15 0 4-5v10ZM7 11h.1',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 6v6l4 2',
 hand:'M9 12V5a2 2 0 0 1 4 0v7-4a2 2 0 0 1 4 0v5-2a2 2 0 0 1 4 0v5c0 4-3 6-7 6-3 0-4-2-6-4l-4-5c-1-2 1-4 3-2l2 1',
 compare:'M4 4v16M20 4v16M8 8l-4 4 4 4M16 8l4 4-4 4M4 12h16'
};
const icon=k=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[k]||paths.next}"/></svg>`;
function button(parent,id,label,ico,fn,primary=false){
 const b=document.createElement('button');b.id=id;b.className='ml-control'+(primary?' ml-control--primary':'');
 b.innerHTML=icon(ico)+`<span class="ml-button-label">${label}</span>`;b.onclick=fn;$(parent).append(b);return b;
}
function say(t){$('instruction').textContent=t;}
$('help').innerHTML=icon('help');
$('menu-button').innerHTML=icon('compare')+'<span class="ml-button-label">Menu</span>';
for(const key of ['kelp','urchin','fish'])$('meters').insertAdjacentHTML('beforeend',`<div class="meter">${icon(key)}<div class="meter-track"><div class="meter-fill" id="meter-${key}"></div></div></div>`);
let view;
try{view=createView($('world'));}catch(e){document.querySelector('main').dataset.stage='unavailable';for(const id of ['help','menu-button','meters'])$(id).style.display='none';say('Open this file in a browser with WebGL enabled to see the underwater world.');throw e;}
let world=createWorld('forest',27),mode=null,stage='intro',running=false,demo=false,time=0,acc=0,speed=1;
let state=null,drag=null,down=null,inspectTarget=null,highlightUntil=0,undoState=null,noticeUntil=0,discoveryAdded=false,discoveryRemoved=false;
const sessions=new Map(),completed=new Map(),reflectionExposures=new Set();let discoverySeen=false,chainOrder=[],chainAttempts=0,chainFirstCorrect=null;
function clearUI(){scenePointers.clear();pinchDistance=0;for(const id of ['controls','tools','choices','menu-options','timeline','food-chain'])$(id).replaceChildren();$('timeline').hidden=true;$('drag-ghost').hidden=true;view.inspect(null);view.clearHighlight();inspectTarget=null;drag=null;}
function setStage(next){stage=next;clearUI();document.querySelector('main').dataset.stage=stage;document.querySelector('main').dataset.goals=String(!!challenges[mode]&&stage==='exploring');document.querySelector('main').dataset.meadow=String(!!world.meadow);document.querySelector('main').dataset.web=String(world.kind==='web');document.querySelector('h1').textContent=mode?(challenges[mode]?.title||({'explore-forest':'Explore the kelp forest','explore-meadow':'Explore the eelgrass meadow','explore-web':'Explore the rocky coast'}[mode])||'Open exploration'):stage==='menu'?'Choose an investigation':'Discover the forest';$('run-progress').hidden=true;$('world').tabIndex=canView()?0:-1;document.querySelector('#meter-urchin').closest('.meter').querySelector('svg').outerHTML=icon(world.meadow?'slug':'urchin');document.querySelector('#meter-fish').closest('.meter').querySelector('svg').outerHTML=icon(world.meadow?'algae':'fish');}
function fresh(id){const w=challengeWorld(id);return {world:w,baseline:copy(w),start:copy(w),goal:goalState(),edits:0,running:true,speed:1,stage:'exploring',answers:[],question:0,feedback:false,assisted:false,previous:null,lastDeparture:0};}
function saveMode(){if(mode&&state){state.world=world;state.running=running;state.speed=speed;state.stage=stage;sessions.set(mode,state);}}
function showMenu(){saveMode();running=demo=false;mode=null;state=null;acc=0;setStage('menu');say('Choose a challenge, or revisit the discovery.');
 for(const [id,c]of Object.entries(challenges)){const done=completed.get(id);const b=button('menu-options','mode-'+id,c.title,done?.understood?'check':done?'clock':id==='rescue'?'kelp':id==='community'?'urchin':id==='meadow'?'slug':'algae',()=>enterMode(id));b.setAttribute('aria-label',c.title+(done?done.understood?' — goal achieved; reflection correct':' — goal achieved; reflection needs practice':''));}
 button('menu-options','mode-explore','Free exploration','otter',showEcosystems);
 button('menu-options','replay-discovery','Replay discovery','eye',startDiscovery);
}
function showEcosystems(){saveMode();running=demo=false;mode=null;state=null;setStage('menu');document.querySelector('h1').textContent='Free exploration';say('Choose an ecosystem to explore.');
 for(const [id,label,ico]of [['forest','Kelp forest','kelp'],['meadow','Eelgrass meadow','slug'],['web','Rocky coast food web','star']])button('menu-options','ecosystem-'+id,label,ico,()=>enterMode('explore-'+id));
 button('menu-options','back-investigations','Back to investigations','next',showMenu);
}
function startDiscovery(){view.resetView();mode=null;state=null;world=createWorld('forest',27);running=demo=false;discoveryAdded=discoveryRemoved=false;chainOrder=[];chainAttempts=0;chainFirstCorrect=null;setStage('intro');say('Can an otter help a forest grow? Follow one to see what it eats.');button('controls','follow','Follow an otter','otter',()=>observe('otter'),true);button('controls','skip-discovery','Choose an investigation','next',showMenu);}
function grazerWorld(){const w=createWorld('thin',41),k=w.kelp[24];k.b=.95;w.otters=[];w.urchins=[{...w.urchins[0],x:k.x,z:k.z+2.1}];return w;}
function observe(kind){if(kind==='urchin'){world=grazerWorld();acc=0;}setStage('observe-'+kind);demo=true;inspectTarget=kind;if(kind==='otter'){say('Otters hunt urchins for food. Watch this one dive.');button('controls','watch-urchin','Follow an urchin','urchin',()=>observe('urchin'),true);}else{say('Watch this urchin creep towards the kelp and graze at its base.');button('controls','try-editing','Try it yourself','hand',learnRemove,true);}}
function learnRemove(){demo=running=false;world=createWorld('thin',41);addOtter(world,-5,3);state={...fresh('rescue'),world,goal:goalState()};setStage('learn-remove');say('Tap the otter in the water to remove it. Keyboard: focus Otter and press Delete.');organismTray();}
function learnAdd(){setStage('learn-add');say('Now drag an otter into the water, or tap its tray token to add one.');organismTray();}
function startRescue(){running=true;acc=0;setStage('discovery-rescue');say('Bring back the kelp. Add life or remove it, then watch what changes.');organismTray();playControls();}
function renderChain(feedback){
 say(feedback||'Put the food chain in order. Tap the food first; each arrow means “is eaten by”.');
 for(let i=0;i<3;i++){
  if(i){const arrow=document.createElement('span');arrow.className='chain-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');$('food-chain').append(arrow);}
  const kind=chainOrder[i],b=button('food-chain','chain-slot-'+i,kind?kind[0].toUpperCase()+kind.slice(1):String(i+1),kind||'plus',()=>{if(!kind)return;chainOrder.splice(i,1);setStage('discovery-chain');renderChain();});
  b.classList.add('chain-slot');b.disabled=!kind;b.setAttribute('aria-label',kind?'Remove '+kind+' from position '+(i+1):'Empty food chain position '+(i+1));
 }
 for(const kind of ['otter','kelp','urchin']){const b=button('choices','chain-pick-'+kind,kind[0].toUpperCase()+kind.slice(1),kind,()=>{chainOrder.push(kind);setStage('discovery-chain');renderChain();});b.disabled=chainOrder.includes(kind);}
 button('controls','check-chain','Check','check',()=>{
  const correct=chainOrder.join(',')==='kelp,urchin,otter';chainAttempts++;if(chainAttempts===1)chainFirstCorrect=correct;
  if(correct){discoverySeen=true;setStage('discovery-done');say('Kelp is eaten by urchins, and urchins are eaten by otters. That is how an otter can help kelp survive.');button('controls','choose-forest','Choose an investigation','next',showMenu,true);}
  else{setStage('discovery-chain');renderChain('Check who eats whom: urchins eat kelp; otters eat urchins. Tap a placed species to change your order.');}
 },true).disabled=chainOrder.length!==3;
 button('controls','clear-chain','Start again','reset',()=>{chainOrder=[];setStage('discovery-chain');renderChain();});
}
function enterMode(id,reset=false){
 mode=id;demo=false;acc=0;undoState=null;noticeUntil=0;
 const old=sessions.get(id);state=reset?fresh(id):old||fresh(id);
 if(reset&&old)state.previous={world:copy(old.world),baseline:copy(old.baseline)};
 world=state.world;running=state.running;speed=state.speed;
 setStage(state.stage);renderMode();
}
function renderMode(){if(stage==='exploring'){say(goalText());organismTray();playControls();if(mode.startsWith('explore-'))button('controls','change-ecosystem','Ecosystem','kelp',showEcosystems);button('controls','compare','Compare','compare',compare);button('controls','reset-world','Replay start','reset',()=>{saveMode();enterMode(mode,true);});if(state.goal.achieved)finishButton();}
 else if(stage==='question')renderQuestion();else if(stage==='reflection-done')reflectionDone();else if(stage==='comparison')renderComparison();}
function goalText(){if(state?.goal.achieved&&challenges[mode])return 'Goal achieved. Keep experimenting, or finish to explain what you found.';return challenges[mode]?.goal||'Drag or tap tray life to add it. Tap life in the water to remove it.';}
function playControls(){button('controls','pause',running?'Pause':'Resume',running?'pause':'play',()=>{running=!running;acc=0;$('pause').innerHTML=icon(running?'pause':'play')+'<span class="ml-button-label">'+(running?'Pause':'Resume')+'</span>';});button('controls','speed',speed+'× speed','clock',()=>{speed=speed===1?3:speed===3?6:1;$('speed').innerHTML=icon('clock')+'<span class="ml-button-label">'+speed+'× speed</span>';});}
function finishButton(){if(!$('finish'))button('controls','finish','Finish investigation','check',beginReflection,true);}
function canView(){return ['exploring','discovery-rescue','learn-remove','learn-add'].includes(stage);}
function canEdit(){return ['exploring','discovery-rescue','learn-remove','learn-add'].includes(stage);}
function listFor(kind){return world[kind==='star'?'stars':kind==='mussel'?'mussels':kind==='otter'?'otters':kind==='urchin'?'urchins':kind==='crab'?'crabs':'slugs'];}
function organismTray(){
 for(const kind of world.kind==='web'?['otter','star','urchin','mussel','kelp']:world.meadow?['otter','crab','slug','kelp']:['otter','urchin','kelp']){
  const label=kind==='kelp'&&world.meadow?'Eelgrass':kind==='star'?'Sea star':kind==='slug'?'Sea slug':kind[0].toUpperCase()+kind.slice(1);
  const b=document.createElement('button');b.type='button';b.id='organism-'+kind;b.className='organism-token';
  b.innerHTML=icon(kind)+'<span>'+label+'</span>';b.setAttribute('aria-label',label+': tap or press Enter to add; drag into the forest to place; press Delete to remove one');b.setAttribute('aria-keyshortcuts','Delete Backspace');
  b.onpointerdown=e=>{if(!canEdit()||e.button!==0)return;e.preventDefault();b.setPointerCapture(e.pointerId);drag={kind,x:e.clientX,y:e.clientY,moved:false};};
  b.onpointermove=e=>{
   if(!drag||drag.kind!==kind)return;
   drag.moved ||= Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8;
   if(drag.moved){const p=view.pick(e.clientX,e.clientY);$('drag-ghost').hidden=false;$('drag-ghost').innerHTML=icon(kind);$('drag-ghost').style.left=e.clientX+'px';$('drag-ghost').style.top=e.clientY+'px';$('drag-ghost').dataset.valid=String(p.inside);if(p.inside)view.highlight(p.ground.x,p.ground.z);else view.clearHighlight();}
  };
  b.onpointerup=e=>{
   if(!drag)return;const d=drag;drag=null;$('drag-ghost').hidden=true;
   if(d.moved){const p=view.pick(e.clientX,e.clientY);const target=document.elementFromPoint(e.clientX,e.clientY);if(p.inside&&target&&$('world').contains(target))addLife(kind,p.ground);else view.clearHighlight();}
   else addLife(kind,defaultPosition(kind));
   if(b.hasPointerCapture(e.pointerId))b.releasePointerCapture(e.pointerId);
  };
  b.onpointercancel=()=>{drag=null;$('drag-ghost').hidden=true;view.clearHighlight();};
  b.onclick=e=>{if(e.detail===0&&!drag)addLife(kind,defaultPosition(kind));};
  b.onkeydown=e=>{if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();const obj=kind==='kelp'?[...world.kelp].sort((a,b)=>b.b-a.b)[0]:listFor(kind).find(a=>a.alive!==false);if(obj)removeLife({type:kind,id:obj.id});}};
  $('tools').append(b);
 }
}
function defaultPosition(kind){
 if(kind==='kelp'){const k=[...world.kelp].sort((a,b)=>a.b-b.b)[0];return {x:k.x,z:k.z};}
 if(kind==='slug'){const i=world.slugs.length%28,k=world.kelp[i];return {x:k.x,z:k.z};}
 const i=listFor(kind).filter(a=>a.alive!==false).length,spots=[[-5,3],[0,2],[5,3],[-4,-1],[3,-2],[7,0]];return {x:spots[i%6][0],z:spots[i%6][1]};
}
function beforeEdit(){undoState={world:copy(world),baseline:copy(state.baseline),goal:copy(state.goal),edits:state.edits};}
function edited(p){state.edits++;editedGoal(state.goal);view.highlight(p.x,p.z);highlightUntil=time+1;
 if(!$('undo')&&stage!=='learn-remove'&&stage!=='learn-add')button('tools','undo','Undo','reset',()=>{if(!undoState)return;world=copy(undoState.world);state.world=world;state.baseline=copy(undoState.baseline);state.goal=copy(undoState.goal);state.edits=undoState.edits;undoState=null;setStage(stage);if(stage==='discovery-rescue')startRescue();else renderMode();});
}
function notice(t){say(t);noticeUntil=time+6;}
function addLife(kind,p){if(!canEdit())return;if(stage==='learn-remove'){notice('First remove the otter in the water, or focus Otter and press Delete.');return;}if(stage==='learn-add'&&kind!=='otter'){notice('Add an otter first. You can try other changes next.');return;}
 const cap=kind==='star'?12:kind==='otter'?6:kind==='urchin'?120:kind==='crab'?32:100;
 if(kind!=='kelp'&&listFor(kind).filter(a=>a.alive!==false).length>=cap){notice('This small habitat has no room for more of those animals.');return;}
 if(kind==='kelp'&&[...world.kelp].sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0].b>=.999){notice('This patch is full. Try planting in a bare patch.');return;}
 beforeEdit();if(kind==='otter')addOtter(world,p.x,p.z);else if(kind==='urchin')addUrchin(world,p.x,p.z);else if(kind==='kelp'){const id=plant(world,p.x,p.z);p=world.kelp.find(k=>k.id===id);}else addSmall(world,kind,p.x,p.z);edited(p);
 if(stage==='learn-add'){discoveryAdded=true;startRescue();}
}
function removeLife(object){if(!canEdit()||!object)return;const kind=object.type;if(stage==='learn-remove'&&kind!=='otter')return;if(stage==='learn-add')return;
 const target=kind==='kelp'?world.kelp.find(k=>k.id===object.id&&k.b>.005):listFor(kind).find(a=>a.id===object.id&&a.alive!==false);if(!target)return;beforeEdit();
 if(kind==='kelp')target.b=0;else if(kind==='otter')world.otters=world.otters.filter(a=>a.id!==target.id);else target.alive=false;edited(target);
 if(stage==='learn-remove'){discoveryRemoved=true;learnAdd();}
}
function compare(){state.returnRunning=running;state.live=copy(world);running=false;state.branch='changed';setStage('comparison');renderComparison();}
function renderComparison(){say('Switch between your world and the same start left alone, at the same elapsed time.');
 button('controls','original','Left alone','eye',()=>showBranch('original'));button('controls','changed','Your changes','hand',()=>showBranch('changed'));
 if(state.previous)button('controls','previous','Last attempt','compare',()=>showBranch('previous'));
 button('controls','back-world','Back to the world','next',()=>{world=state.live;state.live=null;running=state.returnRunning;setStage('exploring');renderMode();},true);showBranch(state.branch||'changed');
}
function showBranch(branch){state.branch=branch;
 if(branch==='previous'){
  // Previous attempt is shown only at its own endpoint, with an explicit time distinction.
  world=copy(state.previous.world);say('Last attempt at its stopping point. Use “Left alone” for a matched-time comparison.');
 }else{world=copy(branch==='original'?state.baseline:state.live);say('Your world and the same start left alone, after equal elapsed time.');}
 for(const id of ['original','changed','previous'])$(id)?.setAttribute('aria-pressed',String(id===(branch==='original'?'original':branch==='previous'?'previous':'changed')));
}
function beginReflection(){if(!challenges[mode]||!state.goal.achieved)return;running=false;state.question=0;state.feedback=false;state.answers=[];state.assisted=reflectionExposures.has(mode);reflectionExposures.add(mode);setStage('question');renderQuestion();}
function renderQuestion(){const q=questions[mode][state.question];say(state.feedback?q.why:q.q);
 if(state.feedback){button('controls','next-question',state.question===1?'See reflection':'Next question','next',()=>{if(state.question===1){setStage('reflection-done');reflectionDone();}else{state.question++;state.feedback=false;setStage('question');renderQuestion();}},true);button('controls','investigate','Investigate again','eye',()=>{setStage('exploring');running=true;renderMode();});return;}
 for(let i=0;i<q.a.length;i++)button('choices','answer-'+i,q.a[i],i===0?'eye':i===1?'compare':'hand',()=>{state.answers.push({question:state.question,choice:i,correct:i===q.correct,assisted:state.assisted});state.feedback=true;setStage('question');renderQuestion();});
}
function reflectionDone(){const understood=state.answers.length===2&&state.answers.every(a=>a.correct&&!a.assisted);if(!completed.get(mode)?.understood)completed.set(mode,{goal:true,understood,answers:copy(state.answers)});
 say(understood?'You reached the goal and explained both relationships. Try the next investigation.':'You reached the goal. Some relationships need another look; try a change and watch its effects.');
 button('controls','choose-next','Choose an investigation','next',showMenu,true);button('controls','keep-exploring','Keep exploring','eye',()=>{running=true;setStage('exploring');renderMode();});
}
$('menu-button').onclick=showMenu;
$('help').onclick=()=>{
 if(stage==='discovery-rescue'){notice('Urchins graze kelp. Try another otter, or remove a few urchins, then watch the plants.');return;}
 if(stage==='question'){state.assisted=true;notice(questions[mode][state.question].why);return;}
 if(challenges[mode]){const c=challenges[mode],m=metrics(world);notice(c.hint);if(world.meadow){const s=world.slugs.find(a=>a.alive);if(s)view.inspect({x:s.x,y:.5,z:s.z,type:'urchin'});}state.hintUsed=true;return;}
 notice('Drag or tap a tray organism to add it. Tap life in the water to remove it. Pinch to zoom; drag the water to rotate. Keyboard: Enter adds; Delete removes.');
};
// Scene gestures own their pointers. Once a drag or pinch starts, neither finger
// can become a delete tap, even if it returns to its starting point.
const scenePointers=new Map();let pinchDistance=0;
addEventListener('keydown',e=>{if(e.key==='Escape'){scenePointers.clear();}});
$('world').addEventListener('keydown',e=>{if(!canView()||e.ctrlKey||e.metaKey||e.altKey)return;const moves={ArrowLeft:[-30,0],ArrowRight:[30,0],ArrowUp:[0,-20],ArrowDown:[0,20]};if(moves[e.key]){e.preventDefault();view.rotateBy(...moves[e.key]);}else if(e.key==='+'||e.key==='='){e.preventDefault();view.zoomBy(1.25);}else if(e.key==='-'){e.preventDefault();view.zoomBy(.8);}else if(e.key.toLowerCase()==='r'){e.preventDefault();view.resetView();}});
const spread=()=>{const p=[...scenePointers.values()];return p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0;};
$('world').addEventListener('pointerdown',e=>{
 if(!canView()||e.button!==0)return;
 view.inspect(null);if(noticeUntil){noticeUntil=0;if(stage==='exploring')say(goalText());else if(stage==='discovery-rescue')say('Bring back the kelp. Add life or remove it, then watch what changes.');}
 scenePointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false,object:view.pick(e.clientX,e.clientY).object});
 $('world').setPointerCapture(e.pointerId);
 if(scenePointers.size>1){for(const p of scenePointers.values())p.moved=true;pinchDistance=spread();}
});
$('world').addEventListener('pointermove',e=>{
 const p=scenePointers.get(e.pointerId);if(!p)return;
 const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(scenePointers.size>1){const d=spread();if(d>0&&pinchDistance>0)view.zoomBy(d/pinchDistance);pinchDistance=d;for(const q of scenePointers.values())q.moved=true;}
 else {if(Math.hypot(p.x-p.startX,p.y-p.startY)>8)p.moved=true;if(p.moved)view.rotateBy(dx,dy);}
});
$('world').addEventListener('pointerup',e=>{
 const p=scenePointers.get(e.pointerId);if(!p)return;
 scenePointers.delete(e.pointerId);pinchDistance=0;
 if(!p.moved&&Math.hypot(e.clientX-p.startX,e.clientY-p.startY)<=8&&canEdit())removeLife(p.object);
});
for(const name of ['pointercancel','lostpointercapture'])$('world').addEventListener(name,e=>{scenePointers.delete(e.pointerId);pinchDistance=0;for(const p of scenePointers.values())p.moved=true;});
$('world').addEventListener('wheel',e=>{if(!canView()||e.ctrlKey)return;e.preventDefault();view.inspect(null);view.zoomBy(Math.exp(-e.deltaY*.001));},{passive:false});
function tick(){step(world);if(state&&stage!=='comparison')step(state.baseline);
 if(stage==='exploring'&&challenges[mode]){const was=state.goal.achieved;advanceGoal(mode,state.goal,world,DT);if(!was&&state.goal.achieved){if(!completed.get(mode)?.understood)completed.set(mode,{goal:true,understood:false});notice('Goal achieved. Keep exploring, or finish to explain what you found.');finishButton();}}
 if(stage==='discovery-rescue'){advanceGoal('rescue',state.goal,world,DT);if(state.goal.achieved){running=false;chainOrder=[];setStage('discovery-chain');renderChain();}}
 if(stage==='exploring'&&world.departures>state.lastDeparture){state.lastDeparture=world.departures;notice('An otter ran short of food and left this small habitat.');}
 
 
}
let previous=performance.now();
function animate(now){requestAnimationFrame(animate);const dt=Math.min(.2,(now-previous)/1000);previous=now;time+=dt;
 if(stage==='cover'&&!reduced){world.time+=dt*.45;const o=world.otters[0];o.y=4.6+Math.sin(time*.65)*.16;o.heading=-.55+Math.sin(time*.3)*.08;}
 if(demo){acc+=dt*1.4;while(acc>=DT){step(world);acc-=DT;}if(world.time>(inspectTarget==='urchin'?28:18)){world=inspectTarget==='urchin'?grazerWorld():createWorld('forest',27);acc=0;}}
 if(running){acc+=dt*2.2*speed;while(acc>=DT&&running){tick();acc-=DT;}}
 if(noticeUntil&&time>noticeUntil){noticeUntil=0;view.inspect(null);if(stage==='exploring')say(goalText());}
 if(highlightUntil&&time>highlightUntil&&!drag)view.clearHighlight();
 if(demo&&inspectTarget){const a=inspectTarget==='otter'?world.otters[0]:world.urchins.find(u=>u.alive);if(a)view.inspect({x:a.x,y:a.y??.4,z:a.z,type:inspectTarget,...(inspectTarget==='urchin'?{foodId:24}:{})});}
 view.sync(world,time,reduced);
 const m=metrics(world);$('meter-kelp').style.height=m.kelp*100+'%';$('meter-urchin').style.height=Math.min(100,(world.meadow?m.slugs:m.urchins)/100*100)+'%';$('meter-fish').style.height=(world.meadow?m.algae:m.shelter/28)*100+'%';
 const showGoals=!!(state&&challenges[mode]&&stage==='exploring');$('goal-panel').hidden=!showGoals;$('meters').hidden=showGoals;
 if(showGoals){
  const requirements=goalRequirements(mode,m,world),key=requirements.map(r=>r.label+r.value+r.met).join('|');
  const goalList=$('goal-list'),labels=requirements.map(r=>r.label).join('|');
  // Keep word-help anchors alive while only live values change.
  if(goalList.dataset.labels!==labels){goalList.dataset.labels=labels;goalList.innerHTML=requirements.map(r=>`<li class="goal-item"><span class="goal-state" aria-hidden="true"></span><span class="goal-label">${r.label}</span><span class="goal-value"></span></li>`).join('');goalList.dataset.key='';}
  if(goalList.dataset.key!==key){goalList.dataset.key=key;[...goalList.children].forEach((item,i)=>{const r=requirements[i];item.dataset.met=String(r.met);item.setAttribute('aria-label',`${r.label}: ${r.met?'met':'not met'}. Current: ${r.value}`);item.querySelector('.goal-state').textContent=r.met?'✓':'○';item.querySelector('.goal-value').textContent=r.value;});}
  const allMet=requirements.every(r=>r.met),progress=state.goal.held/challenges[mode].hold;
  $('goal-timer').hidden=!allMet||state.goal.achieved;
  $('goal-timer').setAttribute('aria-valuenow',String(Math.round(progress*100)));
  $('goal-timer-fill').style.width=progress*100+'%';
  if(innerWidth>800){const bottom=$('lesson-panel').getBoundingClientRect().bottom;$('tools').style.top=(innerHeight<=700?Math.max(bottom+20,innerHeight*.53):bottom+20)+'px';}else $('tools').style.removeProperty('top');
 }else $('tools').style.removeProperty('top');
 $('world').setAttribute('aria-label',world.kind==='web'?`Rocky coast: ${m.otters} otters, ${m.stars} sea stars, ${m.urchins} urchins, ${m.mussels} mussels; kelp ${Math.round(m.kelp*100)} percent.`:world.meadow?`Meadow: ${m.otters} otters, ${m.crabs} crabs, ${m.slugs} sea slugs; eelgrass ${Math.round(m.kelp*100)} percent; algae coating ${Math.round(m.algae*100)} percent.`:`Forest: ${m.otters} otters, ${m.urchins} urchins; kelp ${Math.round(m.kelp*100)} percent.`);
}
setStage('cover');document.querySelector('h1').textContent='What roles do otters and urchins play in a kelp forest?';
world.otters=world.otters.slice(0,1);Object.assign(world.otters[0],{x:3,y:4.6,z:4,heading:-.55,energy:22});
world.kelp.forEach(k=>{if(k.z>0&&k.x<6)k.b=.12;});world.urchins=world.urchins.filter((u,i)=>i%3===0);
view.inspect({type:'cover'});$('cover-start').innerHTML=icon('next')+'<span>Let’s find out</span>';
$('cover-start').onclick=()=>{startDiscovery();$('follow').focus({preventScroll:true});};
requestAnimationFrame(animate);
window.otterForest={snapshot:()=>({stage,mode,running,speed,world:copy(world),metrics:metrics(world),goal:state?.goal,edits:state?.edits,answers:state?.answers,question:state?.question,feedback:state?.feedback,savedModes:[...sessions.keys()],completed:[...completed.entries()],reflectionExposures:[...reflectionExposures],discoverySeen,discoveryAdded,discoveryRemoved,chainOrder:[...chainOrder],chainAttempts,chainFirstCorrect,render:view.stats(),camera:view.viewState(),reduced}),project:(x,y,z)=>view.project(x,y,z)};
