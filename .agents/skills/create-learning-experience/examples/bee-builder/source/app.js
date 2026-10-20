(()=>{
'use strict';
const scene=document.getElementById('scene'), controls=document.getElementById('controls'), instruction=document.getElementById('instruction');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const INK='#47301a',GOLD='#edaa27';
let state,raf,serial=0;
const icons={left:'<path d="M20 12H4m6-6-6 6 6 6"/>',up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',downRight:'<path d="m5 5 14 14M9 19h10V9"/>',rect:'<rect x="2" y="7" width="20" height="10"/>',circle:'<circle cx="12" cy="12" r="8.5"/>',square:'<rect x="4" y="4" width="16" height="16" rx="1"/>',hex:'<path d="M12 2 21 7 21 17 12 22 3 17 3 7Z"/>',triangle:'<path d="M12 3 22 21 2 21Z"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',unwrap:'<path d="M3 18h12a6 6 0 1 0-6-6c0 2 4 2 4-1"/>',check:'<path d="m4 12 5 5L20 6"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1"/>',equal:'<path d="M4 8h16M4 16h16"/>',different:'<path d="M4 8h16M4 16h16M8 21 16 3"/>',again:'<path d="M4 9a8 8 0 1 1 0 7M4 3v6h6"/>',flower:'<path d="M12 11C-1-3 25-3 12 11C26 0 29 25 12 14C24 29-1 29 10 14C-6 22-3 0 12 11ZM12 15v8"/>'};
const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${icons[k]||icons.arrow}</svg>`;
function button(id,label,ico,fn,{primary=false,disabled=false,pressed}={}){const b=document.createElement('button');b.id=id;b.className='control'+(primary?' primary':'');b.innerHTML=icon(ico)+`<span>${label}</span>`;b.disabled=disabled;if(pressed!==undefined)b.setAttribute('aria-pressed',pressed);b.onclick=fn;controls.append(b);return b;}
const say=t=>instruction.textContent=t;
const ptsPath=(p,close=true)=>p.map((v,i)=>`${i?'L':'M'}${v[0].toFixed(3)},${v[1].toFixed(3)}`).join(' ')+(close?'Z':'');
function vertices(shape,area=10000){
 if(shape==='circle'){const r=Math.sqrt(area/Math.PI);return Array.from({length:96},(_,i)=>[r*Math.cos(-Math.PI/2+i*2*Math.PI/96),r*Math.sin(-Math.PI/2+i*2*Math.PI/96)]);}
 if(shape==='square'){const s=Math.sqrt(area)/2;return[[-s,-s],[s,-s],[s,s],[-s,s]];}
 if(shape==='rect'){const w=Math.sqrt(area*4),h=area/w;return[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];}
 const n=shape==='triangle'?3:6,r=Math.sqrt(2*area/(n*Math.sin(2*Math.PI/n))),angle=shape==='triangle'?-Math.PI/2:Math.PI/6;
 return Array.from({length:n},(_,i)=>[r*Math.cos(angle+i*2*Math.PI/n),r*Math.sin(angle+i*2*Math.PI/n)]);
}
function perimeter(shape,area=10000){const p=vertices(shape,area);return p.reduce((s,v,i)=>s+Math.hypot(v[0]-p[(i+1)%p.length][0],v[1]-p[(i+1)%p.length][1]),0);}
const defs=`<defs>
 <linearGradient id="honey" x1="0" y1="0" x2=".65" y2="1"><stop stop-color="#ffd976"/><stop offset=".54" stop-color="#f5bd45"/><stop offset="1" stop-color="#eaaa25"/></linearGradient>
 <radialGradient id="tray"><stop stop-color="#efce83"/><stop offset="1" stop-color="#d1a45a"/></radialGradient>
 <filter id="shadow" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="13" stdDeviation="12" flood-color="#70521d" flood-opacity=".16"/></filter>
 <filter id="smallShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#8f5918" flood-opacity=".18"/></filter>
 <pattern id="paper" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#8c7142" opacity=".15"/></pattern>
 </defs>`;
function bee(x=825,y=440,s=1){return `<g transform="translate(${x} ${y}) scale(${s})" aria-hidden="true">
 <defs>
  <clipPath id="bee-body-clip"><ellipse cx="15" cy="8" rx="40" ry="30"/></clipPath>
  <linearGradient id="bee-gold" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="#ffdc70"/><stop offset="1" stop-color="#efad30"/></linearGradient>
  <linearGradient id="bee-face" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="#ffe8a1"/><stop offset="1" stop-color="#ffd36a"/></linearGradient>
 </defs>
 <ellipse cx="5" cy="68" rx="36" ry="6" fill="#755926" opacity=".10"/>
 <g class="bee-float"><g transform="rotate(-9)">
  <g stroke="#4b382b" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
   <path d="M-2 29q-6 12-14 10M17 34q0 13-9 11M35 28q7 12 0 15" fill="none"/>
   <path d="m51 3 12 5-12 9" fill="#4b382b"/>
   <g class="beewing" data-wing-root="12 -6">
    <path d="M12-6C15-42 38-71 53-57C70-40 45-14 20-2Z" fill="#edf4ef" stroke="#776958" stroke-width="2.4"/>
    <path d="M28-22q13-15 17-26" fill="none" stroke="#d1d8ca" stroke-width="1.7"/>
    ${reduce?'':'<animateTransform attributeName="transform" type="rotate" values="-5 12 -6;5 12 -6;-5 12 -6" dur="1.4s" repeatCount="indefinite"/>'}
   </g>
   <g class="beewing" data-wing-root="12 -6">
    <path d="M6-4C-21-28-26-58-8-64C13-71 30-29 18-3Z" fill="#fffdf5" stroke="#776958" stroke-width="2.4"/>
    <path d="M8-21Q-4-41-6-52" fill="none" stroke="#d1d8ca" stroke-width="1.7"/>
    ${reduce?'':'<animateTransform attributeName="transform" type="rotate" values="4 12 -6;-4 12 -6;4 12 -6" dur="1.1s" repeatCount="indefinite"/>'}
   </g>
   <ellipse cx="15" cy="8" rx="40" ry="30" fill="url(#bee-gold)"/>
   <g clip-path="url(#bee-body-clip)" fill="#4b382b" stroke="none">
    <path d="M-1-29Q13 6 0 43L14 47Q29 6 13-29Z"/>
    <path d="M28-27Q45 7 28 43L41 43Q57 7 41-27Z"/>
    <path d="M-25 21Q15 42 55 17V45H-25Z" fill="#a66925" opacity=".12"/>
   </g>
   <ellipse cx="15" cy="8" rx="40" ry="30" fill="none"/>
   <path d="M-33-29q-9-18-17-18M-16-33q1-18 11-22" fill="none"/>
   <circle cx="-50" cy="-47" r="3.2" fill="#4b382b" stroke="none"/>
   <circle cx="-5" cy="-55" r="3.2" fill="#4b382b" stroke="none"/>
   <path d="M-48-8C-49-26-36-36-21-34C-4-33 4-19 0-3C-3 13-19 21-34 14C-43 10-48 2-48-8Z" fill="url(#bee-face)"/>
   <path d="M-42-22q7-8 15-7" fill="none" stroke="#fff2c6" stroke-width="2.5"/>
   <ellipse cx="-35" cy="-9" rx="3.5" ry="5.3" fill="#35271f" stroke="none"/>
   <ellipse cx="-17" cy="-10" rx="4" ry="5.8" fill="#35271f" stroke="none"/>
   <circle cx="-36" cy="-11" r="1.2" fill="#fffdf5" stroke="none"/>
   <circle cx="-18" cy="-12" r="1.5" fill="#fffdf5" stroke="none"/>
   <ellipse cx="-10" cy="1" rx="5.5" ry="3.2" fill="#ecaa78" stroke="none"/>
   <path d="M-32 3q7 9 14 0" fill="none" stroke-width="2.2"/>
  </g>
 </g></g>`;}

function flower(x,y,s=1,rot=0){return `<g transform="translate(${x} ${y}) scale(${s}) rotate(${rot})" aria-hidden="true"><path d="M0 0q-7 37 0 60m0-20q-28-21-25-5t25 5m0 4q26-20 23-3T0 44" stroke="#657348" stroke-width="3" fill="#a6af76"/>${Array.from({length:6},(_,i)=>`<ellipse cx="0" cy="-14" rx="7" ry="14" fill="#fff9e8" stroke="#c7b98f" stroke-width="1" transform="rotate(${i*60})"/>`).join('')}<circle r="10" fill="#edb63f" stroke="#9c7434" stroke-width="2"/></g>`;}
function background(){return `<ellipse cx="500" cy="340" rx="370" ry="259" fill="url(#paper)" opacity=".7"/><path d="M846 252q50 81 12 149" stroke="#d8c8a5" stroke-width="2" fill="none" stroke-dasharray="3 11"/>${flower(146,512,.8,-19)}${flower(885,133,.56,15)}<g fill="#cdbb95"><circle cx="811" cy="534" r="3"/><circle cx="197" cy="544" r="2"/><circle cx="863" cy="473" r="2"/></g>`;}
function fit(){const narrow=innerWidth<=800,packing=state.stage==='pack'||state.stage==='finish'||(state.stage==='extension'&&state.trianglePhase==='tile');scene.style.setProperty('--scene-span',packing?'.5':'.58');scene.setAttribute('viewBox',narrow?(packing?'170 50 660 570':'120 70 760 570'):'0 0 1000 650');const mascot=scene.querySelector('[data-mascot]');if(mascot){mascot.setAttribute('transform',narrow?`translate(${packing?710:745} ${packing?560:600}) scale(.8)`:mascot.dataset.original);}}
function base(markup){scene.innerHTML=defs+background()+markup;const mascot=scene.querySelector('.bee-float')?.parentElement;if(mascot){mascot.dataset.mascot='';mascot.dataset.original=mascot.getAttribute('transform');}fit();}
function tapTarget(id,label,action,{shapeOnly=false}={}){const el=document.getElementById(id);if(!el)return;el.classList.add('scene-tap');el.setAttribute('role','button');el.setAttribute('tabindex','0');el.setAttribute('aria-label',label);
 if(!shapeOnly){const b=el.getBBox(),pad=14,w=Math.max(100,b.width+2*pad),h=Math.max(100,b.height+2*pad),hit=document.createElementNS('http://www.w3.org/2000/svg','rect');for(const [k,v]of Object.entries({x:b.x+b.width/2-w/2,y:b.y+b.height/2-h/2,width:w,height:h,fill:'transparent','pointer-events':'all'}))hit.setAttribute(k,v);el.prepend(hit);}
 el.onclick=e=>{e.stopPropagation();action();};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action();}};}

function waxTargets(action,label='Unwrap both wax walls'){for(const id of ['left-room','right-room'])tapTarget(id,label,action);}
function droplet(x,y,s=1,colour='#ffe8a4'){return `<path d="M0-7C-2-3-5 0-5 3a5 5 0 0 0 10 0C5 0 2-3 0-7Z" fill="${colour}" transform="translate(${x} ${y}) scale(${s})"/>`;}
function cell(shape,x,y,area,{id='',droplets=false,thin=false,flat=false}={}){const p=vertices(shape,area),r=Math.sqrt(area/Math.PI),d=shape==='circle'?`M${r},0A${r},${r} 0 1 0 ${-r},0A${r},${r} 0 1 0 ${r},0Z`:ptsPath(p);return `<g ${id?`id="${id}"`:''} transform="translate(${x} ${y})">${flat?'':`<path d="${d}" fill="#af7023" transform="translate(0 6)" stroke="${INK}" stroke-width="${thin?2:4}"/>`}<path class="honey" d="${d}" fill="url(#honey)"/><path class="wall" d="${d}" fill="none" stroke="${INK}" stroke-width="${thin?2:4}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffe8a4" stroke-width="3" transform="scale(.91)" opacity=".7"/>${droplets?[-1,0,1].map(i=>droplet(i*22,2,1.15)).join(''):`<ellipse class="glint" cx="${-Math.sqrt(area)*.17}" cy="${-Math.sqrt(area)*.2}" rx="${Math.sqrt(area)*.13}" ry="${Math.sqrt(area)*.035}" fill="#fff1be" transform="rotate(-30)"/>`}</g>`;}
function centers(shape,area){const out=[];
 if(shape==='square'){const side=Math.sqrt(area);for(let r=0;r<4;r++)for(let c=0;c<5;c++){if(r===0&&c===4)continue;out.push([(c-2)*side,(r-1.5)*side]);}}
 else {const r=shape==='circle'?Math.sqrt(area/Math.PI):Math.sqrt(2*area/(3*Math.sqrt(3)));const pitch=shape==='circle'?2*r:Math.sqrt(3)*r;for(let q=-2;q<=2;q++)for(let rr=-2;rr<=2;rr++){if(Math.abs(q+rr)>2)continue;out.push([pitch*(q+rr/2),pitch*Math.sqrt(3)/2*rr]);}}
 return out;
}
function circleGaps(coords,r,x,y){
 const paths=[];
 for(let i=0;i<coords.length;i++)for(let j=i+1;j<coords.length;j++)for(let k=j+1;k<coords.length;k++){
  const t=[coords[i],coords[j],coords[k]];
  if(!t.every((p,n)=>Math.abs(Math.hypot(p[0]-t[(n+1)%3][0],p[1]-t[(n+1)%3][1])-2*r)<1e-6))continue;
  const mid=t.map((p,n)=>[(p[0]+t[(n+1)%3][0])/2+x,(p[1]+t[(n+1)%3][1])/2+y]);
  const cross=(t[1][0]-t[0][0])*(t[2][1]-t[0][1])-(t[1][1]-t[0][1])*(t[2][0]-t[0][0]);
  const sweep=cross>0?0:1;
  paths.push(`<path class="circle-gap" d="M${mid[0]}A${r},${r} 0 0 ${sweep} ${mid[1]}A${r},${r} 0 0 ${sweep} ${mid[2]}A${r},${r} 0 0 ${sweep} ${mid[0]}Z"/>`);
 }
 return `<g fill="#f42324" aria-hidden="true">${paths.join('')}</g>`;
}
function packScene(shape,{gaps=false,success=false,small=false}={}){const area=state.stage==='check1'?7200:small?3800:5600,coords=centers(shape,area),x=500,y=320;
 let content=`<g ${shape==='circle'?'':'filter="url(#shadow)"'}>${coords.map((p,i)=>cell(shape,x+p[0],y+p[1],area,{id:'cell-'+i,thin:true,flat:shape==='circle'})).join('')}</g>`;
 if(gaps&&shape==='circle')content=circleGaps(coords,Math.sqrt(area/Math.PI),x,y)+content;

 if(success)content+=`<circle cx="735" cy="158" r="29" fill="#fff9e7" stroke="#406c31" stroke-width="3"/><path d="m721 157 10 10 18-21" fill="none" stroke="#406c31" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
 return content+bee(808,462,.86);
}

function progress(){document.getElementById('stageTitle').textContent=({pack:'Rooms without gaps',compare:'Same honey, less wax',share:'Sharing a wall',check1:'Build with less wax',check2:'Inside and around',finish:'Your discoveries',extension:'What about triangles?'})[state.stage];let n=state.stage==='pack'?0:['compare','extension','share'].includes(state.stage)?1:state.stage==='finish'?3:2;document.querySelectorAll('.progress i').forEach((e,i)=>e.className=i<n?'done':i===n?'current':'');}
function clear(){cancelAnimationFrame(raf);serial++;controls.replaceChildren();progress();}
function showPack(){clear();const text={circle:'If bees used circles for their honey, there would be a lot of empty space in the hive.',square:'Squares fit! Could another shape use less wax?',hex:'Hexagons have six sides and fit together. Compare their wax.'};say(state.packMessage||text[state.shape]);base(packScene(state.shape,{gaps:state.shape==='circle'}));
 for(const [k,l] of [['circle','Circles'],['square','Squares'],['hex','Hexagons']])button('shape-'+k,l,k,()=>pickShape(k),{pressed:state.shape===k});
 button('compare','Compare wax','arrow',()=>{state.stage='compare';state.unwrapped=false;showCompare();},{primary:true,disabled:!state.seen.has('square')||!state.seen.has('hex')});
}
function pickShape(shape){state.shape=shape;state.seen.add(shape);state.packMessage=null;showPack();}
function comparisonShapes(){if(state.stage==='check2')return state.orientation?['rect','square']:['square','rect'];return state.stage==='extension'?['triangle','hex']:['square','hex'];}
function compareScene(){const [a,b]=comparisonShapes(),area=state.stage==='check2'?12100:10000;
 let out=`<g filter="url(#shadow)">${cell(a,320,250,area,{id:'left-room',droplets:true})}${cell(b,680,250,area,{id:'right-room',droplets:true})}</g>`;
 if(state.stage==='check2'&&!state.revealed){out+=`<path d="M447 250h106m-12-9 12 9-12 9m-82-18-12 9 12 9" fill="none" stroke="#a28b60" stroke-width="2"/>`;}
 if(state.unwrapped||state.revealed){out+=waxPaths(a,b,area);}
 else if(state.stage!=='check2'&&(state.stage!=='extension'||state.trianglePhase!=='predict')){out+=`<g aria-hidden="true"><path d="M339 336q48 60 139 63m-15-9 15 9-17 6M659 336q-48 60-139 63m15-9-15 9 17 6" fill="none" stroke="#ad823f" stroke-width="2.5" stroke-dasharray="4 7"/><circle cx="500" cy="403" r="23" fill="#fff9e8" stroke="#bca370" stroke-width="2"/><path d="M487 410h14a8 8 0 1 0-8-8c0 3 5 3 5 0" stroke="${INK}" stroke-width="2.5" fill="none"/></g>`;}
 return out+bee(824,478,.72);
}
function waxPaths(a,b,area){return [a,b].map((s,i)=>`<g>${cell(s,220,435+i*90,650,{thin:true})}<path id="wax-${i}" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path id="wax-fill-${i}" fill="none" stroke="#f6c45d" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path id="end-${i}" d="" stroke="${INK}" stroke-width="2"/></g>`).join('')+`<path id="reference" d="" stroke="#a98e58" stroke-width="2" stroke-dasharray="4 6"/>`;}
function samples(shape,area,n=96){const p=vertices(shape,area),segments=p.map((v,i)=>Math.hypot(v[0]-p[(i+1)%p.length][0],v[1]-p[(i+1)%p.length][1])),total=segments.reduce((a,b)=>a+b,0);return Array.from({length:n+1},(_,k)=>{let d=k*total/n,j=0;while(j<segments.length-1&&d>segments[j])d-=segments[j++];const t=d/segments[j],v=p[j],u=p[(j+1)%p.length];return[v[0]+(u[0]-v[0])*t,v[1]+(u[1]-v[1])*t];});}
function unfold(animate=true){cancelAnimationFrame(raf);const token=serial,[a,b]=comparisonShapes(),area=state.stage==='check2'?12100:10000,shapes=[a,b],orig=shapes.map(s=>samples(s,area)),longest=Math.max(...shapes.map(s=>perimeter(s,area))),scale=1,start=performance.now();
 const frame=now=>{if(token!==serial)return;const t=!animate||reduce?1:Math.min((now-start)/1150,1),ease=t*t*(3-2*t);
  shapes.forEach((s,i)=>{const len=perimeter(s,area)*scale,cx=i?680:320,cy=250,points=orig[i].map((p,k)=>[(cx+p[0])*(1-ease)+(260+len*k/96)*ease,(cy+p[1])*(1-ease)+(435+i*90)*ease]);const d=ptsPath(points,false);document.getElementById('wax-'+i)?.setAttribute('d',d);document.getElementById('wax-fill-'+i)?.setAttribute('d',d);document.getElementById('end-'+i)?.setAttribute('d',t===1?`M${260+len} ${422+i*90}v26`:'');});
  if(t===1){const lens=shapes.map(s=>perimeter(s,area)*scale);document.getElementById('reference')?.setAttribute('d',`M${260+Math.min(...lens)} 410v147`);state.animating=false;const next=document.getElementById('challenge')||document.getElementById('continue')||document.getElementById('back');if(next)next.disabled=false;for(const id of ['unwrap','triangle-replay']){const b=document.getElementById(id);if(b)b.disabled=false;}}else raf=requestAnimationFrame(frame);
 };raf=requestAnimationFrame(frame);
}
function revealWax(){if(state.animating)return;state.unwrapped=true;state.animating=true;if(state.stage==='extension')showTriangles();else if(state.stage==='check2')showCheck();else showCompare();unfold();}
function showCompare(){clear();say(state.unwrapped?'Same honey. The hexagon needs a shorter wax wall.':'Same honey in each room. Tap a room to unwrap both wax walls.');base(compareScene());waxTargets(revealWax);
 button('unwrap',state.unwrapped?'Replay':'Unwrap walls',state.unwrapped?'again':'unwrap',revealWax,{disabled:state.animating});
 button('challenge','Share a wall','arrow',startShare,{primary:true,disabled:!state.unwrapped||state.animating});
 if(state.unwrapped&&!state.animating)unfold(false);
}
function triangleTiles(){const side=Math.sqrt(4*2800/Math.sqrt(3)),h=side*Math.sqrt(3)/2,tiles=[];
 for(let row=0;row<4;row++)for(let col=0;col<4;col++){const x=500-3*side+col*side+row*side/2,y=320-2*h+row*h,a=[x,y],b=[x+side,y],c=[x+side/2,y+h],d=[x+1.5*side,y+h];for(const p of [[a,b,c],[b,d,c]]){const cx=p.reduce((v,q)=>v+q[0],0)/3,cy=p.reduce((v,q)=>v+q[1],0)/3;tiles.push(`<g data-triangle-room><path class="honey" d="${ptsPath(p)}" fill="url(#honey)"/><path class="wall" d="${ptsPath(p)}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>${droplet(cx,cy,.85,'#ffe8a4')}</g>`);}}
 return `<g id="triangle-pattern" filter="url(#shadow)">${tiles.join('')}</g>`+bee(808,462,.86);
}
function startTriangles(){state.stage='extension';state.trianglePhase='tile';state.trianglePrediction=null;state.revealed=false;state.unwrapped=false;state.animating=false;showTriangles();}
function askTriangles(){state.trianglePhase='predict';state.trianglePrediction=null;state.revealed=false;state.unwrapped=false;state.animating=false;showTriangles();}
function predictTriangles(shape){if(state.trianglePhase!=='predict')return;state.trianglePrediction=shape;state.trianglePhase='reveal';state.unwrapped=true;state.animating=true;showTriangles();unfold();}
function showTriangles(){clear();if(state.trianglePhase==='tile'){
 say('Triangles fit together without gaps. Tap the pattern to compare their wax.');base(triangleTiles());tapTarget('triangle-pattern','Compare triangles with hexagons',askTriangles,{shapeOnly:true});
 button('triangle-predict','Make a prediction','arrow',askTriangles,{primary:true});button('back','Back to finish','again',()=>{state.stage='finish';showFinish();});return;}
 if(state.trianglePhase==='predict'){
 say('Both fit without gaps. Which needs less wax for the same honey? Tap a room.');base(compareScene());
 tapTarget('left-room','Predict triangles need less wax',()=>predictTriangles('triangle'));tapTarget('right-room','Predict hexagons need less wax',()=>predictTriangles('hex'));
 button('predict-triangle','Triangles','triangle',()=>predictTriangles('triangle'));button('predict-hex','Hexagons','hex',()=>predictTriangles('hex'));return;}
 say(state.trianglePrediction==='hex'?'Hexagons need less wax. Triangles fit, but their walls are longer.':'Triangles fit, but need more wax for the same honey. Look at the strips.');base(compareScene());waxTargets(revealWax,'Replay the triangle and hexagon unwrap');
 button('triangle-replay','Replay','again',revealWax,{disabled:state.animating});button('triangle-pattern-again','See triangles','triangle',()=>{state.trianglePhase='tile';state.unwrapped=false;state.animating=false;showTriangles();});button('back','Back to finish','arrow',()=>{state.stage='finish';showFinish();},{primary:true,disabled:state.animating});
 if(!state.animating)unfold(false);
}

const buildBase=[[0,0],[1,0],[0,1]], buildSpots={left:[-1,0],above:[0,-1],right:[1,1]};
const hexNeighbours=(a,b)=>{const q=a[0]-b[0],r=a[1]-b[1];return Math.max(Math.abs(q),Math.abs(r),Math.abs(q+r))===1;};
const sharedWalls=key=>buildBase.filter(c=>hexNeighbours(c,buildSpots[key])).length;
function sharedEdge(a,b,area){const av=vertices('hex',area).map(p=>[p[0]+a[0],p[1]+a[1]]),bv=vertices('hex',area).map(p=>[p[0]+b[0],p[1]+b[1]]);const match=av.filter(p=>bv.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<.001));return match.length===2?ptsPath(match,false):'';}
function startShare(){state.stage='share';state.shareJoined=false;showShare();}
function showShare(){clear();say(state.shareJoined?'Joined rooms share one wall, so bees need less wax.':'Separate rooms need their own walls. Tap a room to join them.');
 const area=16000,r=Math.sqrt(2*area/(3*Math.sqrt(3))),half=Math.sqrt(3)*r/2,left=state.shareJoined?500-half:345,right=state.shareJoined?500+half:655;
 let drawing=cell('hex',left,285,area,{id:'share-left'})+cell('hex',right,285,area,{id:'share-right'});
 if(state.shareJoined){drawing+=`<path d="M500 ${285-r/2}v${r}" fill="none" stroke="#fff9de" stroke-width="11" stroke-linecap="round"/><path d="M500 ${285-r/2}v${r}" fill="none" stroke="#48743a" stroke-width="6" stroke-linecap="round"/>`;
 if(!reduce)drawing+=`<animateTransform href="#share-left" attributeName="transform" type="translate" from="345 285" to="${left} 285" dur=".65s"/><animateTransform href="#share-right" attributeName="transform" type="translate" from="655 285" to="${right} 285" dur=".65s"/>`;}
 base(drawing+bee(808,462,.86));for(const id of ['share-left','share-right'])tapTarget(id,state.shareJoined?'Separate the rooms':'Join the rooms',()=>{state.shareJoined=!state.shareJoined;showShare();});
 button('join',state.shareJoined?'Separate rooms':'Join rooms',state.shareJoined?'again':'unwrap',()=>{state.shareJoined=!state.shareJoined;showShare();});
 button('build','Build four rooms','arrow',startCheck,{primary:true,disabled:!state.shareJoined});
}
function buildScene(){const area=16000,r=Math.sqrt(2*area/(3*Math.sqrt(3))),pitch=Math.sqrt(3)*r,point=c=>[500+pitch*(c[0]+c[1]/2-.25),320+1.5*r*c[1]];
 let drawing=buildBase.map((c,i)=>{const p=point(c);return cell('hex',...p,area,{id:'built-'+i});}).join('');
 for(const [key,c] of Object.entries(buildSpots)){const p=point(c),chosen=state.choice===key;
 drawing+=`<g id="spot-${key}">`+(chosen?cell('hex',...p,area,{id:'new-room'}):`<path d="${ptsPath(vertices('hex',area))}" transform="translate(${p})" fill="#fff9e9" fill-opacity=".55" stroke="#ac915e" stroke-width="2.5" stroke-dasharray="7 7"/>`);
 if(chosen&&!state.revealed)drawing+=`<path d="${ptsPath(vertices('hex',area))}" transform="translate(${p}) scale(1.09)" class="chosenRing"/>`;drawing+='</g>';
 }
 const highlighted=state.revealed?(state.responses.at(-1).correct?state.choice:'right'):state.hint?state.choice:null;
 if(highlighted){const c=buildSpots[highlighted],p=point(c);for(const b of buildBase)if(hexNeighbours(c,b))drawing+=`<path d="${sharedEdge(p,point(b),area)}" fill="none" stroke="#fff9de" stroke-width="11" stroke-linecap="round"/><path d="${sharedEdge(p,point(b),area)}" fill="none" stroke="#48743a" stroke-width="6" stroke-linecap="round"/>`;}
 return drawing+bee(808,500,.75);
}
function startCheck(){state.round++;state.stage='check1';state.choice=null;state.revealed=false;state.unwrapped=false;state.animating=false;state.assisted=false;state.hint=false;state.responses=[];showCheck();}
function choice(k){if(state.revealed)return;state.choice=k;showCheck();document.getElementById('choose-'+k)?.focus();}
function help(){state.assisted=true;state.hint=true;showCheck();}
function commit(){if(!state.choice||state.revealed)return;const correct=state.stage==='check1'?sharedWalls(state.choice)===2:state.choice==='square';state.responses.push({task:state.stage,choice:state.choice,correct,assisted:state.assisted,...(state.stage==='check1'?{sharedWalls:sharedWalls(state.choice)}:{})});state.revealed=true;state.unwrapped=state.stage==='check2';state.animating=state.unwrapped;showCheck();if(state.animating)unfold();}
function showCheck(){clear();const one=state.stage==='check1',last=state.responses.at(-1);
 if(state.revealed)say(one?(last.correct?'Your new room shares two walls. Same honey space, less wax!':'That spot shares one wall. The right-hand spot shares two.'):(last.correct?'The square holds the same honey with a shorter wall.':'The long room needs more wax. Both hold the same honey.'));
 else if(state.hint)say(one?'Look for walls the new room can share with its neighbours.':'Look inside, then around: those are different things.');
 else say(one?'Add one honey room. Tap a space to share the most walls.':'These rooms hold equal honey. Tap the one that needs less wax.');
 if(one){base(buildScene());if(!state.revealed)for(const key of Object.keys(buildSpots))tapTarget('spot-'+key,'Build a room '+({left:'on the left',above:'above',right:'on the lower right'})[key],()=>{state.choice=key;commit();},{shapeOnly:true});
 }else{base(compareScene());if(!state.revealed){const shapes=comparisonShapes();['left-room','right-room'].forEach((id,i)=>tapTarget(id,'Predict the '+(shapes[i]==='square'?'square':'long room')+' needs less wax',()=>{state.choice=shapes[i];commit();}));}else waxTargets(revealWax,'Replay the equal-honey wall comparison');if(state.hint&&!state.revealed)scene.querySelectorAll('.wall').forEach(p=>{p.setAttribute('stroke-dasharray','7 5');p.setAttribute('stroke-width','5');});}
 if(!state.revealed){
  const options=one?[['left','Place left','left'],['above','Place above','up'],['right','Place right','downRight']]:[['square','Square room','square'],['rect','Long room','rect']];
  for(const [k,l,i]of options)button('choose-'+k,l,i,()=>choice(k),{pressed:state.choice===k});
  button('commit',one?'Build here':'Check prediction','check',commit,{primary:true,disabled:!state.choice});
  button('help','Help','help',help);
 }else{
  button('continue',one?'Compare new rooms':'See how you did','arrow',()=>{if(one){state.stage='check2';state.choice=null;state.revealed=false;state.unwrapped=false;state.hint=false;state.assisted=false;state.orientation=Math.random()<.5;showCheck();}else{state.stage='finish';showFinish();}},{primary:true,disabled:state.animating});
  if(!one)button('replay','Replay','again',revealWax);
 }
 if(state.revealed&&state.unwrapped&&!state.animating)unfold(false);
}
function showFinish(){clear();const correct=state.responses.length===2&&state.responses.every(r=>r.correct&&!r.assisted),success=correct&&state.round===1;say(success?'Today you saved wax by sharing walls and comparing room shapes.':correct?'You used shared walls and compared rooms with practice today.':'Needs more practice: look for shared walls and shorter boundaries.');base(packScene('hex',{success,small:true}));
 button('practice','Explore again','again',()=>{state.stage='pack';state.shape='circle';state.packMessage=null;showPack();});
 button('triangles','Try triangles','triangle',startTriangles,{primary:true});
}
function restart(){state={stage:'pack',shape:'circle',seen:new Set(['circle']),packMessage:null,unwrapped:false,animating:false,responses:[],choice:null,revealed:false,hint:false,assisted:false,round:0};showPack();}
document.getElementById('restart').innerHTML=icon('again');
document.getElementById('restart').onclick=restart;
addEventListener('resize',fit);
window.beeBuilder={snapshot:()=>({...state,seen:[...state.seen],responses:state.responses.map(x=>({...x}))}),perimeter,vertices,sharedWalls};
restart();
})();
