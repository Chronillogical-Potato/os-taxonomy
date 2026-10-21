// A qualitative, spatial teaching model. Time is a model unit, not a real day.
export const DT=.16, HORIZON=64;
export function random(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
export const copy=x=>JSON.parse(JSON.stringify(x));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function createWorld(kind='forest',seed=27){
 const rand=random(seed),w={kind,seed,time:0,nextId:1000,kelp:[],urchins:[],otters:[],events:[],birthClock:0,recruitCredit:0,meadow:kind==='meadow'||kind==='inlet',crabs:[],slugs:[],stars:[],mussels:[],nutrients:1,departures:0};
 for(let r=0;r<4;r++)for(let c=0;c<7;c++){
  const x=(c-3)*2.5+(rand()-.5)*1.1,z=(r-1.5)*2.65+(rand()-.5)*.9;
  let b=.72+rand()*.28;
  if(kind==='barren')b=c>4?.5+rand()*.2:.025;
  if(kind==='thin'||kind==='web')b=.3+rand()*.3;
  if(w.meadow)b=.28+rand()*.16;
  w.kelp.push({id:r*7+c,x,z,b,height:5.2+rand()*3.4,phase:rand()*6.28,a:w.meadow?.55:0});
 }
 const count=kind==='barren'?84:kind==='thin'?44:56;
 for(let i=0;i<count;i++){const k=w.kelp[i%28];w.urchins.push({id:i,x:k.x+(rand()-.5)*2,z:k.z+(rand()-.5)*2,condition:kind==='barren'?(k.b>.4?.7:.16):.8,phase:rand()*6.28,alive:true});}
 if(kind==='forest')for(const [x,z]of [[-6,3.8],[-1,-.8],[4,2.5],[7,-2.9]])addOtter(w,x,z);
 if(w.meadow){w.urchins=[];for(let i=0;i<12;i++)addSmall(w,'crab',w.kelp[i*2].x,w.kelp[i*2].z);for(let i=0;i<22;i++)addSmall(w,'slug',w.kelp[i].x,w.kelp[i].z);}
 if(kind==='web'){w.urchins=w.urchins.slice(0,42);for(let i=0;i<48;i++){const k=w.kelp[i%28];addSmall(w,'mussel',k.x+(i%3)*.18,k.z);}for(const p of [[-5,3],[0,2],[5,3]])addOtter(w,...p);for(const p of [[-5,3],[0,2]])addSmall(w,'star',...p);}
 return w;
}
export function addOtter(w,x,z){if(w.otters.length>=6)return false;w.otters.push({id:w.nextId++,x,z,y:5.5,heading:.55,cooldown:0,target:null,dive:0,energy:18});return true;}
export function addUrchin(w,x,z){if(w.urchins.filter(u=>u.alive).length>=120)return false;const id=w.nextId++;w.urchins.push({id,x,z,condition:.8,phase:id*2.39996,alive:true});return true;}
export function plant(w,x,z){const k=[...w.kelp].sort((a,b)=>distance(a,{x,z})-distance(b,{x,z}))[0];k.b=Math.min(1,k.b+.48);return k.id;}
export function removeUrchins(w,x,z,n=12){const near=w.urchins.filter(u=>u.alive).sort((a,b)=>distance(a,{x,z})-distance(b,{x,z}));near.slice(0,n).forEach(u=>u.alive=false);return Math.min(n,near.length);}
export function metrics(w){return {stars:w.stars.filter(a=>a.alive).length,mussels:w.mussels.filter(a=>a.alive).length,starFood:w.stars.filter(a=>a.alive).reduce((s,a)=>s+a.energy,0)/Math.max(1,w.stars.filter(a=>a.alive).length),kelp:w.kelp.reduce((s,k)=>s+k.b,0)/28,urchins:w.urchins.filter(u=>u.alive).length,otters:w.otters.length,shelter:w.kelp.filter(k=>k.b>.28).length,crabs:w.crabs.filter(a=>a.alive).length,slugs:w.slugs.filter(a=>a.alive).length,algae:w.kelp.reduce((s,k)=>s+k.a,0)/28,slugFood:w.slugs.filter(a=>a.alive).reduce((s,a)=>s+a.condition,0)/Math.max(1,w.slugs.filter(a=>a.alive).length),crabFood:w.crabs.filter(a=>a.alive).reduce((s,a)=>s+a.energy,0)/Math.max(1,w.crabs.filter(a=>a.alive).length),otterFood:w.otters.reduce((s,a)=>s+a.energy,0)/Math.max(1,w.otters.length)};}
export function step(w,dt=DT){
 w.time+=dt;w.events=[];if(w.meadow){stepMeadow(w,dt);return;}if(w.kind==='web')stepRockyPrey(w,dt);const alive=w.urchins.filter(u=>u.alive);
 // Holdfasts grow locally; nearby mature kelp can supply a little recruitment.
 for(const k of w.kelp){
  let seed=0;if(k.b<.04&&w.kelp.some(q=>q.b>.55&&distance(q,k)<3.5))seed=.003;
  k.b=Math.min(1,k.b+(.14*k.b*(1-k.b)+seed)*dt);
 }
 for(const u of alive){
  const food=[...w.kelp].sort((a,b)=>(distance(a,u)/(a.b+.1))-(distance(b,u)/(b.b+.1)))[0];
  const d=distance(food,u);
  if(d>.55&&food.b>.03){u.x+=(food.x-u.x)/d*.24*dt;u.z+=(food.z-u.z)/d*.24*dt;}
  const local=w.kelp.filter(k=>distance(k,u)<1.55).sort((a,b)=>b.b-a.b)[0];
  const fed=local&&local.b>.025;
  u.condition+=((fed?.85:.12)-u.condition)*.11*dt;
  if(fed){local.b=Math.max(.008,local.b-.032*(.55+.45*u.condition)*dt);if(w.events.length<5)w.events.push({type:'graze',x:u.x,z:u.z});}
 }
 // Individuals reproduce only while feeding well; depleted urchins persist.
 w.recruitCredit+=(alive.filter(u=>u.condition>.55).length*.012*(1-alive.length/120))*dt;
 while(w.recruitCredit>=1&&alive.length<120){w.recruitCredit--;const parents=alive.filter(u=>u.condition>.55);const parent=parents[w.nextId%parents.length];if(!parent)break;const phase=w.nextId*2.39996;addUrchin(w,Math.max(-9,Math.min(9,parent.x+Math.sin(phase)*.6)),Math.max(-5,Math.min(5,parent.z+Math.cos(phase)*.6)));}
 for(const o of w.otters){
  o.energy=(o.energy??18)-dt*.4;
  o.cooldown=Math.max(0,o.cooldown-dt);
  const preyPool=w.kind==='web'?[...alive,...w.mussels.filter(m=>m.alive)]:alive;
  let target=preyPool.find(u=>u.alive&&u.id===o.target);
  // Poor-condition barren urchins offer little food: hunters prefer forest prey.
  if(!target||target.condition<.28){
   target=preyPool.filter(u=>u.alive&&u.condition>.28).sort((a,b)=>(distance(o,a)+1)/(a.condition*a.condition)-(distance(o,b)+1)/(b.condition*b.condition))[0];
   o.target=target?.id??null;
  }
  if(target&&(o.energy<19||o.cooldown>0)){
   const d=distance(o,target);o.heading=Math.atan2(target.x-o.x,target.z-o.z);
   if(d>.45){const speed=Math.min(d,2.15*dt);o.x+=(target.x-o.x)/d*speed;o.z+=(target.z-o.z)/d*speed;}
   o.y+=( (o.cooldown>.65?5.2:1.0)-o.y)*Math.min(1,dt*3);
   if(d<.65&&o.y<1.7&&o.cooldown<=0){target.alive=false;o.mealKind=target.kind||'urchin';if(w.kind==='web'){w.diet=w.diet||{urchin:0,mussel:0};w.diet[o.mealKind]++;}o.catchAt=w.time;o.meals=(o.meals||0)+1;o.energy=Math.min(24,o.energy+2.4);o.cooldown=2.3;o.target=null;w.events.push({type:'hunt',x:o.x,z:o.z});}
  }else {o.y+=(5.2-o.y)*dt;o.heading+=dt*.25;}
 }
 depart(w);
 if(w.urchins.length>240)w.urchins=w.urchins.filter(u=>u.alive);
}
export function run(w,until=HORIZON){while(w.time<until-1e-6)step(w);return w;}

export function addSmall(w,kind,x,z){const list=kind==='star'?w.stars:kind==='mussel'?w.mussels:kind==='crab'?w.crabs:w.slugs,cap=kind==='star'?12:kind==='mussel'?100:kind==='crab'?32:100;if(list.filter(a=>a.alive).length>=cap)return false;list.push({id:w.nextId++,kind,x,z,alive:true,condition:.8,energy:16,cooldown:0,phase:w.nextId*2.39996});return true;}
function depart(w){const count=w.otters.length;w.otters=w.otters.filter(o=>o.energy>0);w.departures+=count-w.otters.length;}
function move(a,b,speed,dt){const d=distance(a,b);if(d>.2){a.x+=(b.x-a.x)/d*Math.min(d,speed*dt);a.z+=(b.z-a.z)/d*Math.min(d,speed*dt);}return d;}
function stepMeadow(w,dt){
 // Nutrient enrichment is an external forcing, not an organism or a moral role.
 w.nutrients=w.kind==='inlet'&&w.time>=28&&w.time<88?2.7:1;
 for(const k of w.kelp){
  k.a=Math.min(1,Math.max(0,k.a+(.075*w.nutrients*(k.a+.035)*(1-k.a)-.012*k.a)*dt));
  k.b=Math.min(1,Math.max(.005,k.b+(.12*k.b*(1-k.b)*(1-k.a)-.09*k.a*k.b+.001)*dt));
 }
 const slugs=w.slugs.filter(a=>a.alive),crabs=w.crabs.filter(a=>a.alive);
 for(const u of slugs){
  const available=w.kelp.filter(k=>k.a>.025&&k.b>.04);const k=[...(available.length?available:w.kelp)].sort((a,b)=>distance(a,u)/(a.a*a.b+.03)-distance(b,u)/(b.a*b.b+.03))[0];
  const d=move(u,k,.48,dt),fed=d<1.6&&k.a>.015&&k.b>.04;
  // Local food is shared: stocking more cleaners cannot create more algae.
  const neighbors=slugs.filter(s=>s.alive&&distance(s,k)<1.6).length;
  const ration=fed?Math.min(1,k.a/(.035*Math.max(1,neighbors))):0;
  if(fed)k.a=Math.max(.005,k.a-.018*ration*dt);
  u.condition+=(ration-u.condition)*.18*dt;u.energy=Math.min(22,u.energy+(.65*ration-.3)*dt);if(u.energy<=0)u.alive=false;
 }
 for(const c of crabs){
  c.cooldown=Math.max(0,c.cooldown-dt);c.energy-=dt*.12;
  const prey=slugs.filter(u=>u.alive).sort((a,b)=>distance(c,a)-distance(c,b))[0];
  // Dense leaves provide refuge, slowing successful captures (illustrative rate).
  if(prey&&move(c,prey,.65,dt)<.55&&c.cooldown===0){prey.alive=false;c.energy=Math.min(24,c.energy+4);const cover=w.kelp.reduce((best,k)=>distance(k,c)<1.6?Math.max(best,k.b):best,0);c.cooldown=12+cover*24;}
  if(c.energy<=0)c.alive=false;
 }
 w.slugCredit=(w.slugCredit||0)+slugs.filter(s=>s.alive).reduce((sum,s)=>sum+s.condition,0)*.07*(1-slugs.length/100)*dt;
 while(w.slugCredit>=1){w.slugCredit--;const parent=slugs.filter(a=>a.alive)[w.nextId%Math.max(1,slugs.filter(a=>a.alive).length)];if(parent)addSmall(w,'slug',parent.x+Math.sin(w.nextId)*.3,parent.z+Math.cos(w.nextId)*.3);}
 // Recruitment saturates with crowding; a moderate predator population can
 // coexist with replenishing prey instead of inevitably exhausting it.
 w.crabCredit=(w.crabCredit||0)+crabs.filter(c=>c.alive&&c.energy>14).length*.025*Math.max(0,1-crabs.length/16)*dt;
 if(w.crabCredit>=1){w.crabCredit--;const parent=crabs.find(c=>c.alive);if(parent)addSmall(w,'crab',parent.x,parent.z);}
 for(const o of w.otters){
  o.energy-=dt*.4;o.cooldown=Math.max(0,o.cooldown-dt);
  const prey=crabs.filter(c=>c.alive).sort((a,b)=>distance(o,a)-distance(o,b))[0];
  if(prey&&(o.energy<19||o.cooldown>0)){o.heading=Math.atan2(prey.x-o.x,prey.z-o.z);const d=move(o,prey,2.15,dt);o.y+=((o.cooldown>1?5.2:1)-o.y)*Math.min(1,dt*3);if(d<.65&&o.y<1.7&&o.cooldown===0){prey.alive=false;o.catchAt=w.time;o.meals=(o.meals||0)+1;o.energy=Math.min(24,o.energy+7);o.cooldown=12;w.events.push({type:'hunt',x:o.x,z:o.z});}}
  else{o.y+=(5.2-o.y)*dt;o.heading+=dt*.25;}
 }
 depart(w);if(w.slugs.length>200)w.slugs=w.slugs.filter(a=>a.alive);if(w.crabs.length>64)w.crabs=w.crabs.filter(a=>a.alive);
}

// Rocky-coast extension: ochre stars and otters share mussels; only otters
// consume urchins here. Mussels filter an implicit plankton supply.
function stepRockyPrey(w,dt){
 const mussels=w.mussels.filter(a=>a.alive);
 w.musselCredit=(w.musselCredit||0)+mussels.length*.025*Math.max(0,1-mussels.length/80)*dt;
 if(w.musselCredit>=1&&mussels.length){w.musselCredit--;const p=mussels[w.nextId%mussels.length];addSmall(w,'mussel',Math.max(-9,Math.min(9,p.x+Math.sin(w.nextId)*.5)),Math.max(-5,Math.min(5,p.z+Math.cos(w.nextId)*.5)));}
 for(const star of w.stars.filter(a=>a.alive)){
  star.energy-=dt*.1;star.cooldown=Math.max(0,star.cooldown-dt);
  const prey=mussels.filter(a=>a.alive).sort((a,b)=>distance(a,star)-distance(b,star))[0];
  if(prey&&star.cooldown===0&&star.energy<20&&move(star,prey,.35,dt)<.6){prey.alive=false;star.energy=Math.min(24,star.energy+3);star.cooldown=12;}
  if(star.energy<=0)star.alive=false;
 }
 if(w.stars.length>24)w.stars=w.stars.filter(a=>a.alive);
 if(w.mussels.length>200)w.mussels=w.mussels.filter(a=>a.alive);
}
