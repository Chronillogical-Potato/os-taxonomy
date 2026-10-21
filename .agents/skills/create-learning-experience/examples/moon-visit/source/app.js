import '../../vocabulary.js';
import {createOpening} from '../../opening.mjs';
import * as THREE from 'three';
import {createSunVisual,createSpaceBackground} from './space-visuals.mjs';
import {createEarthVisual,createExplorerVisual} from './world-visuals.mjs';
import {createGroundView} from './ground-view.mjs';
import {R, ORBIT, facts, makeTasks, scorePath, sessionEvidence} from './model.mjs';
const $ = id => document.getElementById(id);
const canvas = $('world'), instruction = $('instruction');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const paths = {
 eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 yes:'<path d="M2 15s3.5-5 10-5 10 5 10 5-3.5 5-10 5S2 15 2 15Z"/><circle cx="12" cy="15" r="2.5"/><path d="M16 2a4 4 0 1 0 5 5 4 4 0 0 1-5-5Z"/>',
 no:'<path d="M2 15s3.5-5 10-5 10 5 10 5-3.5 5-10 5S2 15 2 15Z"/><circle cx="12" cy="15" r="2.5"/><path d="m3 22 18-18"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
 next:'<path d="m9 5 7 7-7 7"/>',
 reset:'<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>',
 hint:'<path d="M8 16c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7M8 17h8M9 21h6"/>',
 star:'<path d="m12 2 3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
 moon:'<path d="M16 3A9 9 0 1 0 21 15a9 9 0 0 1-5-12Z"/>',
};
const buttonLabels={eye:'See the sky',next:'Continue',reset:'Start again',hint:'Hint',yes:'Yes',no:'No',extra:'Explore more',lookSun:'Look at Sun',lookMoon:'Look at Moon'};
function icon(el, type) {
 const label=el.id==='eye'&&type==='globe'?'Back to space':el.id==='next'&&type==='reset'?'Try again':buttonLabels[el.id];
 el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[type]}</svg>${label?`<span class="button-label">${label}</span>`:''}`;
}
for (const [id, type] of [['eye','eye'],['next','next'],['reset','reset'],['hint','hint'],['yes','yes'],['no','no'],['extra','star'],['lookSun','sun'],['lookMoon','moon']]) icon($(id),type);
function say(text) { instruction.textContent = text; }
function show(id, value) { $(id).hidden = !value; }
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:false}); }
catch { say('This device cannot show the 3D model. Try a browser with WebGL.'); for(const id of ['earth','sun','moon','observer','reset']) show(id,false); throw new Error('WebGL unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#0b1726');
const overview = new THREE.OrthographicCamera();
overview.position.set(0,0,24); overview.lookAt(0,0,0);
scene.add(new THREE.AmbientLight(0x8cabcb,.09));
const sunlight = new THREE.PointLight(0xfff3d7,3.2,0,0); sunlight.position.set(-6.3,0,0);scene.add(sunlight);
function mesh(geo,mat,parent=scene) { const m=new THREE.Mesh(geo,mat); parent.add(m); return m; }
function standard(color, extra={}) { return new THREE.MeshStandardMaterial({color, roughness:.9,...extra}); }
const globe=createEarthVisual(R);const earthGroup=globe.root;scene.add(earthGroup);const earth=globe.surface;
// Kept as a visibility hook for existing presentation states; the globe has a clean ink silhouette.
const atmosphere=new THREE.Group();scene.add(atmosphere);
const moonGroup = new THREE.Group();scene.add(moonGroup);
function moonTexture(){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#c4c7c9';ctx.fillRect(0,0,512,256);let seed=43;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<180;i++){const x=rand()*512,y=rand()*256,r=2+rand()*12;ctx.fillStyle=i%7===0?'#939a9f':'#a9afb3';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#e3e4df';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(x,y,r,.3,2.9);ctx.stroke();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
const moon=mesh(new THREE.SphereGeometry(.49,64,48),standard('#ffffff',{map:moonTexture()}),moonGroup);
const solar=createSunVisual(.84);const sun=solar.root;sun.position.set(-6.3,0,0);scene.add(sun);
const explorer=createExplorerVisual();const observerGroup=explorer.root;scene.add(observerGroup);
// Rings and rays are scaffolds, never answer cues before an independent commitment.
function ring(radius,color,opacity=1){const m=mesh(new THREE.TorusGeometry(radius,.012,8,128),new THREE.MeshBasicMaterial({color,transparent:true,opacity}));return m;}
const turnRing=ring(R+.26,'#76a6be',.7);
const orbitRing=ring(ORBIT,'#688497',.16);
const focusSun=ring(1.03,'#ffe4a5');focusSun.position.copy(sun.position);
const focusMoon=ring(.67,'#ffe4a5');
const focusObserver=ring(.27,'#ffe4a5');
const horizonMat=new THREE.LineDashedMaterial({color:'#a9e0f5',dashSize:.1,gapSize:.07,transparent:true,opacity:.8});
const horizon = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.2,0,0),new THREE.Vector3(2.2,0,0)]),horizonMat);horizon.computeLineDistances();scene.add(horizon);
const skyArc= new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:'#9edbf6',transparent:true,opacity:.28}));scene.add(skyArc);
const spaceBackground=createSpaceBackground();const stars=spaceBackground.root;scene.add(stars);
const rayGroup=new THREE.Group();scene.add(rayGroup);const packets=[];
function clearRays(){while(rayGroup.children.length){const child=rayGroup.children[0];child.geometry?.dispose();child.material?.dispose();rayGroup.remove(child);}packets.length=0;}
function addRay(from,to,color){const a=from.clone(),b=to.clone();a.z=.2;b.z=.2;const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([a,b]),new THREE.LineDashedMaterial({color,dashSize:.12,gapSize:.08,transparent:true,opacity:.75}));line.computeLineDistances();rayGroup.add(line);const ball=mesh(new THREE.SphereGeometry(.055,12,8),new THREE.MeshBasicMaterial({color}),rayGroup);packets.push({a,b,ball});}
const ground=createGroundView({moonMap:moon.material.map});
const sky=ground.camera;
let state, dims={w:innerWidth,h:innerHeight}, inSky=false, transition=null, instructionTimer=0, feedbackTimer=0, moonLocatorActive=false;
function setInstructionLater(text,delay){clearTimeout(instructionTimer);instructionTimer=setTimeout(()=>say(text),reduced?0:delay);}
function normal(){return new THREE.Vector3(Math.cos(state.theta),Math.sin(state.theta),0);}
function updateWorld(){
 const f=facts(state.theta,state.phi);state.facts=f;
 earthGroup.rotation.z=state.theta-state.originTheta;
 moonGroup.position.set(...f.moon,0);focusMoon.position.copy(moonGroup.position);focusMoon.position.z=.08;
 observerGroup.position.set(...f.observer,.02);observerGroup.rotation.z=state.theta-Math.PI/2;
 focusObserver.position.copy(observerGroup.position).addScaledVector(normal(),.25);focusObserver.position.z=.1;
 const n=normal(),t=new THREE.Vector3(-n.y,n.x,0),p=observerGroup.position.clone();
 const points=[p.clone().addScaledVector(t,-2.1),p.clone().addScaledVector(t,2.1)];horizon.geometry.dispose();horizon.geometry=new THREE.BufferGeometry().setFromPoints(points);horizon.computeLineDistances();
 const arc=[];for(let i=0;i<=64;i++){const a=Math.PI*i/64;arc.push(p.clone().addScaledVector(t,Math.cos(a)*1.8).addScaledVector(n,Math.sin(a)*1.8));}skyArc.geometry.dispose();skyArc.geometry=new THREE.BufferGeometry().setFromPoints(arc);
 ground.update(f,state.theta);
 syncPresentation();
}
function syncPresentation(){
 const practice = state.stage==='turn'||state.stage==='explore';
 const light=state.stage==='light', path=state.stage==='path';
 const overviewMode=!inSky&&!transition;
 show('reset',state.stage==='finish');
 turnRing.visible=practice&&overviewMode;orbitRing.visible=overviewMode&&(practice||state.stage==='predict');
 observerGroup.visible=!inSky;atmosphere.visible=!inSky;
 horizon.visible=overviewMode&&((practice&&state.moved)||state.revealed||state.assisted);
 skyArc.visible=horizon.visible;
 focusSun.visible=overviewMode&&light&&state.lightStep===0;
 focusMoon.visible=overviewMode&&((light&&state.lightStep===1)||state.stage==='explore');
 focusObserver.visible=overviewMode&&light&&state.lightStep===2;
 rayGroup.visible=overviewMode;
 show('earth',practice&&overviewMode);show('sun',overviewMode&&(light||path));show('moon',overviewMode&&(light||path||state.stage==='explore'));show('observer',overviewMode&&path);
 show('eye',state.stage==='reveal'||practice&&((state.stage==='explore')||state.facts.sunAltitude>.28&&state.facts.moonAltitude>.32&&state.moved));
 show('lookTools',inSky);
 if(!inSky){moonLocatorActive=false;show('moonLocator',false);}
 icon($('eye'),inSky?'globe':'eye');$('eye').setAttribute('aria-label',inSky?'Back to space':'See the sky through the explorer’s eyes');
 canvas.tabIndex=inSky?0:-1;canvas.setAttribute('aria-label',inSky?'Look around the sky. Drag, or use arrow keys. The Sun and Moon buttons look towards each object.':'A model of Earth, the Sun, the Moon and a small explorer');
 $('eye').disabled=!!transition;
 scene.background.set('#0b1726');stars.visible=true;
 document.body.classList.toggle('sky',inSky);document.body.classList.toggle('day',inSky&&state.facts.day);
}
function progress(index){[...$('progress').children].forEach((el,i)=>{el.classList.toggle('done',i<index);el.classList.toggle('active',i===index);});}
function controlsOff(){moonLocatorActive=false;show('moonLocator',false);for(const id of ['choices','next','hint','extra','feedbackToast'])show(id,false);clearTimeout(instructionTimer);clearTimeout(feedbackTimer);clearRays();}
function resetLesson(){
 clearTimeout(instructionTimer);inSky=false;transition=null;
 state={stage:'turn',theta:3.72,originTheta:3.72,phi:1.55,moved:false,lightStep:0,responses:[],path:[],pathCorrect:null,assisted:false,revealed:false,tasks:[],taskIndex:0};
 controlsOff();icon($('eye'),'eye');$('eye').setAttribute('aria-label','See the sky through the explorer’s eyes');say('Turn Earth until our explorer can see the Sun and Moon.');progress(0);updateWorld();
}
function turn(delta){if(!['turn','explore'].includes(state.stage)||inSky||transition)return;state.theta+=delta;state.moved=true;updateWorld();if(state.stage==='turn'){if(state.facts.sunAltitude>.28&&state.facts.moonAltitude>.32)say('Both are above the ground! Tap the eye to look.');else if(state.facts.day&&state.facts.visible)say('Keep turning to bring both higher in the sky.');else if(!state.facts.day)say('Our explorer is on the night side. Keep turning Earth.');else say('It is daytime. Keep turning to bring the Moon into view.');}}
function startLight(){inSky=false;transition=null;state.stage='light';state.theta=2.35;state.phi=1.55;state.lightStep=0;state.revealed=false;controlsOff();progress(1);say('Tap the Sun to follow its light.');updateWorld();}
function beginCheck(){inSky=false;transition=null;controlsOff();state.stage='predict';state.tasks=makeTasks(Math.random,[{theta:2.35,phi:1.55}]);state.responses=[];state.taskIndex=0;state.pathCorrect=null;progress(2);loadTask();}
function loadTask(){inSky=false;transition=null;controlsOff();state.stage='predict';const t=state.tasks[state.taskIndex];state.theta=t.theta;state.phi=t.phi;state.revealed=false;state.assisted=false;show('choices',true);show('hint',true);for(const id of ['yes','no']){$(id).disabled=false;$(id).setAttribute('aria-pressed','false');}say('Can our explorer see the Moon? Choose Yes or No.');updateWorld();}
function showFeedbackToast(correct,text=correct?'That’s right!':'Not quite. Let’s look.'){
 clearTimeout(feedbackTimer);
 const toast=$('feedbackToast');toast.textContent=text;
 toast.setAttribute('data-result',correct?'correct':'incorrect');show('feedbackToast',true);
 feedbackTimer=setTimeout(()=>{show('feedbackToast',false);feedbackTimer=0;},3000);
}
function predict(answer){if(state.stage!=='predict'||state.revealed)return;const f=state.facts;const correct=answer===f.visible;state.responses.push({answer,correct,assisted:state.assisted,theta:state.theta,phi:state.phi});state.revealed=true;state.stage='reveal';show('choices',false);show('hint',false);showFeedbackToast(correct);toSky();say(f.visible?(correct?'Yes! The Moon is up in our daytime sky.':'Look: the Moon is up, even in daytime.'):(correct?'Right! Earth blocks the Moon below our horizon.':'Look: Earth blocks the Moon below our horizon.'));show('next',true);}
function startPath(){inSky=false;transition=null;controlsOff();state.stage='path';state.path=[];state.theta=2.65;state.phi=2.02;state.revealed=false;state.assisted=false;progress(3);say('Show the Moon’s light journey: tap three things in order.');show('hint',true);updateWorld();}
function tapObject(which){
 if(transition||inSky)return;
 if(state.stage==='light'){
  if(state.lightStep===0&&which==='sun'){state.lightStep=1;addRay(sun.position,moonGroup.position,'#ffe28e');say('Sunlight reaches the Moon. Tap the Moon.');}
  else if(state.lightStep===1&&which==='moon'){state.lightStep=2;addRay(moonGroup.position,observerGroup.position,'#b6ebff');say('The Moon reflects sunlight to our eyes.');show('next',true);}
  updateWorld();
 }else if(state.stage==='path'){
  state.path.push(which);const target=which==='sun'?focusSun:which==='moon'?focusMoon:focusObserver;target.visible=true;target.material.color.set('#c1efff');
  // Neutral selection rings show the commitment, not correctness, until all three taps.
  if(state.path.length===3){state.pathCorrect=scorePath(state.path)&&!state.assisted;state.stage='pathReveal';state.revealed=true;show('hint',false);clearRays();addRay(sun.position,moonGroup.position,'#ffe28e');addRay(moonGroup.position,observerGroup.position,'#b6ebff');say(scorePath(state.path)?'Sun → Moon → our eyes. That is reflected sunlight!':'Follow the sunlight: Sun, Moon, then our explorer.');showFeedbackToast(scorePath(state.path));show('next',true);syncPresentation();}
 }else if(state.stage==='explore'&&which==='moon'){state.phi+=.3;updateWorld();}
}
function finish(){inSky=false;transition=null;state.stage='finish';controlsOff();state.success=sessionEvidence(state.responses,state.pathCorrect);say(state.success?'You predicted the sky and traced the sunlight today!':'Needs more practice. Tap Start again to explore.');showFeedbackToast(state.success,state.success?'Great exploring!':'Let’s practise some more.');show('next',false);show('extra',true);progress(4);updateWorld();}
function startExplore(){inSky=false;transition=null;controlsOff();state.stage='explore';state.theta=2.35;state.phi=1.55;state.moved=true;show('next',true);icon($('next'),'next');$('next').setAttribute('aria-label','Continue to fresh challenges');say('Move the Moon, then turn Earth. What sky can you make?');updateWorld();}
function next(){if(transition)return;if(state.stage==='turn'){startLight();}else if(state.stage==='light'){beginCheck();}else if(state.stage==='reveal'){state.taskIndex++;state.taskIndex<4?loadTask():startPath();}else if(state.stage==='pathReveal'){finish();}else if(state.stage==='finish'){icon($('next'),'next');$('next').setAttribute('aria-label','Continue');reset();}else if(state.stage==='explore'){icon($('next'),'next');$('next').setAttribute('aria-label','Continue');beginCheck();}}
function hint(){if(state.stage==='predict'){state.assisted=true;say('Use our explorer’s ground line: is the Moon above it?');updateWorld();}else if(state.stage==='path'){state.assisted=true;say('Start where light is made: the Sun. Then the Moon, then our eyes.');}}
// A guided transition keeps the observer marker as the destination. Sky camera
// uses the same bodies, illumination and surface normal as the overview model.
function toSky(){if(transition||inSky)return;ground.enter();show('eye',false);show('earth',false);for(const id of ['sun','moon','observer'])show(id,false);if(reduced){inSky=true;syncPresentation();canvas.focus?.({preventScroll:true});return;}transition={start:performance.now(),duration:900};syncPresentation();}
function eye(){if(transition)return;if(inSky){inSky=false;icon($('eye'),'eye');$('eye').setAttribute('aria-label','See the sky through the explorer’s eyes');if(state.stage==='turn')say('Turn Earth again, or tap Continue to follow the sunlight.');syncPresentation();}else{toSky();icon($('eye'),'globe');$('eye').setAttribute('aria-label','Back to space');if(state.stage==='turn'){say('The Moon is in our daytime sky! Drag to look around.');show('next',true);}else say(state.facts.visible?'The Moon is above our horizon.':'The Moon is below our horizon.');}}
$('earth').addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();turn((e.key==='ArrowRight'?1:-1)*.1);}});
let drag=null;
$('earth').addEventListener('pointerdown',e=>{if(inSky||transition)return;const p=project(new THREE.Vector3());drag={id:e.pointerId,angle:Math.atan2(e.clientY-p.y,e.clientX-p.x),x:e.clientX,y:e.clientY,moved:false};$('earth').setPointerCapture(e.pointerId);});
$('earth').addEventListener('pointermove',e=>{if(!drag)return;const p=project(new THREE.Vector3());const angle=Math.atan2(e.clientY-p.y,e.clientX-p.x);let d=angle-drag.angle;while(d>Math.PI)d-=Math.PI*2;while(d< -Math.PI)d+=Math.PI*2;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5)drag.moved=true;turn(-d);drag.angle=angle;});
$('earth').addEventListener('pointerup',()=>{if(drag&&!drag.moved)turn(.26);drag=null;});$('earth').addEventListener('pointercancel',()=>{drag=null;});
for(const id of ['sun','observer'])$(id).addEventListener('click',()=>tapObject(id));
let moonDrag=null;
$('moon').addEventListener('pointerdown',e=>{if(state.stage!=='explore')return;moonDrag={x:e.clientX,y:e.clientY,phi:state.phi};$('moon').setPointerCapture(e.pointerId);});
$('moon').addEventListener('pointermove',e=>{if(!moonDrag)return;const p=project(new THREE.Vector3());const a=Math.atan2(-(e.clientY-p.y),e.clientX-p.x);const portrait=dims.w/dims.h<.8;state.phi=portrait?Math.atan2(-(e.clientX-p.x),-(e.clientY-p.y)):a;updateWorld();});
$('moon').addEventListener('pointerup',e=>{if(moonDrag){const moved=Math.hypot(e.clientX-moonDrag.x,e.clientY-moonDrag.y)>5;moonDrag=null;if(!moved)tapObject('moon');}else tapObject('moon');});$('moon').addEventListener('pointercancel',()=>moonDrag=null);
$('moon').addEventListener('keydown',e=>{if(state.stage==='explore'&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){e.preventDefault();state.phi+=(e.key==='ArrowRight'?1:-1)*.15;updateWorld();}else if(e.key==='Enter'||e.key===' '){e.preventDefault();tapObject('moon');}});
$('eye').addEventListener('click',eye);$('next').addEventListener('click',next);$('reset').addEventListener('click',()=>{if(state.stage!=='finish')return;icon($('next'),'next');$('next').setAttribute('aria-label','Continue');reset();});$('yes').addEventListener('click',()=>predict(true));$('no').addEventListener('click',()=>predict(false));$('hint').addEventListener('click',hint);$('extra').addEventListener('click',startExplore);

let lookDrag=null;
canvas.addEventListener('pointerdown',e=>{if(!inSky)return;lookDrag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(!lookDrag||!inSky)return;ground.look(-(e.clientX-lookDrag.x)*.004,(e.clientY-lookDrag.y)*.003);lookDrag={x:e.clientX,y:e.clientY};});
canvas.addEventListener('pointerup',()=>lookDrag=null);canvas.addEventListener('pointercancel',()=>lookDrag=null);
canvas.addEventListener('keydown',e=>{if(!inSky)return;const moves={ArrowLeft:[-.12,0],ArrowRight:[.12,0],ArrowUp:[0,.08],ArrowDown:[0,-.08]};if(moves[e.key]){e.preventDefault();ground.look(...moves[e.key]);}else if(e.key==='Escape'){e.preventDefault();eye();}});
function updateMoonLocator(){
 if(!inSky||!moonLocatorActive||state.facts.visible){show('moonLocator',false);return;}
 const point=ground.screenPosition('moon');show('moonLocator',point.inView);
 if(point.inView){$('moonLocator').style.left=point.x+'px';$('moonLocator').style.top=point.y+'px';}
}
$('lookSun').addEventListener('click',()=>{if(!inSky)return;moonLocatorActive=false;show('moonLocator',false);ground.lookAtBody('sun',!reduced);say(state.facts.day?'The Sun is above the horizon. It is daytime here.':'The Sun is below the horizon. It is night here.');});
$('lookMoon').addEventListener('click',()=>{if(!inSky)return;moonLocatorActive=!state.facts.visible;ground.lookAtBody('moon',!reduced,true);say(state.facts.visible?'The Moon is above the horizon, in our sky.':'The Moon is below the horizon, hidden behind Earth.');updateMoonLocator();});

function resize(){dims={w:innerWidth,h:innerHeight};observerGroup.scale.setScalar(dims.w<=600?1.35:1);renderer.setSize(dims.w,dims.h);spaceBackground.resize(Math.min(devicePixelRatio,2));const aspect=dims.w/dims.h,portrait=aspect<.8;
 const half=portrait?5.95/aspect:Math.max(6.15,8/aspect);overview.left=-half*aspect;overview.right=half*aspect;overview.top=half;overview.bottom=-half;overview.near=.1;overview.far=150;
 overview.position.set(portrait?-.75:0,portrait?0:.45,24);overview.up.set(portrait?1:0,portrait?0:1,0);overview.lookAt(portrait?-.75:0,portrait?0:.45,0);overview.updateProjectionMatrix();overview.updateMatrixWorld();ground.resize(dims.w,dims.h);
}

function project(p,cam=overview){const q=p.clone().project(cam);return{x:(q.x+1)*dims.w/2,y:(1-q.y)*dims.h/2};}
function positionButton(id,p,radius){const q=project(p),el=$(id);el.style.left=q.x+'px';el.style.top=q.y+'px';if(radius){const q2=project(p.clone().add(new THREE.Vector3(radius,0,0)));const q3=project(p.clone().add(new THREE.Vector3(0,radius,0)));const px=Math.max(Math.hypot(q2.x-q.x,q2.y-q.y),Math.hypot(q3.x-q.x,q3.y-q.y));el.style.width=el.style.height=Math.max(id==='earth'?48:80,px*2)+'px';}}
function layout(){updateMoonLocator();positionButton('earth',new THREE.Vector3(),R+.35);positionButton('sun',sun.position,1);positionButton('moon',moonGroup.position,.7);positionButton('observer',observerGroup.position.clone().addScaledVector(normal(),.26),.3);
 if(inSky||dims.w<=600){$('eye').style.left='5vw';$('eye').style.top='auto';$('eye').style.bottom='4vh';$('eye').style.transform='none';if(inSky)show('eye',['turn','explore','reveal'].includes(state.stage));}else if(!transition){$('eye').style.bottom='auto';$('eye').style.transform='translate(-50%,-50%)';const p=observerGroup.position.clone().addScaledVector(normal(),1.40);const q=project(p);$('eye').style.left=Math.max(100,Math.min(dims.w-100,q.x))+'px';$('eye').style.top=Math.max(dims.h*.29,Math.min(dims.h-110,q.y))+'px';}
}

const openingScene=new THREE.Scene();openingScene.background=new THREE.Color('#07101f');
openingScene.add(stars.clone(true),new THREE.AmbientLight(0x8cabcb,.09));
const openingLight=sunlight.clone();openingScene.add(openingLight);
const openingEarth=earthGroup.clone(true);openingEarth.rotation.z=.45;openingScene.add(openingEarth);
const openingMoon=moonGroup.clone(true);openingMoon.position.set(.107,5.149,0);openingScene.add(openingMoon);
const openingExplorer=observerGroup.clone(true);openingExplorer.position.set(-1.068,1.081,.02);openingExplorer.rotation.z=2.35-Math.PI/2;openingScene.add(openingExplorer);
const openingArt=new THREE.Group();openingArt.add(openingEarth,openingMoon,openingExplorer);openingScene.add(openingArt);
const openingCamera=new THREE.OrthographicCamera();
const opening=createOpening({question:'Why can we see the Moon in daytime?',dark:true,onStart:resetLesson,focusTarget:'#earth'});
function renderOpening(){
 const aspect=dims.w/dims.h,narrow=dims.w<=800,width=narrow?7.8:Math.max(14,8.6*aspect),height=width/aspect;
 openingArt.scale.setScalar(narrow?1.55:1);openingMoon.position.y=narrow?3.7:5.149;
 openingCamera.left=-width/2;openingCamera.right=width/2;openingCamera.top=height/2;openingCamera.bottom=-height/2;openingCamera.near=.1;openingCamera.far=150;
 openingCamera.position.set(narrow?-.3:-3.1,1.8,24);openingCamera.lookAt(narrow?-.3:-3.1,1.8,0);openingCamera.updateProjectionMatrix();
 renderer.render(openingScene,openingCamera);
}
function reset(){resetLesson();renderOpening();opening.show(true);}
let last=0;
function frame(t){requestAnimationFrame(frame);if(t-last<1000/45)return;last=t;if(opening.isOpen){renderOpening();return;}
 if(transition){const u=Math.min(1,(t-transition.start)/transition.duration); // A smooth dolly, then the local camera takes over.
  if(u===1){inSky=true;transition=null;syncPresentation();canvas.focus?.({preventScroll:true});}
 }
 for(const [i,p]of packets.entries()){const u=reduced?.5:(t*.00035+i*.4)%1;p.ball.position.lerpVectors(p.a,p.b,u);}
 focusSun.scale.setScalar(reduced?1:1+Math.sin(t*.003)*.035);focusMoon.scale.copy(focusSun.scale);
 let cam=inSky?sky:overview;
 if(transition){const u=(t-transition.start)/transition.duration;const ease=u*u*(3-2*u);const p=observerGroup.position;const q=overview.clone();q.position.lerp(new THREE.Vector3(p.x,p.y,5),ease);q.zoom=1+ease*.45;q.updateProjectionMatrix();q.lookAt(new THREE.Vector3(0,.45,0).lerp(p,ease));cam=q;}
 solar.tick(reduced?0:t*.001);
 if(inSky){ground.tick(reduced?0:t*.001);renderer.render(ground.scene,ground.camera);}else renderer.render(scene,cam);layout();
}
window.addEventListener('resize',resize);resize();reset();requestAnimationFrame(frame);
// Read-only diagnostics for development checks, no persistence or network.
window.moonVisit = { snapshot:()=>JSON.parse(JSON.stringify({coverOpen:opening.isOpen,stage:state.stage,theta:state.theta,phi:state.phi,facts:state.facts,inSky,responses:state.responses,path:state.path,pathCorrect:state.pathCorrect,success:state.success})), ground:()=>ground.snapshot(),rendererVersion:THREE.REVISION };
