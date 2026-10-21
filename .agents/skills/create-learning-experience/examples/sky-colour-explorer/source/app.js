import '../../vocabulary.js';
import {createOpening} from '../../opening.mjs';
import * as THREE from 'three';
import {airPath,tasks,evidence,clamp} from './model.mjs';
import {GEOMETRY} from './geometry.mjs';
import {teachingWave,waveTiming,wavePosition,waveColourAmount} from './teaching-waves.mjs';
import {photonEffects} from './photon-effects.mjs';
import {DRAW,surfaceY,sunMarker} from './geometry.mjs';
import {createExplorer} from './avatar.mjs';
import {createSunVisual,createSpaceBackground,createSkyStarfield} from './space-visuals.mjs';
const $=id=>document.getElementById(id), canvas=$('world'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const icons={
 arrow:'<path d="m9 5 7 7-7 7"/>', sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 zoom:'<circle cx="10" cy="10" r="7"/><path d="m15 15 7 7M10 6v8M6 10h8"/>',
 globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
 restart:'<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>',
 hint:'<path d="M8 16c0-3-3-3-3-7a7 7 0 0 1 14 0c0 4-3 4-3 7M8 17h8M9 21h6"/>',
 move:'<path d="M12 2v20M6 8l6-6 6 6M6 16l6 6 6-6"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 air:'<path d="M2 7h14q6-4 3-5M2 12h19M2 17h13q6 4 3 5"/>',
 rocket:'<path d="M8 16C6 9 12 3 21 3c0 9-6 15-13 13ZM8 8 3 9l-1 6 5-2M16 16l-1 5-6 1 2-5M6 18l-3 3"/><circle cx="16" cy="8" r="2"/>'
};
function svg(name){return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.globe}</svg>`;}
function button(parent,id,label,icon,fn,primary=false){
 const b=document.createElement('button');b.id=id;b.innerHTML=svg(icon)+`<span>${label}</span>`;if(primary)b.className='primary';b.onclick=fn;parent.append(b);return b;
}
function say(t){$('instruction').textContent=t;}
function title(t){$('title').textContent=t;}
function actions(items){$('actions').replaceChildren();for(const x of items)button($('actions'),...x);}
function choices(items){$('choices').replaceChildren();$('choices').hidden=false;for(const x of items){const b=button($('choices'),x[0],x[1],x[2],x[3]);if(x[4])b.innerHTML=`<span class="swatch ${x[4]}" aria-hidden="true">${x[4]==='blue'?'✦':'●'}</span><span>${x[1]}</span>`;}}
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(e){say('This device cannot show the 3D world. Please try a browser with WebGL.');$('sunHandle').hidden=true;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color('#07101f');
const space=createSpaceBackground();scene.add(space.root);
const camera=new THREE.OrthographicCamera();camera.position.set(0,3.7,28);camera.lookAt(0,3.7,0);
const world=new THREE.Group();scene.add(world);
const ambient=new THREE.AmbientLight('#ffffff',2.1), light=new THREE.DirectionalLight('#fff7e3',3);
scene.add(ambient,light);light.position.set(5,10,8);
const gradient=new THREE.DataTexture(new Uint8Array([80,155,255]),3,1,THREE.RedFormat);gradient.needsUpdate=true;gradient.minFilter=gradient.magFilter=THREE.NearestFilter;
const materials=new Map();
function toon(color){if(!materials.has(color))materials.set(color,new THREE.MeshToonMaterial({color,gradientMap:gradient}));return materials.get(color);}
const outlineMat=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{viewport:{value:new THREE.Vector2(1440,900)}},vertexShader:'uniform vec2 viewport;void main(){vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.);vec3 n=normalize(normalMatrix*normal);vec2 edge=(projectionMatrix*vec4(n,0.)).xy; p.xy+=normalize(edge+vec2(.00001))*2.0/viewport*p.w;gl_Position=p;}',fragmentShader:'void main(){gl_FragColor=vec4(.055,.067,.069,1.);}'});
function mesh(geo,color,parent=world,outlined=true){
 const m=new THREE.Mesh(geo,typeof color==='string'?toon(color):color);parent.add(m);
 if(outlined){const o=new THREE.Mesh(geo,outlineMat);m.add(o);}return m;
}
const sphereGeo=new THREE.SphereGeometry(1,24,16);
function ball(x,y,z,r,color,parent=world){const b=mesh(sphereGeo,color,parent);b.position.set(x,y,z);b.scale.setScalar(r);return b;}
function rod(a,b,r,color,parent=world,outline=false){
 const d=b.clone().sub(a),m=mesh(new THREE.CylinderGeometry(r,r,d.length(),8),color,parent,outline);
 m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;
}
function path(points,color,r=.025,parent=world){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>Array.isArray(p)?new THREE.Vector3(...p):p));
 return mesh(new THREE.TubeGeometry(curve,Math.max(12,points.length*8),r,6,false),new THREE.MeshBasicMaterial({color}),parent,false);
}
function arrow(a,b,color,r=.028,parent=world){
 rod(a,b,r,new THREE.MeshBasicMaterial({color}),parent);
 const dir=b.clone().sub(a).normalize(), cone=mesh(new THREE.ConeGeometry(r*3.3,r*8,8),new THREE.MeshBasicMaterial({color}),parent,false);
 cone.position.copy(b).sub(dir.clone().multiplyScalar(r*3));cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);
}
const land=new THREE.Group();world.add(land);
// Complete circular cross-section: the viewport crops a continuous planet,
// rather than exposing artificial ends or a flat bottom inside the scene.
const landShape=new THREE.Shape();landShape.absarc(0,-6371,6371,0,Math.PI*2,false);
const earth=mesh(new THREE.ExtrudeGeometry(landShape,{depth:3,bevelEnabled:false,curveSegments:1024}), '#a98566',land);earth.position.set(0,DRAW.base,-2.2);earth.scale.set(DRAW.x,DRAW.y,1);
const turfShape=new THREE.Shape();turfShape.absarc(0,-6371,6371,0,Math.PI*2,false);
const turfHole=new THREE.Path();turfHole.absarc(0,-6371,6368.5,0,Math.PI*2,true);turfShape.holes.push(turfHole);
const turf=mesh(new THREE.ExtrudeGeometry(turfShape,{depth:3.08,bevelEnabled:false,curveSegments:1024}),'#8cac63',land);turf.position.set(0,DRAW.base,-2.24);turf.scale.set(DRAW.x,DRAW.y,1);
const air=new THREE.Group();world.add(air);
const airShape=new THREE.Shape();airShape.absarc(0,-6371,6451,0,Math.PI*2,false);
const airHole=new THREE.Path();airHole.absarc(0,-6371,6371,0,Math.PI*2,true);airShape.holes.push(airHole);
const airMaterial=new THREE.ShaderMaterial({
 transparent:true,side:THREE.DoubleSide,depthWrite:false,
 uniforms:{tint:{value:new THREE.Color('#74bcf0')},strength:{value:.55}},
 vertexShader:'varying vec2 p;void main(){p=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`varying vec2 p;uniform vec3 tint;uniform float strength;
 void main(){float r=length(p-vec2(0.,-6371.));float h=clamp((r-6371.)/80.,0.,1.);
 // Keep most of the layer visibly dense; concentrate the fade at its outer edge.
 float body=mix(.88,.72,h)*(1.-smoothstep(.78,1.,h));
 float rim=exp(-pow((h-.985)*65.,2.))*.20;
 gl_FragColor=vec4(tint,(body+rim)*strength);
 #include <colorspace_fragment>
 }`
});
const airMesh=mesh(new THREE.ShapeGeometry(airShape,1024),airMaterial,air,false);airMesh.position.set(0,DRAW.base,-1.5);airMesh.scale.set(DRAW.x,DRAW.y,1);
const airArc=[];for(let a=65;a<=115;a+=.1)airArc.push([6451*Math.cos(a*Math.PI/180)*DRAW.x,(6451*Math.sin(a*Math.PI/180)-6371)*DRAW.y+DRAW.base,-1.45]);
path(airArc,'#73b4dd',.012,air);
function tree(x,z,size,type=0){
 const g=new THREE.Group();g.position.set(x,surfaceY(x)+.05,z);g.rotation.z=-Math.atan(x/DRAW.x/Math.sqrt(6371**2-(x/DRAW.x)**2)*DRAW.y/DRAW.x);g.scale.setScalar(size);land.add(g);
 mesh(new THREE.CylinderGeometry(.08,.12,.8,7),'#654e38',g).position.y=.35;
 if(type){for(let i=0;i<3;i++){const m=mesh(new THREE.ConeGeometry(.55-i*.1,.85,7),'#47765d',g);m.position.y=.75+i*.35;}}
 else{ball(0,1.05,0,.6,'#7a9e5b',g);ball(-.32,.85,.05,.35,'#8eb16b',g);}
 return g;
}
for(const [x,z,s,t]of[[-7,-.7,1.1,1],[-5.8,-1.2,.7,1],[-3.7,-.8,.8,0],[4.4,-1.1,1,0],[6.1,-.4,.8,1],[7.8,-1.1,1,1]])tree(x,z,s,t);
for(let i=0;i<16;i++){const x=-9+i*1.13;const rock=mesh(new THREE.DodecahedronGeometry(.1+(i%3)*.04,0),'#c8b79c',land);rock.position.set(x,surfaceY(x)+.12,.3);rock.scale.y=.65;}
const scout=createExplorer(outlineMat,light.position),explorer=scout.root;
world.add(explorer);explorer.position.set(0,.03,1.35);explorer.scale.setScalar(.85);
// Enlarged portrait marks the physical surface observer, rather than placing
// the eye at the height of a landscape-sized illustrated body.
for(const child of explorer.children)child.visible=child===scout.head;
const portrait=mesh(new THREE.CircleGeometry(.57,48),new THREE.MeshBasicMaterial({color:'#172b3c'}),world,false);portrait.position.set(0,DRAW.base,1.3);
function placeObserver(){
 const observerSize=layout.w/layout.h<.8?1.35:.85;
 explorer.scale.setScalar(observerSize);explorer.position.set(0,0,1.5);world.updateMatrixWorld(true);
 const eye=world.worldToLocal(scout.eyeAnchor.getWorldPosition(new THREE.Vector3()));
 explorer.position.x-=eye.x;explorer.position.y+=DRAW.base+GEOMETRY.eyeHeight*DRAW.y-eye.y;
 portrait.scale.setScalar(observerSize/.85);
}

for(let j=0;j<3;j++){
 const pts=[],radius=6363-j*8;for(let a=60;a<=120;a+=.5)pts.push([radius*Math.cos(a*Math.PI/180)*DRAW.x,DRAW.base+(-6371+radius*Math.sin(a*Math.PI/180))*DRAW.y,.83]);
 path(pts,['#98765a','#c5a181','#a97e5a'][j],.025,land);
}
for(let i=0;i<28;i++){
 const x=-9+(i*1.83%18),y=surfaceY(x)-.4-(i*.713%1.8);
 const seed=mesh(new THREE.SphereGeometry(.025,8,5),new THREE.MeshBasicMaterial({color:'#d7b994'}),land,false);seed.position.set(x,y,.85);seed.scale.x=1.9;
}
const solar=createSunVisual(.72),sun=solar.root;world.add(sun);
const sunTrack=[];for(let a=1;a<=179;a+=1){const p=sunMarker(a);sunTrack.push([p.x,p.y,0]);}
const track=path(sunTrack,'#394657',.012);track.visible=true;
const highSun=sun.clone(),lowSun=sun.clone();world.add(highSun,lowSun);highSun.visible=lowSun.visible=false;
const rays=new THREE.Group();world.add(rays);let rayTargets=[];
let lastFrame=0,wavePending=false;
let singleColour=0,singleEvening=false,singleStart=0,singleMotion=null,waveElapsed=0,wavePaused=reduced,angleSettledAt=0;
let skyColourAmount=0;
const neutralAir=new THREE.Color('#85898c'),dayAir=new THREE.Color('#74bcf0'),eveningAir=new THREE.Color('#f3ad64');
const closeAir=new THREE.Group();world.add(closeAir);closeAir.visible=false;
function clearGroup(g){for(const c of [...g.children]){g.remove(c);c.traverse(o=>{if(o.geometry&&!o.userData.shared)o.geometry.dispose();if(o.material?.isMeshBasicMaterial||o.userData.ownedMaterial)o.material.dispose();});}}
const colours={blue:'#2383e6',orange:'#ef8d36',white:'#fff4d3'};
let state={stage:'light',angle:90,low:false,high:false,sky:false,round:0,task:0,responses:[],assisted:false,choice:null,reveal:false,planet:'earth',planetStep:0};
let layout={w:0,h:0}, time=0, glow=0,frames=0;
function sunPosition(angle){const p=sunMarker(angle);return new THREE.Vector3(p.x,p.y,0);}
function buildRays(){
 const moving=state.stage==='journey';
 $('waveControls').hidden=!moving||state.sky;
 // Keep the hidden wave running when looking through the explorer's eyes.
 if(moving&&state.sky&&singleMotion)return;
 clearGroup(rays);clearGroup(closeAir);rayTargets=[];singleMotion=null;
 if(state.sky)return;
 if(state.stage==='light'){buildLightIntro();return;}
 if(state.stage==='air'||state.stage==='single'||(state.stage==='check'&&state.reveal)){buildTeachingWave();return;}
 if(moving)queueWave();
}
function buildLightIntro(){
 rays.visible=true;const eye=photonEye();
 for(const x of [-.07,0,.07])arrow(new THREE.Vector3(x,9.35,eye.z),new THREE.Vector3(x,1.15,eye.z),'#fff8e5',.023,rays);
 const lens=new THREE.Group();lens.position.set(2.8/world.scale.x,6.65,eye.z+.2);lens.scale.x=1/world.scale.x;rays.add(lens);
 const rim=mesh(new THREE.RingGeometry(.96,1.04,48),new THREE.MeshBasicMaterial({color:'#fff5df'}),lens,false);
 mesh(new THREE.CircleGeometry(.96,48),new THREE.MeshBasicMaterial({color:'#122738'}),lens,false).position.z=-.02;
 const spectrum=['#ef656c','#f59b51','#ffe16c','#8ac975','#58bbf4','#9f8be8'];
 spectrum.forEach((colour,i)=>{const y=(i-2.5)*.265,half=Math.sqrt(.9*.9-y*y);rod(new THREE.Vector3(-half,y,.02),new THREE.Vector3(half,y,.02),.105,new THREE.MeshBasicMaterial({color:colour}),lens);});
 rod(new THREE.Vector3(.72,-.72,0),new THREE.Vector3(1.4,-1.4,0),.065,new THREE.MeshBasicMaterial({color:'#fff5df'}),lens);
 rod(new THREE.Vector3(.15,6.65,eye.z),new THREE.Vector3(1.75/world.scale.x,6.65,eye.z),.012,new THREE.MeshBasicMaterial({color:'#fff5df'}),rays);
}
// An observer's view, driven by the same Sun angle. This is a qualitative sky,
// not a radiative-transfer solver; hues are illustrative, not colour predictions.
const skyScene=new THREE.Scene(),skyCamera=new THREE.PerspectiveCamera(65,1,.1,300);
skyCamera.position.set(0,1.5,0);skyCamera.lookAt(0,5,-40);
const skyUniforms={low:{value:0},planet:{value:0},sunDirection:{value:new THREE.Vector3()},colourAmount:{value:1}};
const skyMaterial=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:skyUniforms,
 vertexShader:'varying vec3 d;void main(){d=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`varying vec3 d;uniform float low;uniform float planet;uniform vec3 sunDirection;uniform float colourAmount;
 void main(){vec3 v=normalize(d);float h=max(v.y,0.);float nearSun=pow(max(dot(v,normalize(sunDirection)),0.),10.);
 vec3 day=mix(vec3(.76,.88,.87),vec3(.17,.50,.75),pow(h,.45));
 vec3 eve=mix(vec3(.98,.65,.37),vec3(.32,.49,.69),pow(h,.45));
 vec3 c=mix(day,eve,low);c=mix(c,vec3(1.,.57,.26),nearSun*low*.7);
 if(planet>0.5&&planet<1.5){c=mix(vec3(.75,.53,.39),vec3(.56,.39,.29),pow(h,.5));c=mix(c,vec3(.32,.58,.80),nearSun*low*.9);}
 if(planet>1.5&&planet<2.5)c=mix(vec3(.68,.43,.19),vec3(.47,.28,.12),pow(h,.5));
 float grey=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(grey),c,colourAmount);
 if(planet>2.5)c=vec3(.025,.037,.065);
 gl_FragColor=vec4(c,1.);}`});
mesh(new THREE.SphereGeometry(180,48,24),skyMaterial,skyScene,false);
const airlessSky=createSkyStarfield();skyScene.add(airlessSky.stars);
skyScene.add(new THREE.AmbientLight('#ffffff',2.4));const skyLight=new THREE.DirectionalLight('#fff0d0',3);skyScene.add(skyLight);
const groundMaterial=toon('#829b64');
const ground=mesh(new THREE.CircleGeometry(140,64),groundMaterial,skyScene,false);ground.rotation.x=-Math.PI/2;ground.position.y=-.3;
const mountains=new THREE.Group();skyScene.add(mountains);
for(let i=0;i<15;i++){
 const x=-84+i*12,z=-76-(i%3)*9,height=5+(i*7%15);
 const geo=new THREE.ConeGeometry(13+i%4,height,6),pos=geo.attributes.position;
 for(let k=0;k<pos.count;k++)if(pos.getY(k)>0)pos.setX(k,pos.getX(k)+(i%3-1)*2);
 geo.computeVertexNormals();
 const mountain=mesh(geo,i%2?'#78968b':'#94ac98',mountains);
 mountain.position.set(x,height/2-1,z);mountain.rotation.y=i*.7;
}
const skySun=ball(0,0,-90,1.25,new THREE.MeshBasicMaterial({color:'#fff1bb'}),skyScene);
const skyRocks=new THREE.Group();skyScene.add(skyRocks);
for(let i=0;i<12;i++){const x=(i%2?1:-1)*(6+i*1.7);const rock=mesh(new THREE.DodecahedronGeometry(.35+i%3*.2,0),'#a3ad89',skyRocks);rock.position.set(x,0,-12-i*3.2);rock.scale.y=.5;}
const meadow=new THREE.Group();skyScene.add(meadow);
const pathVertices=[],pathIndices=[];
for(let i=0;i<45;i++){
 const z=-2-i*1.6,x=Math.sin(i*.12)*2.5-1,width=1.8-i*.028;
 pathVertices.push(x-width,-.25,z,x+width,-.25,z);
 if(i<44){const k=i*2;pathIndices.push(k,k+2,k+1,k+1,k+2,k+3);}
}
const pathGeo=new THREE.BufferGeometry();pathGeo.setAttribute('position',new THREE.Float32BufferAttribute(pathVertices,3));pathGeo.setIndex(pathIndices);pathGeo.computeVertexNormals();
mesh(pathGeo,new THREE.MeshBasicMaterial({color:'#d9c699',side:THREE.DoubleSide}),meadow,false);
for(let i=0;i<34;i++){
 const x=(i%2?1:-1)*(5+(i*2.71%20)),z=-12-(i*3.13%36),g=new THREE.Group();g.position.set(x,-.1,z);meadow.add(g);
 const stem=mesh(new THREE.CylinderGeometry(.03,.04,.55,5),'#516749',g);stem.position.y=.25;
 for(let j=0;j<3;j++){const leaf=mesh(new THREE.ConeGeometry(.11,.6,4),'#6d854f',g);leaf.rotation.z=(j-1)*.6;leaf.position.set((j-1)*.1,.25,0);}
 if(i%3===0)ball(0,.58,0,.11,i%2?'#f4d381':'#eee5ce',g);
}
for(let i=0;i<12;i++){
 const x=(i%2?1:-1)*(18+(i*2.4%25)),z=-35-i*2,g=new THREE.Group();g.position.set(x,0,z);meadow.add(g);
 mesh(new THREE.CylinderGeometry(.15,.24,2.8,7),'#69583d',g).position.y=1.4;
 for(let j=0;j<3;j++){const crown=mesh(new THREE.ConeGeometry(1.8-j*.4,2.6,7),'#50765d',g);crown.position.y=2.3+j*.9;}
}
const clouds=new THREE.Group();skyScene.add(clouds);
for(let i=0;i<3;i++){
 const g=new THREE.Group();g.position.set(i===0?-50:i===1?50:20,24+i*8,-100);clouds.add(g);
 for(let j=0;j<4;j++){const b=ball(j*3,Math.sin(j)*1.2,0,3.1,new THREE.MeshBasicMaterial({color:'#e5eddf'}),g);b.scale.y*=.5;}
}
function updateSky(){
 const alt=Math.min(state.angle,180-state.angle)*Math.PI/180,low=clamp((.65-Math.sin(alt))/.5,0,1);
 skyUniforms.colourAmount.value=state.stage==='journey'?skyColourAmount:1;airlessSky.stars.visible=state.planet==='none';
 skyUniforms.low.value=low;skyUniforms.planet.value={earth:0,mars:1,titan:2,none:3}[state.planet];
 const dir=new THREE.Vector3(state.angle>90?-.28:.28,Math.sin(alt),-Math.cos(alt)).normalize();skyUniforms.sunDirection.value.copy(dir);
 skyCamera.lookAt(layout.w/layout.h<.8?dir.x/Math.max(.2,-dir.z)*40:0,5,-40);
 skySun.position.copy(dir).multiplyScalar(90);skySun.visible=state.planet!=='titan';
 skyLight.position.copy(dir).multiplyScalar(50);
 ground.material=toon({earth:'#829b64',mars:'#b07754',titan:'#827055',none:'#a9a8a1'}[state.planet]);
 for(const [i,m]of mountains.children.entries())m.material=toon(state.planet==='earth'?(i%2?'#78968b':'#94ac98'):state.planet==='mars'?'#a56f55':state.planet==='titan'?'#8c704c':'#93979d');
 meadow.visible=state.planet==='earth';clouds.visible=state.planet==='earth';
 skyRocks.visible=true;
}
function setAngle(value,fromUser=false){
 const next=clamp(value,1,179);
 if(Math.abs(next-state.angle)>.001)angleSettledAt=time+.45;
 state.angle=next;sun.position.copy(sunPosition(state.angle));light.position.set(sun.position.x,sun.position.y,8);
 if(fromUser){state.low ||=Math.sin(state.angle*Math.PI/180)<.38;state.high ||=Math.sin(state.angle*Math.PI/180)>.85;
  $('sunHandle').classList.remove('guide');
  if(state.stage==='start'&&state.low&&state.high){say('You made a blue day and an orange evening. Let’s find out why.');$('begin').disabled=false;}
  if(state.stage==='journey'&&state.low){updateExplorationCopy();$('challenge').disabled=false;}
 }
 buildRays();updateSky();positionHandle();
 if(state.stage==='journey'){setWaveSkyColour(0);airMaterial.uniforms.strength.value=.8;}
 else if(state.stage!=='check'){
  const warm=clamp((.6-Math.sin(state.angle*Math.PI/180))/.4,0,1);
  airMaterial.uniforms.tint.value.set('#74bcf0').lerp(new THREE.Color('#f3ad64'),warm);airMaterial.uniforms.strength.value=.8;
 }
}
function positionHandle(){
 $('explanation').dataset.side=state.angle>100?'right':'left';
 const q=sun.getWorldPosition(new THREE.Vector3()).project(camera),handle=$('sunHandle'),half=(layout.w<800?70:86)/2;
 handle.style.left=clamp((q.x+1)*layout.w/2,half+6,layout.w-half-6)+'px';handle.style.top=(1-q.y)*layout.h/2+'px';
 if(state.stage==='check'&&tasks(state.round)[state.task].kind==='path'&&!state.reveal){
  for(const [id,obj]of[['high',highSun],['low',lowSun]]){const b=$(id);if(!b)continue;const p=obj.getWorldPosition(new THREE.Vector3()).project(camera),half=b.getBoundingClientRect().width/2;b.style.left=clamp((p.x+1)*layout.w/2,half+8,layout.w-half-8)+'px';b.style.top=(1-p.y)*layout.h/2+45+'px';}
 }
}
function showScene(){
 positionTeachingScene();
 $('explanation').style.borderColor=state.stage==='single'&&singleColour===2?'#ff9b8d':'#8bc8fa';
 $('sunHandle').hidden=state.sky||state.stage!=='journey';
 track.visible=!state.sky&&state.stage==='journey';
 closeAir.visible=state.stage==='air'||state.stage==='single'||state.stage==='journey'&&!wavePending;
 air.visible=state.planet!=='none';
 const pathTask=state.stage==='check'&&tasks(state.round)[state.task].kind==='path'&&!state.reveal;
 sun.visible=!pathTask;highSun.visible=lowSun.visible=pathTask;
 highSun.position.copy(sunPosition(state.round%2?110:70));lowSun.position.copy(sunPosition(state.round%2?179:1));
 if(state.stage==='check'&&!state.reveal){airMaterial.uniforms.tint.value.set('#a5b6c4');airMaterial.uniforms.strength.value=.55;}
 const progress=state.stage==='light'?0:state.stage==='air'?1:state.stage==='single'?2+(singleEvening?2:0)+(singleColour===2?1:0):6;
 [...$('progress').children].forEach((dot,i)=>dot.classList.toggle('on',i<=progress));
 const dark=!state.sky||['none','titan'].includes(state.planet);
 document.body.classList.toggle('space-view',!state.sky);
 document.body.classList.toggle('dark-view',dark);
 document.body.style.color=dark?'#fff5df':'#141414';
 buildRays();updateSky();positionHandle();
 if(['light','air'].includes(state.stage))airMaterial.uniforms.tint.value.copy(neutralAir);
}
function viewButton(){return ['view',state.sky?'See the air':'See the sky',state.sky?'air':'eye',()=>{state.sky=!state.sky;renderUI();}];}
function updateExplorationCopy(){
 if(state.sky){say('This is the sky seen from the explorer’s eyes.');return;}
 const low=Math.min(state.angle,180-state.angle)<15;
 say(low?'With the Sun low, much of the blue scatters away. Red light can reach you directly and after scattering.':'With the Sun high, scattered blue light reaches your eyes from across the sky.');
}
function stage(name){
 if(name==='air'){singleStart=time;setAngle(90);}
 if(name==='single'){singleEvening=false;singleColour=0;singleStart=time;setAngle(90);}
 if(name==='journey'){state.low=false;setAngle(90);}
 state.stage=name;state.sky=false;state.choice=null;state.reveal=false;state.assisted=false;renderUI();
}
function renderUI(){
 $('choices').hidden=true;$('choices').classList.remove('in-scene');$('worldChoices').hidden=true;
 if(state.stage==='light'){
  title('The colours in sunlight');say('Sunlight looks white, but it carries all the colours of the rainbow.');
  actions([['meetAir','Meet the air','arrow',()=>stage('air'),true]]);
 }else if(state.stage==='air'){
  title('Air scatters light');say('Air is made of tiny particles. They scatter light, sending it in new directions.');
  actions([['replayAir','Replay','restart',()=>{singleStart=time;buildRays();}],['meetBlue','Follow blue','arrow',()=>stage('single'),true]]);
 }else if(state.stage==='single'){
  title(singleEvening?(singleColour===0?'Blue at sunset':'Red at sunset'):(singleColour===0?'Blue at noon':'Red at noon'));
  say(singleEvening?(singleColour===0?'At sunset, light crosses more air. Much of the blue scatters away before it can reach your eyes.':'More red light stays in the beam. Some scatters toward your eyes, making the sky near sunset look warm.'):(singleColour===0?'Blue photons scatter in all directions. Some reach your eyes from across the sky, making it look blue.':'Red photons mostly go straight through the air. You see that light directly from the Sun.'));
  const nextLabel=singleColour===0?(singleEvening?'Evening: red':'Noon: red'):(singleEvening?'Move the Sun':'Evening: blue');
  actions([['replayPhoton','Replay','restart',()=>{singleStart=time;buildRays();}],['nextPhoton',nextLabel,'arrow',()=>{
   if(singleColour===0){singleColour=2;singleStart=time;renderUI();}
   else if(!singleEvening){singleEvening=true;singleColour=0;singleStart=time;setAngle(1);renderUI();}
   else stage('journey');
  },true]]);
 }else if(state.stage==='journey'){
  title('Move the Sun');updateExplorationCopy();
  actions([viewButton(),['challenge','My turn','arrow',startCheck,true]]);$('challenge').disabled=!state.low;
 }else if(state.stage==='check')renderCheck();
 else if(state.stage==='done'){
  title('Your sky discoveries');
  say(evidence(state.responses)?'Your predictions used all three ideas today. Ready for another world?':'Needs more practice: let’s follow the light once more.');
  actions([['practice','Explore again','restart',()=>{stage('journey');}],['extra','Other worlds','rocket',()=>{state.planet='earth';state.planetStep=0;state.sky=true;state.stage='planets';setAngle(65);renderUI();},true]]);
 }else if(state.stage==='planets')renderPlanets();
 showScene();
}
function startCheck(){state.round++;state.responses=[];state.task=0;state.planet='earth';state.stage='check';loadTask();}
function loadTask(){state.choice=null;state.reveal=false;state.assisted=false;state.sky=false;setAngle(tasks(state.round)[state.task].angle);renderUI();}
function choose(value){if(state.reveal)return;state.choice=value;renderCheck();showScene();}
function renderCheck(){
 const task=tasks(state.round)[state.task];title(task.title);
 if(!state.reveal){
  say(state.assisted?({scatter:'Think of the blue light that air sent towards the explorer.',path:'Compare the air crossed by a high Sun and a low Sun.',morning:'A low Sun has a long journey at both ends of the day.'}[task.kind]):task.prompt);
  if(task.kind==='path'){
   choices([['high','High Sun','sun',()=>choose('high')],['low','Low Sun','sun',()=>choose('low')]]);
   $('choices').classList.add('in-scene');
  }else choices([['blue','Blue','sun',()=>choose('blue'),'blue'],['orange','Orange','sun',()=>choose('orange'),'orange']]);
  for(const b of $('choices').children)b.setAttribute('aria-pressed',String(b.id===state.choice));
  actions([['hint','Help','hint',()=>{state.assisted=true;renderCheck();}],['commit','Show me','check',commit,true]]);
  $('commit').disabled=state.choice===null;
 }else{
  $('choices').hidden=true;
  const correct=state.responses.at(-1).correct;
  say((correct?'Yes! ':'Look closely. ')+task.feedback);
  actions([...(task.kind==='morning'?[]:[viewButton()]),['next',state.task===2?'Finish':'Next discovery','arrow',()=>{
   if(state.task<2){state.task++;loadTask();}else stage('done');
  },true]]);
 }
 // A neutral atmosphere tint hides sky colour before commitment. Low/high choice
 // changes nothing until commit; feedback illustrates the correct low path.
 scene.background.set('#07101f');
}
function commit(){
 if(state.choice===null||state.reveal)return;
 const task=tasks(state.round)[state.task];
 state.responses.push({kind:task.kind,choice:state.choice,correct:state.choice===task.answer,assisted:state.assisted});
 state.reveal=true;glow=1;
 if(task.kind==='path')setAngle(state.round%2?179:1);
 if(task.kind==='morning')state.sky=true;
 renderUI();
}
const planetCopy={
 earth:['Earth’s air is mostly nitrogen and oxygen. Explore its sky.','Air scatters blue strongly; a low Sun leaves warmer light.'],
 mars:['Mars has thin air, mostly carbon dioxide, with floating dust.','Mars’ dust can make the sky near sunset blue!'],
 titan:['Titan is Saturn’s moon. Its air has nitrogen and methane.','Sunlight helps make a thick haze, giving Titan an orange sky.'],
 none:['Imagine taking all the air away. What happens to the sky?','Without air to scatter sunlight, the daytime sky is dark.']
};
function renderPlanets(){
 state.sky=true;title({earth:'Visit Earth',mars:'Visit Mars',titan:'Visit Titan',none:'A world without air'}[state.planet]);
 say(planetCopy[state.planet][state.planetStep]);
 $('worldChoices').hidden=false;$('worldChoices').replaceChildren();
 for(const [p,label]of[['earth','Earth'],['mars','Mars'],['titan','Titan'],['none','No air']]){
  const b=button($('worldChoices'),'planet-'+p,label,p==='none'?'air':'globe',()=>{state.planet=p;state.planetStep=0;setAngle(65);renderUI();});
  b.setAttribute('aria-pressed',String(state.planet===p));
 }
 actions([['planetChange',state.planetStep?'See daytime':state.planet==='titan'?'See the haze':state.planet==='none'?'Find out':'See sunset','sun',()=>{
  state.planetStep=1-state.planetStep;setAngle(state.planetStep?1:65);renderUI();
 }],['back','Back to Earth','globe',()=>{state.planet='earth';state.sky=false;stage('done');}]]);
}
function resetLesson(){singleEvening=false;singleColour=0;singleStart=time;wavePaused=reduced;updateWaveControls();state={stage:'light',angle:90,low:false,high:false,sky:false,round:0,task:0,responses:[],assisted:false,choice:null,reveal:false,planet:'earth',planetStep:0};scene.background.set('#07101f');setAngle(90);renderUI();}
$('reset').innerHTML=svg('restart');$('reset').onclick=reset;
$('sunHandle').innerHTML=svg('move');let dragging=false,dragStart=null,dragDistance=0;
$('sunHandle').addEventListener('pointerdown',e=>{dragging=true;queueWave();dragStart={x:e.clientX,y:e.clientY};dragDistance=0;$('sunHandle').setPointerCapture(e.pointerId);});
$('sunHandle').addEventListener('pointermove',e=>{
 if(!dragging)return;
 dragDistance=Math.max(dragDistance,Math.hypot(e.clientX-dragStart.x,e.clientY-dragStart.y));
 const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(e.clientX/layout.w*2-1,1-e.clientY/layout.h*2),camera);
 const point=new THREE.Vector3();ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,0,1),0),point);world.worldToLocal(point);
 setAngle(Math.atan2(Math.max(.001,point.y-DRAW.base)/DRAW.y,point.x/DRAW.x)*180/Math.PI,true);
});
$('sunHandle').addEventListener('pointerup',()=>{if(dragging&&dragDistance<8)setAngle(Math.sin(state.angle*Math.PI/180)<.4?90:1,true);dragging=false;angleSettledAt=time+.45;});
$('sunHandle').addEventListener('pointercancel',()=>{dragging=false;angleSettledAt=time+.45;});
$('sunHandle').addEventListener('keydown',e=>{
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();
 let a=state.angle;
 if(e.key==='Home')a=90;else if(e.key==='End')a=1;
 else if(e.key==='ArrowLeft')a+=8;else if(e.key==='ArrowRight')a-=8;
 else if(e.key==='ArrowUp')a+=a<90?8:-8;else a+=a<90?-8:8;
 setAngle(a,true);
});
function resize(){
 layout.w=document.documentElement.clientWidth;layout.h=document.documentElement.clientHeight;renderer.setSize(layout.w,layout.h,false);
 outlineMat.uniforms.viewport.value.set(layout.w,layout.h);
 space.resize(Math.min(devicePixelRatio,2));airlessSky.resize(Math.min(devicePixelRatio,2));
 // Reserve header and action space, while keeping the scene one continuous world.
 const aspect=layout.w/layout.h,viewWidth=aspect<.8?27.6:Math.max(30,19.2*aspect),viewHeight=viewWidth/aspect;
 camera.left=-viewWidth/2;camera.right=viewWidth/2;camera.top=viewHeight/2;camera.bottom=-viewHeight/2;
 camera.position.set(0,3.7,28);camera.lookAt(0,3.7,0);camera.updateProjectionMatrix();camera.updateMatrixWorld();
 // On phones the Sun centres on the frame edge at the ends of its rail.
 // Uniform scene scale preserves the geometry while the camera crops the Sun.
 world.scale.setScalar(1);positionTeachingScene();
 placeObserver();
 for(const body of [sun,highSun,lowSun])body.scale.setScalar(aspect<.8?1.5:1);
 skyCamera.aspect=aspect;skyCamera.updateProjectionMatrix();world.updateMatrixWorld(true);positionHandle();updateSky();buildRays();
}
window.addEventListener('resize',resize);
function positionTeachingScene(){
 if(layout.w/layout.h<.8){
  // Place the surface observer 65% down the phone, leaving less empty ground.
  world.position.y=3.7-DRAW.base-(camera.top-camera.bottom)*.15;
 }else world.position.y=['light','air','single'].includes(state.stage)?-.9:0;
}
function buildTeachingWave(){
 const eye=photonEye(),kind=state.stage==='air'?'blue':state.stage==='single'?(singleColour===0?'blue':'red'):'mixed';
 let paths=teachingWave(state.angle,kind,eye);if(state.stage==='air')paths=paths.filter((p,i)=>[0,4,9].includes(i));waveElapsed=0;wavePending=false;rays.visible=true;closeAir.visible=true;
 const pixelsPerUnit=layout.w/(camera.right-camera.left),speed=(layout.w<800?65:90)/(.7*pixelsPerUnit);
 const pathsView=paths.map(p=>{
  const colour=state.stage==='air'?'#fff5df':p.c===0?'#54bcff':'#ff7666';
  const vec=q=>new THREE.Vector3(q.x,q.y,eye.z+.1);
  const effect=photonEffects(rays,colour,world.scale.x,pixelsPerUnit),marker=effect.marker;
  if(p.scattered)ball(p.site.x,p.site.y,eye.z,.075,'#dce9eb',closeAir);
  const tip=mesh(new THREE.ConeGeometry(.075,.22,8),new THREE.MeshBasicMaterial({color:colour}),rays,false),direction=vec(p.end).sub(vec(p.site)).normalize();
  tip.position.copy(vec(p.end)).addScaledVector(direction,-.11);tip.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction);tip.visible=false;
  return {...p,...waveTiming(p,world.scale.x,speed),source:vec(p.source),site:vec(p.site),end:vec(p.end),effect,marker,tip};
 });
 const flash=mesh(new THREE.RingGeometry(.54,.59,48),new THREE.MeshBasicMaterial({color:'#fff5df',transparent:true,opacity:0,depthWrite:false}),rays,false);flash.position.copy(eye);flash.position.z+=.15;
 singleMotion={paths:pathsView,flash,firstSkyArrival:Math.min(...pathsView.filter(p=>p.reachesEye&&p.scattered).map(p=>p.delay+p.arrival)),duration:Math.max(...pathsView.map(p=>p.delay+p.arrival))+3.8};animateTeachingWave(0);
}
function animateTeachingWave(dt){
 if(!singleMotion)return;
 const illustration=['air','single'].includes(state.stage);
 if(!illustration&&!wavePaused&&!dragging&&time>=angleSettledAt){waveElapsed+=dt;if(waveElapsed>=singleMotion.duration)waveElapsed%=singleMotion.duration;}
 const elapsed=illustration?(reduced?singleMotion.duration:time-singleStart):(reduced&&waveElapsed===0?singleMotion.duration:waveElapsed);
 let flash=0;
 for(const p of singleMotion.paths){
  const t=elapsed-p.delay,arrival=p.arrival;
  p.tip.visible=!p.reachesEye&&t>=arrival;
  const q=wavePosition(p,t),point=new THREE.Vector3(q.x,q.y,p.source.z);
  p.effect.update(p,point,t);
  if(p.reachesEye&&(reduced||t>=arrival&&t<arrival+.45))flash=Math.max(flash,reduced?.5:1-(t-arrival)/.45);
 }
 singleMotion.flash.material.opacity=flash;
 if(state.stage==='journey')setWaveSkyColour(reduced&&wavePaused&&waveElapsed===0?1:waveColourAmount(elapsed,singleMotion.firstSkyArrival,singleMotion.duration));
}
function updateWaveControls(){
 $('wavePause').textContent=wavePaused?'▶ Play':'Ⅱ Pause';
 $('waveReplay').textContent='↺ Replay';
}
$('wavePause').onclick=()=>{wavePaused=!wavePaused;updateWaveControls();};
$('waveReplay').onclick=()=>{waveElapsed=0;buildRays();};
updateWaveControls();
function photonEye(){world.updateMatrixWorld(true);return world.worldToLocal(scout.eyeAnchor.getWorldPosition(new THREE.Vector3()));}
function setWaveSkyColour(amount){
 skyColourAmount=amount;
 const altitude=Math.min(state.angle,180-state.angle),warm=clamp((15-altitude)/14,0,1);
 airMaterial.uniforms.tint.value.copy(neutralAir).lerp(dayAir.clone().lerp(eveningAir,warm),amount);
 skyUniforms.colourAmount.value=amount;
}
function queueWave(){
 setWaveSkyColour(0);
 clearGroup(rays);clearGroup(closeAir);singleMotion=null;waveElapsed=0;wavePending=true;rays.visible=false;closeAir.visible=false;
}

const openingScene=skyScene.clone(true),openingCamera=new THREE.PerspectiveCamera(65,1,.1,300);
const openingSky=skyMaterial.clone();openingSky.uniforms.low.value=.88;openingSky.uniforms.colourAmount.value=1;openingSky.uniforms.planet.value=0;openingSky.uniforms.sunDirection.value.set(.28,.16,-1).normalize();
openingScene.traverse(o=>{if(o.material===skyMaterial)o.material=openingSky;});
openingScene.children[skyScene.children.indexOf(airlessSky.stars)].visible=false;
const openingSun=openingScene.children[skyScene.children.indexOf(skySun)];openingSun.position.set(25,15,-90);openingSun.scale.setScalar(2.8);
// Continue the existing winding path through the near foreground rather than ending it in mid-frame.
const openingPath=new THREE.BufferGeometry();openingPath.setAttribute('position',new THREE.Float32BufferAttribute([-2.8,-.25,-2,.8,-.25,-2,-6,-.25,12,4,-.25,12],3));openingPath.setIndex([0,2,1,1,2,3]);openingPath.computeVertexNormals();
openingScene.add(new THREE.Mesh(openingPath,new THREE.MeshBasicMaterial({color:'#d9c699',side:THREE.DoubleSide})));
const opening=createOpening({question:'Why does the sky change colour?',onStart:resetLesson,focusTarget:'#meetAir'});
function renderOpening(){openingCamera.aspect=layout.w/layout.h;openingCamera.position.set(0,2,6);openingCamera.lookAt(0,6,-45);openingCamera.updateProjectionMatrix();renderer.render(openingScene,openingCamera);}
function reset(){resetLesson();renderOpening();opening.show(true);}
function animate(ms){
 if(opening.isOpen){renderOpening();frames++;lastFrame=ms;requestAnimationFrame(animate);return;}
 const wallDt=Math.min(.25,Math.max(0,(ms-lastFrame)/1000)),dt=Math.min(.05,wallDt);lastFrame=ms;time=ms/1000;
 if(wavePending&&state.stage==='journey'&&!dragging&&time>=angleSettledAt)buildTeachingWave();
 solar.tick(reduced?0:time);animateTeachingWave(wallDt);
 if(!reduced){scout.scarfTail.rotation.z=-.18+Math.sin(time*1.2)*.035;glow*=.96;}
 renderer.render(state.sky?skyScene:scene,state.sky?skyCamera:camera);frames++;
 requestAnimationFrame(animate);
}
// Read-only diagnostics used by local validation; no storage or transmission.
window.skyExplorer={snapshot:()=>JSON.parse(JSON.stringify({...state,coverOpen:opening.isOpen,worldScale:world.scale,path:airPath(state.angle),singleColour,singleEvening,wavePaused,waveElapsed,wavePending,dragging,skyColourAmount,airTint:airMaterial.uniforms.tint.value.getHexString(),airlessStars:airlessSky.stars.visible,starCount:airlessSky.stars.geometry.attributes.position.count,firstSkyArrival:singleMotion?.firstSkyArrival,visiblePhotons:singleMotion?.paths.filter(p=>p.marker.visible).length??0,visibleMolecules:closeAir.visible?closeAir.children.length:0,waveDuration:singleMotion?.duration,teachingPaths:singleMotion?.paths.map(p=>({c:p.c,scattered:p.scattered,reachesEye:p.reachesEye,source:p.source,site:p.site,end:p.end,marker:p.marker.position,incomingTime:p.incomingTime,arrival:p.arrival,speed:p.speed})),evidence:evidence(state.responses),frames})),rayAlignment:()=>{world.updateMatrixWorld(true);const eye=world.worldToLocal(scout.eyeAnchor.getWorldPosition(new THREE.Vector3()));return {targets:rayTargets.length,maxEyeError:Math.max(0,...rayTargets.map(p=>p.distanceTo(eye))),sites:[]};},graphicsReady:()=>!renderer.getContext().isContextLost()&&frames>2,sunScreen:()=>{const q=sun.getWorldPosition(new THREE.Vector3()).project(camera);return{x:(q.x+1)*layout.w/2,y:(1-q.y)*layout.h/2};}};
resize();reset();requestAnimationFrame(animate);
