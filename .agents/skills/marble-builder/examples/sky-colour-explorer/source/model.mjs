import {GEOMETRY} from './geometry.mjs';
export const RADIUS=GEOMETRY.radius, AIR_RADIUS=GEOMETRY.radius+GEOMETRY.top;
export const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
// Distance from the surface observer to a spherical atmosphere's outer edge.
// Kilometres in the physical model; display exaggeration is separate.
export function airPath(degrees){
 const a=degrees*Math.PI/180, s=Math.sin(a);
 return -RADIUS*s+Math.sqrt(RADIUS*RADIUS*s*s+AIR_RADIUS*AIR_RADIUS-RADIUS*RADIUS);
}
export function tasks(round=0){
 const mirrored=round%2===1;
 return [
  {kind:'scatter',angle:mirrored?113:64,answer:'blue',title:'Follow the light',prompt:'Which colour does air scatter more?',feedback:'Air sends more blue light off in new directions.'},
  {kind:'path',angle:mirrored?179:1,answer:'low',title:'A longer journey',prompt:'Which Sun gives light a longer journey through air?',feedback:'The low Sun’s light crosses more air.'},
  {kind:'morning',angle:mirrored?1:179,answer:'orange',title:'A brand-new morning',prompt:'The Sun is low at sunrise. What colour could the sky near it be?',feedback:'A low morning Sun also has a long path: orange and red can remain.'}
 ];
}
export function evidence(responses){
 return responses.length===3&&responses.every(r=>r.correct&&!r.assisted);
}
