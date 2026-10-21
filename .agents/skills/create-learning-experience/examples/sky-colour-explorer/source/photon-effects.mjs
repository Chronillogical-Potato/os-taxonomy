import * as THREE from 'three';
// The two ribbons are the travelled route itself, including its scattering bend.
// Widths are measured in display space, so phone compression preserves the glow.
export function photonEffects(parent,colour,xScale,pixelsPerUnit){
 const tint=new THREE.Color(colour),width=6/pixelsPerUnit;
 const material=fragmentShader=>new THREE.ShaderMaterial({
  uniforms:{tint:{value:tint},length:{value:1},behind:{value:0}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false
 });
 const ribbonShader=`varying vec2 vUv;uniform vec3 tint;uniform float length;uniform float behind;
 void main(){
  float crossSection=abs(vUv.y*2.-1.);
  float distanceBehind=behind+(1.-vUv.x)*length;
  float energy=exp(-distanceBehind/1.15);
  float taper=smoothstep(0.,.16,vUv.x*length);
  float halo=exp(-crossSection*crossSection*5.5)*(.11+.38*energy);
  float core=exp(-crossSection*crossSection*140.)*(.38+.5*energy);
  gl_FragColor=vec4(mix(tint,vec3(1.),core*.48),(halo+core)*taper);
 }`;
 function ribbon(){
  const geo=new THREE.PlaneGeometry(1,1),m=new THREE.Mesh(geo,material(ribbonShader));
  m.frustumCulled=false;m.userData.ownedMaterial=true;parent.add(m);return m;
 }
 const incoming=ribbon(),outgoing=ribbon();
 const marker=new THREE.Mesh(new THREE.PlaneGeometry(1,1),material(`varying vec2 vUv;uniform vec3 tint;
 void main(){vec2 p=vUv*2.-1.;float r=length(p);float halo=exp(-r*r*4.8)*.65;
 float core=exp(-r*r*95.);float rays=exp(-abs(p.x)*65.)*exp(-abs(p.y)*7.)+exp(-abs(p.y)*65.)*exp(-abs(p.x)*7.);
 gl_FragColor=vec4(mix(tint,vec3(1.),min(1.,core*1.7)),halo+core+rays*.25);}`));
 marker.scale.set(24/pixelsPerUnit/xScale,24/pixelsPerUnit,1);marker.userData.ownedMaterial=true;parent.add(marker);
 function segment(m,a,b,behind){
  const dx=(b.x-a.x)*xScale,dy=b.y-a.y,len=Math.hypot(dx,dy);
  m.visible=len>1e-6;if(!m.visible)return;
  const nx=-dy/len*width/xScale,ny=dx/len*width,attr=m.geometry.attributes.position;
  attr.setXYZ(0,a.x+nx,a.y+ny,a.z);attr.setXYZ(1,b.x+nx,b.y+ny,b.z);
  attr.setXYZ(2,a.x-nx,a.y-ny,a.z);attr.setXYZ(3,b.x-nx,b.y-ny,b.z);attr.needsUpdate=true;
  m.material.uniforms.length.value=len;m.material.uniforms.behind.value=behind;
 }
 return {marker,incoming,outgoing,update(p,point,t){
  marker.position.copy(point);marker.position.z+=.02;marker.visible=t>=0&&t<p.arrival;
  if(t<0){incoming.visible=outgoing.visible=false;return;}
  const after=t>=p.incomingTime;
  const distanceAfter=after?Math.min(t-p.incomingTime,p.outgoingTime)*p.speed:0;
  // After arrival, let the bright tail settle into the retained luminous route.
  const settled=Math.max(0,t-p.arrival)*p.speed;
  segment(incoming,p.source,after?p.site:point,distanceAfter+settled);
  if(after)segment(outgoing,p.site,point,settled);else outgoing.visible=false;
 }};
}
