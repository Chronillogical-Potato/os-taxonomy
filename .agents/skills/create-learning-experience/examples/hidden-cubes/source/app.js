import '../../vocabulary.js';
import {createOpening} from '../../opening.mjs';
import {shapeKey,practiceShapes,chooseTask,scorePlan,advances} from './tasks.js';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
const $=id=>document.getElementById(id), world=$('world'),controls=$('controls'),actions=$('scene-actions'), reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const paths={next:'M4 12h16m-6-6 6 6-6 6',fill:'M12 3v18M3 12h18',layer:'M3 8 12 3l9 5-9 5ZM3 13l9 5 9-5M3 18l9 5 9-5',turn:'M4 8a8 8 0 1 1 0 8M4 3v5h5',check:'m4 12 5 5L20 6',help:'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 4v.1',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',reset:'M4 8a8 8 0 1 1 0 8M4 3v5h5',cube:'m12 2 9 5v10l-9 5-9-5V7Zm0 10 9-5M12 12 3 7m9 5v10'};
const icon=k=>`<svg viewBox="0 0 24 24" aria-hidden="true"> <path d="${paths[k]||paths.next}"/></svg>`;
$('restart').innerHTML=icon('reset');
function btn(parent,id,label,ico,fn,primary=false){const b=document.createElement('button');b.id=id;b.className='ml-control'+(primary?' ml-control--primary':'');b.innerHTML=icon(ico)+`<span class="ml-button-label">${label}</span>`;b.onclick=fn;parent.append(b);return b;}
const say=t=>$('instruction').textContent=t;
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});}catch(e){say('This device cannot show the 3D box. Try another browser, or build and unpack a box with real cubes.');throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);world.append(renderer.domElement);renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-8,8,6,-6,.1,100);camera.position.set(9,13,12);camera.lookAt(0,1,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xb9a689,.95));const light=new THREE.DirectionalLight(0xffffff,1.6);light.position.set(-3,9,5);scene.add(light);
const gradient=new THREE.DataTexture(new Uint8Array([85,160,235]),3,1,THREE.RedFormat);gradient.needsUpdate=true;gradient.minFilter=gradient.magFilter=THREE.NearestFilter;
const materials=[0x79c6c2,0xffcc69,0xe79778,0x9db8d6].map(c=>new THREE.MeshToonMaterial({color:c,gradientMap:gradient}));
const outline=new THREE.LineBasicMaterial({color:0x242722});
const edgeParts=[];for(let axis=0;axis<3;axis++)for(const a of [-.485,.485])for(const b of [-.485,.485]){const geo=new THREE.CylinderGeometry(.009,.009,.985,5);if(axis===0)geo.rotateZ(Math.PI/2);if(axis===2)geo.rotateX(Math.PI/2);geo.translate(axis===0?0:a,axis===1?0:axis===0?a:b,axis===2?0:b);edgeParts.push(geo);}const thickEdges=mergeGeometries(edgeParts);edgeParts.forEach(g=>g.dispose());const edgeMat=new THREE.MeshBasicMaterial({color:0x242722});
const cubeGeo=new THREE.BoxGeometry(.97,.97,.97),edgeGeo=new THREE.EdgesGeometry(cubeGeo);const ghostMat=new THREE.MeshBasicMaterial({color:0xb9b5a5,transparent:true,opacity:.21,depthWrite:false});
const root=new THREE.Group();scene.add(root);const cubes=new THREE.Group();root.add(cubes);const container=new THREE.Group();root.add(container);
const rims=[];const floor=new THREE.Mesh(new THREE.CylinderGeometry(5.0,5.1,.24,96),new THREE.MeshToonMaterial({color:0xece1c8,gradientMap:gradient}));floor.position.y=-.25;root.add(floor);
for(const y of [-.13,-.37]){const rim=new THREE.Mesh(new THREE.TorusGeometry(5.04,.013,6,96),edgeMat);rim.rotation.x=Math.PI/2;rim.position.y=y;root.add(rim);rims.push(rim);}
// An understated ground shadow is a local procedural texture, embedded by construction.
const cv=document.createElement('canvas');cv.width=cv.height=128;const cx=cv.getContext('2d'),gr=cx.createRadialGradient(64,64,15,64,64,64);gr.addColorStop(0,'rgba(62,52,34,.22)');gr.addColorStop(1,'rgba(62,52,34,0)');cx.fillStyle=gr;cx.fillRect(0,0,128,128);const shadow=new THREE.Mesh(new THREE.PlaneGeometry(9,9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.39;root.add(shadow);
let state,parts=[],angle=0,targetAngle=0,spread=0,targetSpread=0,drag=null;
function clearGroup(g){while(g.children.length){const o=g.children[0];g.remove(o);if(o.userData.disposable)o.geometry.dispose();}}
function makeCube(x,y,z,ghost=false){const g=new THREE.Group(),m=new THREE.Mesh(cubeGeo,ghost?ghostMat:materials[y%materials.length]);g.add(m);const e=ghost?new THREE.LineSegments(edgeGeo,new THREE.LineBasicMaterial({color:0x777365,transparent:true,opacity:.65})):new THREE.Mesh(thickEdges,edgeMat);g.add(e);g.userData={x,y,z,ghost};m.userData.owner=g;return g;}
function rebuild(){clearGroup(cubes);clearGroup(container);parts=[];const [w,d,h]=state.dims;const radius=Math.max(w,d)*.65+.55;floor.scale.set(radius/5,1,radius/5);rims.forEach(r=>r.scale.set(radius/5,radius/5,1));
for(let y=0;y<h;y++)for(let z=0;z<d;z++)for(let x=0;x<w;x++){
 let ghost=state.mode==='fill'&&!state.filled.has(`${x},${z}`);if(state.mode==='fill'&&y>0)continue;
 const g=makeCube(x,y,z,ghost);g.position.set(x-(w-1)/2,y+.5,z-(d-1)/2);cubes.add(g);parts.push(g);
}
const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w+.16,h+.14,d+.16)),new THREE.LineBasicMaterial({color:0x5d5a4c,transparent:true,opacity:.45}));frame.position.y=h/2;frame.userData.disposable=true;container.add(frame);
world.setAttribute('aria-label',`A ${state.mode==='fill'?'partly filled':'completely filled'} rectangular box of equal unit cubes. It has ${w} cubes across, ${d} rows back and ${h} layers high.`);
resize();}
function progress(i){[...$('dots').children].forEach((e,j)=>e.classList.toggle('on',j<=i));}
function baseUi(i){const focused=controls.contains(document.activeElement)||actions.contains(document.activeElement);controls.replaceChildren();controls.classList.remove('has-equation');actions.replaceChildren();progress(i);if(focused)requestAnimationFrame(()=>{const el=controls.querySelector('input,button:not(:disabled)');if(el)el.focus({preventScroll:true});});}
function numberEntry(id,fn){const input=document.createElement('input');input.id='number';input.type='number';input.min='0';input.max='999';input.step='1';input.inputMode='numeric';input.autocomplete='off';input.setAttribute('aria-label',id);controls.append(input);const b=btn(controls,'commit','Commit','check',()=>{if(input.value!==''&&Number.isInteger(+input.value)&&+input.value>=0&&+input.value<=999)fn(+input.value);},true);b.disabled=true;input.oninput=()=>b.disabled=!(input.value!==''&&Number.isInteger(+input.value)&&+input.value>=0&&+input.value<=999);input.onkeydown=e=>{if(e.key==='Enter'&&!b.disabled)b.click();};}
function sceneButtons(peel=false){btn(actions,'turn','Turn','turn',()=>targetAngle+=Math.PI/2);if(peel)btn(actions,'peel',targetSpread?'Close layers':'Open layers','layer',()=>{targetSpread=targetSpread?0:1;sceneButtonsRefresh();});}
function sceneButtonsRefresh(){actions.replaceChildren();sceneButtons(true);}
function startLesson(){state={mode:'fill',dims:[3,2,1],filled:new Set(),layers:1,responses:[],stage:0,completed:[],usedShapes:[...practiceShapes]};angle=targetAngle=0;spread=targetSpread=0;baseUi(0);say('Fill this layer. Each unit cube fills one cubic unit.');btn(controls,'add','Place cube','fill',fillNext,true);rebuild();}
function fillNext(){for(let z=0;z<2;z++)for(let x=0;x<3;x++)if(!state.filled.has(`${x},${z}`)){fillAt(x,z);return;}}
function fillAt(x,z){if(state.mode!=='fill')return;state.filled.add(`${x},${z}`);rebuild();if(state.filled.size===6){baseUi(0);say('One full layer holds 6 cubes. Stack another matching layer.');btn(controls,'stack','Stack layer','layer',stack,true);}}
function stack(){state.mode='stack';state.layers++;state.dims=[3,2,state.layers];rebuild();baseUi(1);if(state.layers<3){say('Two full layers hold 12 cubes. Add one more layer.');btn(controls,'stack','Stack layer','layer',stack,true);}else{say('All 18 cubes touch the outside. Add a back row to each layer.');btn(controls,'discover','Add back rows','fill',()=>discover(true),true);sceneButtons(true);}}
function discover(deepen=false){deepen=deepen===true;state.mode='predict';state.growBackRow=deepen?0:1;state.dims=[3,3,3];spread=targetSpread=0;angle=targetAngle=0;rebuild();baseUi(2);say(deepen?'Each layer now has an extra row. Predict this new box’s volume.':'This box is completely full. Predict its volume in cubic units.');numberEntry('Predicted volume in cubic units',v=>{state.practicePrediction=v;state.mode='unpack';baseUi(2);say('Turn the block. Can you see every cube? Open its layers to look inside.');sceneButtons(true);btn(controls,'inside','Find the centre','eye',showCentre,true);});sceneButtons();}
function showCentre(){targetSpread=1;state.mode='centre';baseUi(2);say('The centre cube was hidden from every side. Tap it to include it.');sceneButtons(true);btn(controls,'centre','Count centre cube','cube',centreCount,true);}
function centreCount(){state.mode='explain';baseUi(2);say(`Three full layers of 9 make 27 cubic units. The centre cube counts too.`);btn(controls,'checks','Try a fresh box','next',()=>beginCheck(),true);sceneButtons(true);}
// Every answer remains visible until a single deliberate submission.
function beginCheck(){
 while(state.stage<2&&state.completed.includes(state.stage))state.stage++;
 if(state.completed.includes(2)){finish();return;}
 const dims=chooseTask(state.stage,state.usedShapes,state.responses.length===0);
 if(!dims){finish(true);return;}
 state.usedShapes.push(shapeKey(dims));state.mode='check';state.dims=dims;state.assisted=false;state.plan={};
 spread=targetSpread=0;angle=targetAngle=.15+Math.random()*.35;rebuild();checkForm();
}
function checkForm(){
 state.mode='check';baseUi(3);controls.classList.add('has-equation');
 say('Count the whole box. Fill in your layer plan, then check it.');
 renderEquation();
 const form=$('plan-form');const commit=btn(controls,'commit','Check my plan','check',()=>form.requestSubmit(),true);commit.disabled=!validPlan();
 sceneButtons();btn(controls,'help','Show layers','help',()=>{
  state.assisted=true;targetSpread=1;state.mode='support';baseUi(3);say('Look through each whole layer. Include cubes behind and inside.');sceneButtons(true);
  btn(controls,'resume','Return to my plan','layer',()=>{targetSpread=0;checkForm();},true);
 });
}
function renderEquation(readOnly=false){
 controls.classList.add('has-equation');
 const form=document.createElement('form');form.id='plan-form';form.autocomplete='off';
 const equation=document.createElement('div');equation.className='equation';
 const fields=[['perLayer','Cubes in one layer'],['layers','Number of layers'],['total','Total cubic units']];
 fields.forEach(([key,label],i)=>{
  if(i){const op=document.createElement('span');op.className='operator';op.textContent=i===1?'×':'=';op.setAttribute('aria-hidden','true');equation.append(op);}
  const cell=document.createElement('label');cell.className='equation-field';cell.htmlFor=key;
  const text=document.createElement('span');text.textContent=label;
  const input=document.createElement('input');input.id=key;input.name=key;input.type='number';input.min='0';input.max='999';input.step='1';input.inputMode='numeric';input.required=true;input.readOnly=readOnly;input.value=state.plan[key]??'';
  input.addEventListener('input',()=>{state.plan[key]=input.value===''?undefined:Number(input.value);if($('commit'))$('commit').disabled=!validPlan();});
  input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(validPlan()&&!readOnly)form.requestSubmit();}});
  cell.append(text,input);equation.append(cell);
 });
 form.append(equation);controls.append(form);
 form.addEventListener('submit',e=>{e.preventDefault();if(state.mode==='check'&&validPlan())revealCheck();});
}
function validPlan(){return ['perLayer','layers','total'].every(k=>Number.isInteger(state.plan[k])&&state.plan[k]>=0&&state.plan[k]<=999);}
function revealCheck(){
 if(state.mode!=='check')return;
 const [w,d,h]=state.dims,total=w*d*h,perLayer=w*d;
 const response={dims:[...state.dims],...state.plan,stage:state.stage,correct:scorePlan(state.dims,state.plan),assisted:state.assisted};
 state.responses.push(response);if(advances(response)&&!state.completed.includes(state.stage))state.completed.push(state.stage);
 state.mode='reveal';targetSpread=1;baseUi(3);renderEquation(true);
 if(response.correct&&!state.assisted)say(`Your plan includes every cube: ${perLayer} cubes in each of ${h} layers make ${total} cubic units.`);
 else if(response.correct)say(`The layers helped: ${perLayer} cubes in each of ${h} layers make ${total} cubic units. Try another box unaided.`);
 else if(state.plan.perLayer===perLayer&&state.plan.layers===h)say(`Your layer counts fit. ${perLayer} cubes in each of ${h} layers fill ${total} cubic units.`);
 else if(state.plan.total===total)say(`The total fits. Adjust your plan: ${perLayer} cubes in each of ${h} layers make ${total} cubic units.`);
 else if(w>2&&d>2&&h>2&&state.plan.total===total-(w-2)*(d-2)*(h-2))say(`The buried cubes count too: ${h} full layers of ${perLayer} make ${total} cubic units.`);
 else say(`Count whole layers, including hidden cubes: ${perLayer} cubes in each of ${h} layers make ${total} cubic units.`);
 sceneButtons(true);const passed=state.completed.includes(2);
 const next=btn(controls,'continue',passed?'Finish check':advances(response)?'Try a new shape':'Try a fresh box','next',()=>{
  if(state.mode!=='reveal')return;
  if(passed){finish();return;}
  beginCheck();
 },true);next.disabled=true;
 if(!passed&&state.responses.length>=2)btn(controls,'pause-check','Finish for now','check',()=>finish());
}
function finish(exhausted=false){state.mode='finish';baseUi(4);targetSpread=0;const passed=state.completed.includes(1)&&state.completed.includes(2);state.sessionEvidence=passed?'independent buried-cube and changed-shape plans':'needs more practice';
 say(passed?'Today, your plans counted hidden cubes in different box shapes.':exhausted?'Needs more practice. Unpack the layers, or restart for another session.':'Needs more practice. Unpack the layers, then try counting a fresh box.');
 if(!passed)btn(controls,'practice','Unpack again','layer',discover,true);
 btn(controls,'further','Rearrange cubes','cube',extension,passed);
 if(!exhausted&&!passed)btn(controls,'new-check','Fresh check','next',()=>beginCheck());sceneButtons(true);
}
function extension(){state.mode='extension';state.dims=[3,3,4];spread=targetSpread=0;rebuild();baseUi(4);say('The same cubes will make a longer box. Will its volume change?');btn(controls,'same','Same volume','cube',()=>rearrange(false),true);btn(controls,'changes','Different volume','turn',()=>rearrange(true));sceneButtons();}
function rearrange(changed){state.mode='extensionReveal';state.dims=[4,3,3];rebuild();baseUi(4);say(changed?'Look again: no cubes were added or removed. Both boxes hold 36 cubic units.':'Exactly: rearranging the same 36 cubes keeps the volume at 36 cubic units.');btn(controls,'again-extension','Rearrange again','turn',extension);btn(controls,'restart-lesson','Start again','reset',start,true);sceneButtons(true);}
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
function hit(e){const r=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mouse,camera);return ray.intersectObjects(cubes.children,true).find(h=>h.object.userData.owner)?.object.userData.owner;}
world.addEventListener('pointerdown',e=>{const g=hit(e);drag={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,g};world.setPointerCapture(e.pointerId);});
world.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(state.mode==='fill')return;if(Math.abs(e.clientY-drag.startY)>18&&['unpack','centre','explain','support','reveal','finish','extensionReveal'].includes(state.mode)){targetSpread=THREE.MathUtils.clamp(targetSpread-dy/110,0,1);}else targetAngle+=dx*.008;drag.x=e.clientX;drag.y=e.clientY;});
world.addEventListener('pointerup',e=>{if(!drag)return;const g=drag.g,short=Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<12;if(short&&g){if(state.mode==='fill')fillAt(g.userData.x,g.userData.z);if(state.mode==='centre'&&g.userData.x===1&&g.userData.y===1&&g.userData.z===1)centreCount();}drag=null;});world.addEventListener('pointercancel',()=>drag=null);

const opening=createOpening({question:'How can we count cubes we can’t see?',onStart:startLesson,focusTarget:'#add'});
function start(){state={mode:'cover',dims:[3,3,3],filled:new Set(),layers:3,responses:[],stage:0,completed:[],usedShapes:[...practiceShapes]};angle=targetAngle=-.25;spread=targetSpread=.22;controls.replaceChildren();actions.replaceChildren();opening.show(true);rebuild();}
function frameScene(){
 const w=innerWidth,h=innerHeight,narrow=w<=800;
 if(narrow){actions.style.bottom=(controls.getBoundingClientRect().height+54)+'px';}else actions.style.bottom='';
 const c=controls.getBoundingClientRect(),a=actions.getBoundingClientRect(),text=$('instruction').getBoundingClientRect();
 const top=opening.isOpen?(narrow?h*.32:60):(narrow?text.bottom+24:78),bottom=opening.isOpen?h*.82:Math.max(top+100,(actions.children.length?a.top:c.top)-22);
 const left=opening.isOpen?(narrow?16:w*.47):(narrow?16:Math.max(w*.38,controls.classList.contains('has-equation')?c.right+26:0)),right=w-(narrow?16:36);
 camera.clearViewOffset();camera.top=6.25;camera.bottom=-6.25;camera.right=6.25*w/h;camera.left=-camera.right;camera.updateProjectionMatrix();camera.updateMatrixWorld();
 root.scale.setScalar(1);root.updateMatrixWorld(true);
 const [bw,bd,bh]=state.dims,r=Math.max(bw,bd)*.65+.55,points=[];
 for(const x of [-bw/2,bw/2])for(const z of [-bd/2,bd/2])for(const y of [0,bh+spread*(bh-1)*2])points.push(new THREE.Vector3(x,y,z));
 for(let i=0;i<8;i++)points.push(new THREE.Vector3(r*Math.cos(i*Math.PI/4),-.4,r*Math.sin(i*Math.PI/4)));
 const bounds=()=>{const ps=points.map(v=>root.localToWorld(v.clone()).project(camera));return {x0:Math.min(...ps.map(v=>(v.x+1)*w/2)),x1:Math.max(...ps.map(v=>(v.x+1)*w/2)),y0:Math.min(...ps.map(v=>(1-v.y)*h/2)),y1:Math.max(...ps.map(v=>(1-v.y)*h/2))};};
 let b=bounds();const scale=Math.min(1.25,(right-left)/(b.x1-b.x0),(bottom-top)/(b.y1-b.y0));root.scale.setScalar(scale);root.updateMatrixWorld(true);b=bounds();
 camera.setViewOffset(w,h,(b.x0+b.x1)/2-(left+right)/2,(b.y0+b.y1)/2-(top+bottom)/2,w,h);camera.updateProjectionMatrix();
}
function resize(){renderer.setSize(innerWidth,innerHeight);if(state){frameScene();renderer.render(scene,camera);}}
addEventListener('resize',resize);$('restart').onclick=start;
function animate(){requestAnimationFrame(animate);const t=reduce?1:.13;if(state.growBackRow<1)state.growBackRow=Math.min(1,state.growBackRow+(reduce?1:.075));angle+=(targetAngle-angle)*t;spread+=(targetSpread-spread)*t;root.rotation.y=angle;root.position.y=-spread*(state.dims[2]-1)*1.0;for(const g of parts){const {y,x,z}=g.userData;g.position.y=y+.5+y*spread*2.0;const centre=(state.mode==='centre'&&x===1&&y===1&&z===1)||(['reveal','support'].includes(state.mode)&&x>0&&x<state.dims[0]-1&&z>0&&z<state.dims[1]-1&&y>0&&y<state.dims[2]-1);g.children[0].material=centre?materials[2]:(g.userData.ghost?ghostMat:materials[y%materials.length]);if(centre){const pulse=reduce?1:1+Math.sin(performance.now()/280)*.035;g.scale.setScalar(pulse);}else g.scale.setScalar(state.growBackRow<1&&z===2?Math.max(.01,state.growBackRow):1);}if(state.mode==='reveal'&&spread>.98&&$('continue'))$('continue').disabled=false;frameScene();renderer.render(scene,camera);}
window.volumeLab={debug:()=>({root:root.position.toArray(),scale:root.scale.toArray(),cam:camera.position.toArray(),projection:camera.projectionMatrix.elements,info:renderer.info.render,cubes:parts.length}),snapshot:()=>({...state,coverOpen:opening.isOpen,filled:[...state.filled],spread,targetSpread,angle}),project:(x,y,z)=>{const v=new THREE.Vector3(x,y,z);root.localToWorld(v);v.project(camera);return {x:(v.x+1)*innerWidth/2,y:(1-v.y)*innerHeight/2};}};
start();animate();addEventListener('load',resize);document.fonts.ready.then(resize);
