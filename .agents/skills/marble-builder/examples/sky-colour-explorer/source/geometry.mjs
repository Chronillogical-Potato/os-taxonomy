export const GEOMETRY={radius:6371,top:80,scaleHeight:8,eyeHeight:.002};
// Affine drawing exaggeration preserves straight lines, but not physical angles.
export const DRAW={x:.014,y:.05,base:.9};
export const project=(x,y)=>({x:x*DRAW.x,y:y*DRAW.y+DRAW.base});
export function surfaceY(x){const p=x/DRAW.x;return DRAW.base+DRAW.y*(Math.sqrt(Math.max(0,GEOMETRY.radius**2-p*p))-GEOMETRY.radius);}
export function sunMarker(angle){
 const a=angle*Math.PI/180,x=Math.cos(a)*DRAW.x,y=Math.sin(a)*DRAW.y;
 // Intersect the displayed light direction with one smooth elliptical rail.
 // Keeping this separate from the atmosphere avoids a kink between two tracks.
 const distance=1/Math.hypot(x/13.8,y/9.2);
 return {x:x*distance,y:DRAW.base+y*distance};
}
// Dots represent parcels of air. Transport uses continuous gas density;
// a collision can happen anywhere, rather than only at the illustrative dots.
export const molecules=[];
for(let x=-1500;x<=1500;x+=40)for(let h of [1,3,6,10,16,25,38,55,75]){
 const y=Math.sqrt((GEOMETRY.radius+h)**2-x*x)-GEOMETRY.radius;
 const p=project(x,y);molecules.push({...p,density:Math.exp(-h/GEOMETRY.scaleHeight)});
}
