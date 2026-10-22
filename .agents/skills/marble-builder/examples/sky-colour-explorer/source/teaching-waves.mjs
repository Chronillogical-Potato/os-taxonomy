import {DRAW,surfaceY,sunMarker} from './geometry.mjs';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
// Selected teaching paths, not a Monte Carlo sample or a scattering percentage.
// These are selected examples of paths, rather than scattering percentages.
export function teachingWave(angle,kind,eye){
 const a=angle*Math.PI/180,side=Math.cos(a)>=0?1:-1,alt=Math.min(angle,180-angle),warm=clamp((15-alt)/14,0,1);
 const ux=Math.cos(a)*DRAW.x,uy=Math.sin(a)*DRAW.y,n=Math.hypot(ux,uy),u={x:ux/n,y:uy/n};
 function boundary(p,d,r,exit){
  const x=p.x/DRAW.x,y=(p.y-DRAW.base)/DRAW.y+6371,dx=d.x/DRAW.x,dy=d.y/DRAW.y;
  const A=dx*dx+dy*dy,B=x*dx+y*dy,disc=B*B-A*(x*x+y*y-r*r);
  if(disc<0)return Infinity;const t=(-B+(exit?1:-1)*Math.sqrt(disc))/A;return t>1e-7?t:Infinity;
 }
 const paths=[];
 for(let i=0;i<10;i++){
  const mixed=kind==='mixed',c=mixed?(i%2===0?0:2):(kind==='blue'?0:2),j=mixed?Math.floor(i/2):i,count=mixed?5:10;
  const dayX=-6+12*j/(count-1),lowX=1.3+9*j/(count-1);
  let x=(dayX*(1-warm)+side*lowX*warm)+(mixed?(c===0?-.35:.35):0);
  let y=(surfaceY(x)+1.5+(j%3)*.45)*(1-warm)+(DRAW.base+Math.abs(x)*Math.tan(alt*Math.PI/180)*DRAW.y/DRAW.x+.7+(j%3)*.17)*warm;
  if(mixed)y+=(c===0?-.12:.12)*warm;
  const top=DRAW.base+(Math.sqrt(6451**2-(x/DRAW.x)**2)-6371)*DRAW.y;
  y=clamp(y,surfaceY(x)+.4,top-.25);
  const directIndex=mixed?2:4;
  if(c===2&&j===directIndex){x=eye.x+u.x*2.7;y=eye.y+u.y*2.7;}
  if(mixed&&c===0&&j===2)x-=.2;
  const site={x,y};
  let scattered=c===0, reachesEye=c===2&&j===directIndex;
  if(c===0){
   const candidates=mixed?[0,4]:[1,3,8];
   const number=Math.round(candidates.length*(1-warm));reachesEye=candidates.slice(0,number).includes(j);
  }else if(warm>.35&&j!==(mixed?2:4)&&[mixed?3:3,...(mixed?[]:[7])].includes(j)){
   scattered=true;reachesEye=true;
  }
  const entry=boundary(site,u,6451,true),sun=sunMarker(angle),distance=Math.max(entry+.65,(sun.x-x)*u.x+(sun.y-y)*u.y),source={x:x+u.x*distance,y:y+u.y*distance};
  let end;
  if(reachesEye)end={x:eye.x,y:eye.y};
  else{
   const turn=[35,125,205,70,-35,155,15,-120,90,170][i]*Math.PI/180;
   const d=scattered?{x:Math.cos(turn),y:Math.sin(turn)}:{x:-u.x,y:-u.y};
   const ground=boundary(site,d,6371,false),length=Math.min(ground,scattered?3.6:14);
   end={x:x+d.x*length,y:y+d.y*length};
  }
  paths.push({c,source,site,end,scattered,reachesEye,delay:(mixed?j:i)*.065});
 }
 return paths;
}
// Distances use displayed coordinates so the visible speed is unchanged at a bend.
export function waveTiming(p,xScale,speed){
 const distance=(a,b)=>Math.hypot((b.x-a.x)*xScale,b.y-a.y);
 const incomingTime=distance(p.source,p.site)/speed,outgoingTime=distance(p.site,p.end)/speed;
 return {incomingTime,outgoingTime,arrival:incomingTime+outgoingTime,speed};
}
export function wavePosition(p,t){
 const before=t<p.incomingTime,a=before?p.source:p.site,b=before?p.site:p.end;
 const fraction=clamp(before?t/p.incomingTime:(t-p.incomingTime)/p.outgoingTime,0,1);
 return {x:a.x+(b.x-a.x)*fraction,y:a.y+(b.y-a.y)*fraction};
}
// A teaching cue driven by scattered light reaching the observer. The colour
// rests after arrival and returns to grey before the next wave is emitted.
export function waveColourAmount(elapsed,firstArrival,duration){
 if(!Number.isFinite(firstArrival))return 0;
 const smooth=(a,b,t)=>{const x=clamp((t-a)/(b-a),0,1);return x*x*(3-2*x);};
 return smooth(firstArrival,firstArrival+1.1,elapsed)*(1-smooth(duration-1,duration,elapsed));
}
