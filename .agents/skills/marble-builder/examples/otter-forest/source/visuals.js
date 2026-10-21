import * as T from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {random,metrics} from './model.mjs';
import {otterPose} from './otter-animation.mjs';
export function createView(host){
 const renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.setClearColor(0x123f4b,0);host.append(renderer.domElement);
 const scene=new T.Scene();scene.fog=new T.Fog(0x207b80,45,95);
 const camera=new T.PerspectiveCamera(37,1,.1,150);
 scene.add(new T.HemisphereLight(0xd4ffed,0x2c5966,1.25));
 const sun=new T.DirectionalLight(0xffedbc,1.85);sun.position.set(-12,24,9);scene.add(sun);
 const gradient=new T.DataTexture(new Uint8Array([55,130,230]),3,1,T.RedFormat);
 gradient.minFilter=gradient.magFilter=T.NearestFilter;gradient.needsUpdate=true;
 const mat=c=>new T.MeshToonMaterial({color:c,gradientMap:gradient});
 const black=new T.MeshBasicMaterial({color:0x102d30,side:T.BackSide});
 const ink=new T.LineBasicMaterial({color:0x172f2d});
 const palette={sand:mat(0xc5bf98),rock:mat(0x668d88),rockLight:mat(0x8fa69a),body:mat(0x70503c),head:mat(0xbc9873),cream:mat(0xf2dab1),nose:mat(0x152b2c),kelp:mat(0x9aab42),stem:mat(0x839342),urchin:mat(0x855999),fish:mat(0xee9850),fin:mat(0xe9c678)};
 function mesh(geo,material,parent,pos=[0,0,0],scale=[1,1,1],outline=true){
  const m=new T.Mesh(geo,material);m.position.set(...pos);m.scale.set(...scale);parent.add(m);
  if(outline){const edge=new T.Mesh(geo,black);edge.scale.setScalar(typeof outline==='number'?outline:1.025);m.add(edge);}
  return m;
 }
 const sphere=new T.SphereGeometry(1,16,12);
 function ellipsoid(x,y,z,sx,sy,sz){return sphere.clone().scale(sx,sy,sz).translate(x,y,z);}
 function merged(parts){const g=mergeGeometries(parts.map(g=>g.index?g.toNonIndexed():g));parts.forEach(g=>g.dispose());return g;}
 const root=new T.Group();scene.add(root);
 const rand=random(71);
 // Broad sculpted rock shelf: a coherent habitat with a scalloped sandstone edge.
 const shelfShape=new T.Shape();
 for(let i=0;i<=80;i++){const a=i/80*Math.PI*2,r=1+.025*Math.sin(a*9)+.035*Math.sin(a*5);const x=Math.cos(a)*12.3*r,y=Math.sin(a)*7.1*r;i?shelfShape.lineTo(x,y):shelfShape.moveTo(x,y);}
 const shelfGeo=new T.ExtrudeGeometry(shelfShape,{depth:1.7,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.42,bevelThickness:.35,curveSegments:40});
 shelfGeo.rotateX(-Math.PI/2);shelfGeo.translate(0,-2,0);
 mesh(shelfGeo,palette.rock,root,[0,0,0],[1,1,1],1.009);
 const sandGeo=new T.ShapeGeometry(shelfShape,40);sandGeo.rotateX(-Math.PI/2);
 mesh(sandGeo,palette.sand,root,[0,.055,0],[.985,1,.985],false);
 // Etched contour lines and sparse shells keep the seabed readable between plants.
 for(let i=0;i<55;i++){
  const a=rand()*6.28,r=Math.sqrt(rand());const x=Math.cos(a)*11.6*r,z=Math.sin(a)*6.5*r;
  if(i<23){const g=new T.IcosahedronGeometry(.4+rand()*.75,1);g.scale(1.4,.45+rand()*.45,1);
   const rock=mesh(g,i%3?palette.rockLight:palette.rock,root,[x,.02,z]);rock.rotation.y=rand()*6.28;
  }else{
   const shell=mesh(new T.SphereGeometry(.12+rand()*.1,8,6),palette.cream,root,[x,.12,z],[1,.4,.7],false);
   shell.rotation.y=rand()*6.28;
  }
 }
 // Soft caustic ribbons generated in the scene; no external textures.
 const caustic=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:`varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 p;uniform float time;void main(){float a=sin(p.x*2.4+sin(p.z*1.7+time*.15))+sin(p.z*2.9+sin(p.x*1.4-time*.12));float b=smoothstep(1.15,1.42,a)*(1.-smoothstep(1.42,1.7,a));gl_FragColor=vec4(.96,1.,.75,b*.19);}`});
 const causticPlane=new T.Mesh(sandGeo,caustic);causticPlane.position.y=.08;root.add(causticPlane);
 // Blades are shaped ribbons with curved midribs and dark perimeter strokes.
 function kelpGeometry(height,phase,distant=false){
  const blades=[],stems=[],bulbs=[],edges=[];
  for(let branch=0;branch<(distant?1:2);branch++){
   const h=height*1.16*(branch===0?1:.72),offset=(branch-1)*.2;
   const curve=new T.CatmullRomCurve3(Array.from({length:9},(_,j)=>{const t=j/8;return new T.Vector3(Math.sin(t*3+phase)*.34*t+offset*t,h*t,Math.cos(t*2+phase)*.25*t);}));
   stems.push(new T.TubeGeometry(curve,20,.037,5,false));
   for(let j=1;j<11;j++){
    const t=j/12,base=curve.getPoint(t),side=j%2?1:-1;
    const angle=phase+branch*2.1+j*.47,dir=new T.Vector3(Math.cos(angle)*side,0,Math.sin(angle)*side);
    const len=(1.1+Math.sin(t*Math.PI)*.9)*(branch===0?1:.85),width=.10+Math.sin(t*Math.PI)*.075;
    const vs=[],ix=[],left=[],right=[];
    for(let s=0;s<=10;s++){
     const q=s/10,w=Math.pow(Math.sin(q*Math.PI),.8)*width;
     const center=base.clone().addScaledVector(dir,len*q);
     center.y+=Math.sin(q*Math.PI)*.38-q*q*.65;
     center.addScaledVector(new T.Vector3(-dir.z,0,dir.x),Math.sin(q*6+phase)*q*.18);
     const cross=new T.Vector3(-dir.z,Math.sin(q*4+phase)*.35,dir.x);
     for(const sign of [-1,1]){const v=center.clone().addScaledVector(cross,w*sign);vs.push(v.x,v.y,v.z);(sign<0?left:right).push(v);}
     if(s<10){const n=s*2;ix.push(n,n+1,n+2,n+1,n+3,n+2);}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vs,3));g.setIndex(ix);g.computeVertexNormals();blades.push(g);
    for(let s=0;s<10;s++)for(const side of [left,right])edges.push(...side[s].toArray(),...side[s+1].toArray());
    // Air bladders catch the warm light at the base of each blade.
    if(j%2===0)bulbs.push(ellipsoid(base.x,base.y,base.z,.075,.12,.075));
   }
  }
  const edge=new T.BufferGeometry();edge.setAttribute('position',new T.Float32BufferAttribute(edges,3));
  return {blade:merged(blades),stem:merged(stems),bulb:merged(bulbs),edge};
 }
 palette.kelp.side=T.DoubleSide;
 const kelpColors=[0x9eaa42,0xb4a146,0x7d9b49,0xc0ad50].map(c=>{const m=mat(c);m.side=T.DoubleSide;return m;});
 const kelps=new Map();
 function makeKelp(k){
  const group=new T.Group();group.position.set(k.x,.1,k.z);root.add(group);
  const geo=kelpGeometry(k.height,k.phase);
  const blade=mesh(geo.blade,kelpColors[k.id%4].clone(),group,[0,0,0],[1,1,1],false);
  const lines=new T.LineSegments(geo.edge,ink.clone());group.add(lines);
  const stem=mesh(geo.stem,palette.stem.clone(),group,[0,0,0],[1,1,1],false);
  const bulb=mesh(geo.bulb,palette.kelp.clone(),group,[0,0,0],[1,1,1],false);
  const hold=mesh(new T.SphereGeometry(.24,8,6),palette.stem,group,[0,.02,0],[1,.35,1],false);
  const hit=mesh(new T.CylinderGeometry(.8,.8,k.height,6),new T.MeshBasicMaterial({visible:false}),group,[0,k.height/2,0],[1,1,1],false);hit.userData={type:'kelp',id:k.id};
  for(const m of [blade,stem,bulb])m.userData={type:'kelp',id:k.id};
  kelps.set(k.id,{group,hit,picks:[blade,stem,bulb],materials:[blade.material,lines.material,stem.material,bulb.material]});return group;
 }
 // Meadow leaves rise directly from rhizomes; epiphytes coat their surfaces.
 const grasses=new Map(),grassMat=mat(0x80bd74),algaeMat=mat(0x8b793f);grassMat.side=algaeMat.side=T.DoubleSide;
 function makeGrass(k){
  const group=new T.Group();group.position.set(k.x,.1,k.z);root.add(group);const parts=[];
  for(let j=0;j<9;j++){
   const vs=[],ix=[],angle=j*2.39996+k.phase,h=2.7+(j%4)*.55;
   for(let n=0;n<=12;n++){const t=n/12,r=.18+t*t*(.6+(j%3)*.3),width=.14*Math.sin(Math.PI*(.08+t*.92));for(const side of [-1,1])vs.push(Math.cos(angle)*r+Math.sin(angle)*width*side,h*t,Math.sin(angle)*r-Math.cos(angle)*width*side);if(n<12){const a=n*2;ix.push(a,a+1,a+2,a+1,a+3,a+2);}}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vs,3));g.setIndex(ix);g.computeVertexNormals();parts.push(g);
  }
  const geo=merged(parts),leaf=mesh(geo,grassMat.clone(),group,[0,0,0],[1,1,1],false);
  group.add(new T.LineSegments(new T.EdgesGeometry(geo,25),ink));
  const film=mesh(geo,algaeMat.clone(),group,[.015,.02,.015],[1.015,1.001,1.015],false);film.material.transparent=true;film.material.depthWrite=false;
  leaf.userData=film.userData={type:'kelp',id:k.id};grasses.set(k.id,{group,leaf,film,picks:[leaf,film]});
 }
 const crabParts=[ellipsoid(0,.26,0,.45,.22,.32)],slugParts=[ellipsoid(0,.2,0,.22,.18,.45),ellipsoid(0,.28,.32,.19,.19,.2)];
 for(const side of [-1,1]){
  for(let j=0;j<4;j++){const leg=new T.CylinderGeometry(.035,.025,.65,5);leg.rotateZ(side*1.1);leg.rotateY((j-1.5)*.4);leg.translate(side*.48,.14,(j-1.5)*.18);crabParts.push(leg);}
  crabParts.push(ellipsoid(side*.49,.32,.4,.15,.12,.22));
  slugParts.push(ellipsoid(side*.12,.48,.38,.04,.19,.04));
 }
 const starParts=[ellipsoid(0,.16,0,.3,.13,.3)],musselParts=[ellipsoid(-.045,.2,0,.17,.23,.34),ellipsoid(.045,.2,0,.17,.23,.34)];
 for(let i=0;i<5;i++){const angle=i*Math.PI*2/5;const arm=ellipsoid(0,.12,.3,.14,.1,.45);arm.rotateY(angle);starParts.push(arm);for(let j=1;j<5;j++)starParts.push(ellipsoid(Math.sin(angle)*j*.13,.22-j*.012,Math.cos(angle)*j*.13,.035,.025,.035));}
 const smallViews={};
 for(const [kind,parts,color,cap]of [['crab',crabParts,0xd58d59,32],['slug',slugParts,0xe5bb67,100],['star',starParts,0xe4a060,12],['mussel',musselParts,0x374d70,100]]){
  const geo=merged(parts),body=new T.InstancedMesh(geo,mat(color),cap),outline=new T.InstancedMesh(geo,black,cap);root.add(body,outline);smallViews[kind]={body,outline};
 }
 // Purple urchins: tapered spines distributed over the entire body.
 const spikes=[ellipsoid(0,.26,0,.29,.23,.29)];
 for(let i=0;i<72;i++){
  const angle=i*2.39996,y=1-2*(i+.5)/72,rad=Math.sqrt(1-y*y),v=new T.Vector3(Math.cos(angle)*rad,y,Math.sin(angle)*rad);
  const spike=new T.ConeGeometry(.037,.30+(i%3)*.035,5);
  spike.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v));spike.translate(v.x*.32,.26+v.y*.22,v.z*.32);spikes.push(spike);
 }
 const urchinGeo=merged(spikes);
 const urchins=new T.InstancedMesh(urchinGeo,palette.urchin,140);urchins.instanceMatrix.setUsage(T.DynamicDrawUsage);root.add(urchins);
 const urchinInk=new T.InstancedMesh(urchinGeo,black,140);root.add(urchinInk);let urchinIds=[];
 // A small frond at the feeding site makes the otherwise hidden grazing visible.
 const feedingLeaf=mesh(new T.SphereGeometry(1,12,6),palette.kelp,root,[0,.16,0],[.13,.035,.6]);feedingLeaf.visible=false;
 const dummy=new T.Object3D();
 const otters=new Map(),otterPool=[];
 function makeOtter(id){
  if(otterPool.length){const reused=otterPool.pop();reused.hit.userData.id=id;otters.set(id,reused);return reused.group;}
  const g=new T.Group();root.add(g);
  const body=merged([ellipsoid(0,0,-.15,.48,.4,1.05),ellipsoid(0,.08,.65,.38,.38,.53)]);
  mesh(body,palette.body,g);
  g.rotation.order='YXZ';
  const paws=[],flippers=[];
  for(const side of [-1,1]){
   const paw=new T.Group();paw.position.set(side*.39,-.08,.63);g.add(paw);
   mesh(sphere,palette.body,paw,[0,-.16,.14],[.16,.17,.36]);
   mesh(sphere,palette.head,paw,[0,-.25,.4],[.17,.12,.18]);paws.push(paw);
   const flipper=new T.Group();flipper.position.set(side*.3,-.06,-.88);g.add(flipper);
   mesh(sphere,palette.body,flipper,[side*.06,0,-.28],[.26,.11,.43]);flippers.push(flipper);
  }
  const head=new T.Group();head.position.set(0,.14,1.02);g.add(head);
  mesh(merged([ellipsoid(0,0,0,.43,.38,.4),ellipsoid(-.33,.21,-.07,.13,.14,.095),ellipsoid(.33,.21,-.07,.13,.14,.095)]),palette.head,head);
  mesh(merged([ellipsoid(-.14,-.09,.33,.22,.15,.16),ellipsoid(.14,-.09,.33,.22,.15,.16),ellipsoid(0,-.25,.06,.26,.13,.27)]),palette.cream,head);
  mesh(merged([ellipsoid(-.21,.09,.322,.043,.052,.035),ellipsoid(.21,.09,.322,.043,.052,.035),ellipsoid(0,-.015,.472,.09,.055,.048)]),palette.nose,head,[0,0,0],[1,1,1],false);
  mesh(merged([ellipsoid(-.222,.11,.35,.012,.014,.008),ellipsoid(.198,.11,.35,.012,.014,.008)]),palette.cream,head,[0,0,0],[1,1,1],false);
  const whiskers=[];for(const side of [-1,1])for(let i=0;i<3;i++)whiskers.push(side*.19,-.09,.43,side*(.48+i*.03),-.1+(i-1)*.08,.41);
  const wg=new T.BufferGeometry();wg.setAttribute('position',new T.Float32BufferAttribute(whiskers,3));head.add(new T.LineSegments(wg,new T.LineBasicMaterial({color:0xf6e9c8})));
  const tail=mesh(new T.SphereGeometry(1,12,8),palette.body,g,[0,-.03,-1.4],[.16,.13,.65]);
  const meal=mesh(urchinGeo,palette.urchin,g,[0,-.3,.72],[.72,.72,.72]);
  meal.visible=false;
  const hit=mesh(new T.SphereGeometry(1.4,8,6),new T.MeshBasicMaterial({visible:false}),g,[0,0,0],[1,1,1],false);hit.userData={type:'otter',id};
  otters.set(id,{group:g,tail,head,hit,meal,paws,flippers});return g;
 }
 const fish=[],fishGeo=ellipsoid(0,0,0,.13,.24,.49);
 const tailShape=new T.Shape();tailShape.moveTo(0,0);tailShape.lineTo(.28,-.3);tailShape.lineTo(.28,.3);tailShape.closePath();
 const finGeo=new T.ShapeGeometry(tailShape);finGeo.rotateY(Math.PI/2);
 for(let i=0;i<24;i++){
  const g=new T.Group();root.add(g);mesh(fishGeo,palette.fish,g);
  const f=mesh(finGeo,palette.fin,g,[0,0,-.43],[1,1,1],false);f.material.side=T.DoubleSide;
  mesh(merged([ellipsoid(-.118,.07,.25,.028,.034,.03),ellipsoid(.118,.07,.25,.028,.034,.03)]),palette.nose,g,[0,0,0],[1,1,1],false);
  fish.push({g,tail:f,phase:rand()*6.28,home:i%28});
 }
 // Distant blue silhouettes establish an underwater horizon without hiding agents.
 const back=new T.Group();scene.add(back);
 const distantMat=new T.MeshBasicMaterial({color:0x236f73,transparent:true,opacity:.55,side:T.DoubleSide});
  for(let i=0;i<18;i++){
   const g=kelpGeometry(7+rand()*9,rand()*6,true),m=new T.Mesh(g.blade,distantMat);
   m.position.set((i-8.5)*3.5,-1,-16-rand()*8);back.add(m);
   const stem=new T.Mesh(g.stem,distantMat);stem.position.copy(m.position);back.add(stem);
  }
 const particles=new T.BufferGeometry(),pos=[];
 for(let i=0;i<110;i++)pos.push((rand()-.5)*40,rand()*16,(rand()-.5)*26);
 particles.setAttribute('position',new T.Float32BufferAttribute(pos,3));
 const dust=new T.Points(particles,new T.PointsMaterial({color:0xd6edc1,size:.055,transparent:true,opacity:.4,depthWrite:false}));scene.add(dust);
 const ring=new T.Mesh(new T.TorusGeometry(.68,.035,8,64),new T.MeshBasicMaterial({color:0xffe29a,transparent:true,opacity:.9,depthTest:false}));
 ring.rotation.x=-Math.PI/2;ring.visible=false;root.add(ring);
 const bubbles=new T.Group();root.add(bubbles);
 const bubbleMat=new T.MeshBasicMaterial({color:0xbbe4cb,transparent:true,opacity:.4,wireframe:true});
 for(let i=0;i<15;i++)mesh(new T.SphereGeometry(.04+(i%3)*.02,6,4),bubbleMat,bubbles,[0,0,0],[1,1,1],false);
 let width=0,height=0,lastWorld=null,focus=null,targetFocus=null;
 const orbit={zoom:1,yaw:0,tilt:0};
 const zoomBy=factor=>{targetFocus=null;orbit.zoom=Math.max(.65,Math.min(3.5,orbit.zoom*factor));};
 const rotateBy=(dx,dy)=>{targetFocus=null;orbit.yaw-=dx*.008;orbit.tilt=Math.max(-.4,Math.min(.55,orbit.tilt+dy*.005));};
 const resetView=()=>{targetFocus=null;orbit.zoom=1;orbit.yaw=orbit.tilt=0;};
 function defaultPose(){return width<800?{pos:new T.Vector3(35,37,53),look:new T.Vector3(0,2.6,0)}:{pos:new T.Vector3(21,17.5,32),look:new T.Vector3(-4.2,2.3,0)};}
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();
 function resize(){
  width=host.clientWidth;height=host.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;
  camera.fov=width<800?44:37;camera.updateProjectionMatrix();
  scene.fog.near=width<800?78:45;scene.fog.far=width<800?130:95;
  cameraFrame(true);
 }
 function cameraFrame(reduced){
  const narrow=width<800;
  if(targetFocus?.type==='cover'){
   const pos=narrow?new T.Vector3(12,12,29):new T.Vector3(12,10,24);
   const look=narrow?new T.Vector3(2,5.2,2):new T.Vector3(-3,3.8,1);
   camera.position.copy(pos);focus=look;
  }else if(targetFocus){
   const y=targetFocus.y??1.1;
   const mobile=width<800;
   const grazer=targetFocus.type==='urchin';
   camera.position.lerp(new T.Vector3(targetFocus.x+(grazer?4:mobile?9:6),y+(grazer?3.2:7),targetFocus.z+(grazer?7:mobile?16:11)),reduced?1:.14);
   const look=new T.Vector3(targetFocus.x-(mobile?0:grazer?1.4:2.5),y+.35,targetFocus.z);focus=focus?focus.lerp(look,reduced?1:.14):look;
  }else{
   const {pos,look}=defaultPose();
   // Orbit the reef itself; retain the desktop composition offset at the default view.
   const pivot=new T.Vector3(0,2.6,0),offset=pos.clone().sub(pivot),spherical=new T.Spherical().setFromVector3(offset);
   spherical.radius/=orbit.zoom;spherical.theta+=orbit.yaw;spherical.phi=Math.max(.3,Math.min(1.35,spherical.phi+orbit.tilt));
   pos.copy(pivot).add(new T.Vector3().setFromSpherical(spherical));
   look.lerp(pivot,Math.min(1,Math.max(0,(orbit.zoom-1)/.5)));
   camera.position.lerp(pos,reduced?1:.2);
   focus=focus?focus.lerp(look,reduced?1:.14):look;
  }
  camera.lookAt(focus);camera.updateMatrixWorld();
 }
 function sync(w,t=0,reduced=false){
  const newSnapshot=lastWorld!==w;lastWorld=w;const m=metrics(w);caustic.uniforms.time.value=reduced?0:t;
  for(const v of kelps.values())v.group.visible=!w.meadow;for(const v of grasses.values())v.group.visible=w.meadow;
  back.visible=!w.meadow;
  for(const k of w.kelp){
   if(w.meadow){if(!grasses.has(k.id))makeGrass(k);const g=grasses.get(k.id);g.group.visible=k.b>.005;g.group.scale.setScalar(.25+.75*Math.pow(k.b,.6));g.group.rotation.z=reduced?0:Math.sin(t*.65+k.phase)*.04;g.film.material.opacity=k.a*.85;continue;}
   if(!kelps.has(k.id))makeKelp(k);
   const {group,materials}=kelps.get(k.id);group.position.set(k.x,.1,k.z);
   const growth=Math.max(.025,Math.pow(k.b,.72));group.scale.set(.25+growth*.75,growth, .25+growth*.75);group.visible=k.b>.005;
   // Ghost foreground foliage during inspection without changing its size.
   const ghost=targetFocus&&k.id!==targetFocus.foodId&&Math.hypot(k.x-targetFocus.x,k.z-targetFocus.z)<4.3&&(k.x-targetFocus.x)*.55+(k.z-targetFocus.z)>-2;
   materials.forEach(m=>{m.transparent=!!ghost;m.opacity=ghost?.15:1;m.depthWrite=!ghost;});
   group.rotation.z=reduced?0:Math.sin(t*.65+k.phase)*.035;group.rotation.x=reduced?0:Math.cos(t*.4+k.phase)*.025;
  }
  for(const kind of ['crab','slug','star','mussel']){const v=smallViews[kind],agents=w[kind==='star'?'stars':kind==='mussel'?'mussels':kind==='crab'?'crabs':'slugs'].filter(a=>a.alive);v.body.count=v.outline.count=agents.length;agents.forEach((a,i)=>{dummy.position.set(a.x,.1,a.z);dummy.rotation.set(0,a.phase+(reduced?0:Math.sin(t*.5+a.id)*.1),0);dummy.scale.setScalar(kind==='star'?1.35:kind==='crab'?1.1:1.2);dummy.updateMatrix();v.body.setMatrixAt(i,dummy.matrix);dummy.scale.multiplyScalar(1.05);dummy.updateMatrix();v.outline.setMatrixAt(i,dummy.matrix);});v.body.instanceMatrix.needsUpdate=v.outline.instanceMatrix.needsUpdate=true;}
  let n=0;urchinIds=[];
  for(const u of w.urchins.filter(u=>u.alive)){
   if(n>=140)break;const gait=reduced?0:Math.sin(w.time*5+u.phase);dummy.position.set(u.x,.13+Math.abs(gait)*.012,u.z);dummy.rotation.set(gait*.025,u.phase,gait*.02);dummy.scale.setScalar(.85+u.condition*.2);dummy.updateMatrix();urchins.setMatrixAt(n,dummy.matrix);
   dummy.scale.multiplyScalar(1.035);dummy.updateMatrix();urchinInk.setMatrixAt(n,dummy.matrix);urchinIds.push(u.id);n++;
  }
  urchins.count=urchinInk.count=n;urchins.instanceMatrix.needsUpdate=urchinInk.instanceMatrix.needsUpdate=true;
  feedingLeaf.visible=false;
  if(targetFocus?.type==='urchin'&&targetFocus.foodId!==undefined){
   const u=w.urchins.find(u=>u.alive),k=w.kelp.find(k=>k.id===targetFocus.foodId);
   if(u&&k){const d=Math.hypot(k.x-u.x,k.z-u.z);if(d<1.55&&k.b>.025){const bite=reduced?1:1-(w.time*1.6%1)*.35;feedingLeaf.visible=true;feedingLeaf.position.set((u.x+k.x)/2,.17,(u.z+k.z)/2);feedingLeaf.rotation.y=Math.atan2(k.x-u.x,k.z-u.z);feedingLeaf.scale.set(.16,.035,Math.max(.25,d*.55)*bite);}}
  }
  for(const [id,o]of otters)if(!w.otters.some(q=>q.id===id)){o.group.visible=false;otters.delete(id);otterPool.push(o);}
  for(const o of w.otters){
   if(!otters.has(o.id))makeOtter(o.id);
   const v=otters.get(o.id);v.group.visible=true;v.group.scale.setScalar(targetFocus?.type==='cover'?1.65:1);
   const pose=otterPose(o,w.time,reduced);
   v.group.position.set(o.x,o.y,o.z);
   v.group.rotation.set(pose.pitch,o.heading,pose.roll,'YXZ');
   v.tail.rotation.y=pose.stroke*.28;
   v.tail.rotation.x=pose.stroke*.12;
   v.head.rotation.set(pose.chew,0,0);
   v.paws.forEach((paw,i)=>{
    const side=i===0?-1:1;
    paw.rotation.set(pose.eating?-.45+pose.chew:pose.reach?.65:pose.stroke*.45,pose.eating?-side*.65:0,pose.eating?side*.35:side*.12);
    paw.position.set(side*(pose.eating?.24:.39),pose.eating?-.22:-.08,.63);
   });
   v.flippers.forEach((f,i)=>{f.rotation.x=pose.stroke*.4*(i===0?1:-1);f.rotation.y=(i===0?-1:1)*(.2+pose.stroke*.16);});
   v.meal.visible=pose.eating;
   v.meal.position.set(0,-.48,.94);
   v.meal.scale.setScalar(.72*pose.mealScale);
   v.meal.material=w.meadow?smallViews.crab.body.material:o.mealKind==='mussel'?smallViews.mussel.body.material:palette.urchin;
   v.meal.geometry=w.meadow?smallViews.crab.body.geometry:o.mealKind==='mussel'?smallViews.mussel.body.geometry:urchinGeo;
   if(v.meal.children[0])v.meal.children[0].geometry=v.meal.geometry;
  }
  const shelter=w.kelp.filter(k=>k.b>.28);
  fish.forEach((f,i)=>{
   const k=shelter.length?shelter[i%shelter.length]:null;
   const phase=reduced?f.phase:t*.4+f.phase;
   const x=k?k.x+Math.sin(phase)*1.1:20+i*.35,z=k?k.z+Math.cos(phase)*.7:0;
   const y=k?1.2+(i%4)*.65:3;
   f.g.position.lerp(new T.Vector3(x,y,z),newSnapshot?1:.08);f.g.rotation.y=phase+Math.PI/2;
   f.tail.rotation.y=reduced?0:Math.sin(t*8+f.phase)*.5;f.g.visible=!!k||f.g.position.x<16;
  });
  bubbles.children.forEach((b,i)=>{const o=w.otters[i%Math.max(1,w.otters.length)];b.visible=!!o&&!reduced;if(o)b.position.set(o.x+Math.sin(i)*.25,o.y+((t*.4+i*.3)%2),o.z+.2);});
  dust.rotation.y=reduced?0:Math.sin(t*.03)*.04;
  if(ring.visible)ring.scale.setScalar(1+Math.sin(t*3)*.07);
  cameraFrame(reduced);renderer.render(scene,camera);
 }
 function pick(clientX,clientY){
  const box=host.getBoundingClientRect();pointer.set((clientX-box.left)/box.width*2-1,-(clientY-box.top)/box.height*2+1);raycaster.setFromCamera(pointer,camera);
  const ground=raycaster.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),-.1),new T.Vector3());
  const otterHit=raycaster.intersectObjects([...otters.values()].filter(o=>o.group.visible).map(o=>o.hit),false)[0];
  const hits=raycaster.intersectObjects([...(lastWorld?.meadow?grasses:kelps).values()].filter(k=>k.group.visible).flatMap(k=>k.picks),false);
  let near=null,nearest=width<800?21:15;
  for(const u of [...(lastWorld?.urchins||[]).map(a=>({...a,type:'urchin'})),...(lastWorld?.crabs||[]).map(a=>({...a,type:'crab'})),...(lastWorld?.slugs||[]).map(a=>({...a,type:'slug'})),...(lastWorld?.stars||[]).map(a=>({...a,type:'star'})),...(lastWorld?.mussels||[]).map(a=>({...a,type:'mussel'}))])if(u.alive){const s=project(u.x,.4,u.z),d=Math.hypot(s.x-clientX+box.left,s.y-clientY+box.top);if(d<nearest){nearest=d;near=u;}}
  const object=otterHit?otterHit.object.userData:near?{type:near.type,id:near.id}:hits[0]?.object.userData||null;
  const inside=!!ground&&Math.pow(ground.x/10.4,2)+Math.pow(ground.z/6.2,2)<1.12;
  return {object,inside,ground:ground?{x:Math.max(-9,Math.min(9,ground.x)),z:Math.max(-5,Math.min(5,ground.z))}:null};
 }
 function highlight(x,z){ring.position.set(x,.25,z);ring.visible=true;}
 function project(x,y,z){const p=new T.Vector3(x,y,z).project(camera);return {x:(p.x*.5+.5)*width,y:(-.5*p.y+.5)*height};}
 resize();window.addEventListener('resize',resize);
 return {renderer,scene,camera,resize,sync,pick,highlight,zoomBy,rotateBy,resetView,viewState:()=>({...orbit}),clearHighlight:()=>ring.visible=false,inspect:p=>{targetFocus=p;},project,stats:()=>renderer.info.render,canvas:renderer.domElement};
}
