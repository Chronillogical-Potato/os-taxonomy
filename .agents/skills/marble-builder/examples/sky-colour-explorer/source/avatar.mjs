import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Original sky scout. Broad, rounded forms keep the silhouette legible at
// lesson scale; facial details have no outlines so they do not become specks.
export function createExplorer(outlineMaterial,lightPosition){
 const root=new THREE.Group(), head=new THREE.Group();
 const palette={skin:'#dca27e',cheek:'#cf7d67',hair:'#382b38',hairLight:'#514052',
  coat:'#287d7e',coatDark:'#20595f',zip:'#b8d7c5',scarf:'#e5b75c',
  trousers:'#34414d',sole:'#e6d9bd',shoe:'#c66c4e',bag:'#c79445',ink:'#302a32'};
 const mats=new Map();
 function material(key){
  if(!mats.has(key))mats.set(key,new THREE.ShaderMaterial({
   uniforms:{base:{value:new THREE.Color(palette[key]||key)},lightDirection:{value:lightPosition}},
   vertexShader:'varying vec3 n;void main(){n=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:`uniform vec3 base;uniform vec3 lightDirection;varying vec3 n;
   void main(){float d=dot(normalize(n),normalize(lightDirection));
   float shade=d>.35?1.0:d>-.28?.86:.68;gl_FragColor=vec4(base*shade,1.);
   #include <colorspace_fragment>
   }`
  }));
  return mats.get(key);
 }
 function add(geo,key,parent=root,outline=true){
  const m=new THREE.Mesh(geo,material(key));parent.add(m);
  if(outline)m.add(new THREE.Mesh(geo,outlineMaterial));return m;
 }
 const sphere=new THREE.SphereGeometry(1,32,24);
 function oval(p,s,key,parent=root,outline=true){
  const m=add(sphere,key,parent,outline);m.position.set(...p);m.scale.set(...s);return m;
 }
 function rounded(p,s,r,key,parent=root,outline=true){
  const m=add(new RoundedBoxGeometry(...s,4,r),key,parent,outline);m.position.set(...p);return m;
 }
 function stroke(points,r,key,parent=head){
  return add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),20,r,8,false),key,parent,false);
 }
 function limb(from,to,r,key,parent=root){
  const a=new THREE.Vector3(...from),b=new THREE.Vector3(...to),d=b.clone().sub(a);
  const m=add(new THREE.CapsuleGeometry(r,Math.max(.001,d.length()-2*r),6,16),key,parent);
  m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;
 }
 // Weight sits on two substantial boots, rather than thin stick legs.
 for(const side of[-1,1]){
  rounded([side*.19,.38,.005],[.25,.41,.27],.09,'trousers');
  rounded([side*.205,.105,.12],[.34,.17,.45],.075,'sole');
  const boot=rounded([side*.205,.205,.095],[.32,.23,.40],.10,'shoe');boot.rotation.y=side*.10;
  rounded([side*.205,.28,.22],[.21,.055,.10],.02,'sole',root,false);
 }
 // Backpack, curved jacket, hood and scarf form a compact, recognisable outfit.
 rounded([0,.86,-.24],[.66,.70,.28],.15,'bag');
 rounded([.37,.80,-.13],[.12,.30,.20],.045,'coatDark');
 const body=add(new THREE.LatheGeometry([
  new THREE.Vector2(0,.43),new THREE.Vector2(.24,.43),new THREE.Vector2(.32,.49),
  new THREE.Vector2(.35,.69),new THREE.Vector2(.34,.97),new THREE.Vector2(.27,1.13),
  new THREE.Vector2(.16,1.18),new THREE.Vector2(0,1.18)
 ],32),'coat');body.scale.z=.78;
 rounded([0,.50,.025],[.58,.11,.43],.045,'coatDark');
 rounded([0,.83,.275],[.035,.53,.025],.01,'zip',root,false);
 rounded([.19,.72,.262],[.17,.15,.035],.035,'coatDark',root,false);
 oval([.18,.76,.29],[.018,.018,.012],'scarf',root,false);
 const hood=add(new THREE.TorusGeometry(.235,.10,12,32),'coatDark');hood.rotation.x=Math.PI/2;hood.position.set(0,1.15,-.04);
 oval([0,1.21,.04],[.27,.11,.25],'scarf');
 const scarfTail=rounded([-.20,1.02,.30],[.14,.30,.05],.025,'scarf');scarfTail.rotation.z=-.18;
 // Asymmetric relaxed pose: one hand holds a strap, one rests at the side.
 limb([-.30,1.04,0],[-.46,.73,.04],.13,'coat');
 limb([-.46,.73,.04],[-.43,.58,.13],.105,'coat');
 oval([-.43,.55,.14],[.115,.13,.105],'skin');
 oval([-.35,.60,.19],[.055,.075,.055],'skin',root,false);
 limb([.29,1.04,0],[.46,.85,.13],.13,'coat');
 limb([.46,.85,.13],[.30,.97,.28],.105,'coat');
 oval([.29,1.00,.29],[.115,.12,.095],'skin');
 stroke([[.22,1.1,.26],[.27,.93,.29],[.28,.68,.27]],.035,'bag',root);
 // A pear-shaped soft face, ears, sculpted hair cap and a swept fringe.
 root.add(head);head.position.set(0,1.61,.02);head.rotation.set(-.10,-.13,.085);
 oval([0,0,0],[.43,.46,.35],'skin',head);
 oval([-.41,-.035,0],[.095,.13,.085],'skin',head);
 oval([.41,-.035,0],[.095,.13,.085],'skin',head);
 const capGeo=new THREE.SphereGeometry(1,40,24,0,Math.PI*2,0,Math.PI*.57);
 const cap=add(capGeo,'hair',head);cap.scale.set(.46,.47,.375);cap.position.set(0,.055,-.045);
 // Custom bevelled swoop, with an asymmetric wave instead of a bowl haircut.
 const fringe=new THREE.Shape();
 fringe.moveTo(-.43,.14);fringe.bezierCurveTo(-.43,.43,-.12,.53,.18,.43);
 fringe.bezierCurveTo(.40,.37,.47,.20,.40,.04);
 fringe.bezierCurveTo(.32,.07,.25,.21,.20,.25);
 fringe.bezierCurveTo(.08,.13,-.02,.05,-.16,.02);
 fringe.bezierCurveTo(-.13,.10,-.12,.17,-.14,.21);
 fringe.bezierCurveTo(-.23,.10,-.32,.05,-.41,.03);
 fringe.quadraticCurveTo(-.45,.06,-.43,.14);
 const fringeMesh=add(new THREE.ExtrudeGeometry(fringe,{depth:.075,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:3,curveSegments:16,steps:1}),'hair',head);
 fringeMesh.position.z=.265;
 oval([-.39,.05,.01],[.10,.22,.23],'hair',head,false);
 // Widely spaced oval eyes, small catchlights and a quiet smile.
 for(const side of[-1,1]){
  oval([side*.145,-.045,.337],[.036,.054,.018],'ink',head,false);
  oval([side*.145-.009,-.025,.355],[.010,.014,.007],'#fff6e5',head,false);
  oval([side*.25,-.145,.292],[.065,.031,.008],'cheek',head,false);
  stroke([[side*.19,.055,.335],[side*.145,.068,.348],[side*.105,.061,.341]],.013,'hair',head);
 }
 oval([0,-.115,.351],[.043,.039,.043],'skin',head,false);
 stroke([[-.069,-.218,.309],[0,-.237,.322],[.071,-.213,.310]],.013,'ink',head);
 const eyeAnchor=new THREE.Object3D();eyeAnchor.position.set(-.145,-.045,.365);head.add(eyeAnchor);
 return {root,eyeAnchor,head,scarfTail};
}
