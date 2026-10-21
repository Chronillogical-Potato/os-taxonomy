import {createWorld,metrics} from './model.mjs';
// Goal durations are model units, deliberately unrelated to real calendar time.
export const challenges={
 rescue:{title:'1 · Recover the forest',kind:'thin',hold:12,goal:'Bring kelp back across the reef.',hint:'Urchins need food, and otters need urchins. Try changing who eats whom.',test:m=>m.kelp>=.62},
 community:{title:'2 · Keep a community',kind:'thin',hold:32,goal:'Keep kelp, urchins and otters living together.',hint:'Too many hunters can run out of prey. Try fewer otters, or give the grazers room.',test:m=>m.kelp>=.52&&m.urchins>=12&&m.otters>=1},
 meadow:{title:'3 · Restore the meadow',kind:'meadow',hold:64,goal:'Grow a meadow that feeds slugs, crabs and otters.',hint:'Slugs need algae to eat. Eelgrass shelters them from crabs; otters keep crab numbers in check.',test:m=>m.kelp>=.55&&m.slugs>=12&&m.crabs>=2},
 web:{title:'4 · Share a rocky coast',kind:'web',hold:120,goal:'Keep a kelp forest with both predators and both prey.',hint:'Otters eat urchins and mussels. Sea stars also eat mussels. Changing one prey can change what the otters hunt.'}
};
export function goalRequirements(id,m,w){
 const plants=(name,target)=>({label:`${name} growth: ${target}% or more`,value:Math.floor(m.kelp*100)+'%',met:m.kelp>=target/100});
 const fed=(name,key,target,food,minimum)=>({label:`${target}+ ${name}, with food`,value:m[key]?`${m[key]} · ${m[food]>=minimum?'fed':'hungry'}`:'0',met:m[key]>=target&&m[food]>=minimum});
 const count=(name,key,target)=>({label:`At least ${target} ${name}`,value:String(m[key]),met:m[key]>=target});
 if(id==='rescue')return [plants('Kelp',62)];
 if(id==='community')return [plants('Kelp',52),count('urchins','urchins',12),count('otter','otters',1)];
 if(id==='web')return [plants('Kelp',55),count('urchins','urchins',8),count('mussels','mussels',15),count('sea stars','stars',2),count('otter','otters',1)];
 if(id==='meadow')return [plants('Eelgrass',55),fed('slugs','slugs',12,'slugFood',.3),fed('crabs','crabs',4,'crabFood',10),fed('otter','otters',1,'otterFood',10)];
 return [];
}
// The displayed requirements and the achievement check use the same predicates.
for(const [id,c]of Object.entries(challenges))c.test=(m,w)=>goalRequirements(id,m,w).every(r=>r.met);
export function challengeWorld(id,seed=41){const w=createWorld(challenges[id]?.kind||({'explore-forest':'forest','explore-meadow':'meadow','explore-web':'web'}[id])||'forest',seed);if(id==='community')w.urchins=w.urchins.slice(0,32);return w;}
export function goalState(){return {held:0,achieved:false,firstAt:null};}
export function advanceGoal(id,state,w,dt){const c=challenges[id];if(!c)return;state.held=c.test(metrics(w),w)?Math.min(c.hold,state.held+dt):0;if(state.held>=c.hold&&!state.achieved){state.achieved=true;state.firstAt=w.time;}}
export function editedGoal(state){state.held=0;}
export const questions={
 rescue:[
 {q:'How can an otter help kelp grow?',a:['It eats kelp-grazing urchins','It removes algae from kelp leaves','It shelters kelp from waves'],correct:0,why:'Otters eat urchins, so fewer urchins graze the kelp.'},
 {q:'In a leafy reef with many urchins, removing every otter would usually…',a:['Reduce grazing because hunters are gone','Increase grazing on kelp','Leave kelp unchanged; only otters were removed'],correct:1,why:'With less predation, more urchins can survive and graze.'}
 ],
 community:[
 {q:'Why can adding too many otters make this community lose its otters later?',a:['More kelp leaves less room for otters','Otters make their prey reproduce faster','The otters run short of prey'],correct:2,why:'Otters need enough prey. In this small model, hungry otters leave.'},
 {q:'Which observation best shows a community is persisting?',a:['Kelp, grazers and predators persist over time','Kelp briefly reaches its maximum','All the grazers disappear'],correct:0,why:'A community goal needs several populations to persist, not a single high plant reading.'}
 ],
 meadow:[
 {q:'How do eelgrass and sea slugs help each other here?',a:['Slugs clear algae; eelgrass offers shelter from crabs','Slugs eat eelgrass; eelgrass eats algae','They both remove all the crabs'],correct:0,why:'Slugs clear shading algae from leaves. Denser eelgrass makes it harder for crabs to catch slugs in this model.'},
 {q:'Why might one otter help this meadow, but six fail?',a:['Otters eat the algae when crabs disappear','One can limit crab numbers; too many run out of prey','More otters always means a healthier community'],correct:1,why:'Otters eat crabs, protecting leaf-cleaning slugs. But otters also need crabs to persist.'}
 ],
 web:[
 {q:'Why can adding mussels change how much kelp survives?',a:['Otters may switch from urchins to mussels, leaving more urchins to graze','Mussels eat the kelp directly','Sea stars turn mussels into kelp'],correct:0,why:'Otters have two prey here. More mussels can change their hunting, indirectly changing grazing on kelp.'},
 {q:'Why can too many sea stars make this community harder to keep?',a:['Sea stars eat all the kelp','They create more mussels than the coast can hold','They compete with otters for mussels and can run short of food'],correct:2,why:'Both predators need food. Sharing a prey species connects their fortunes; adding more predators can deplete it.'}
 ]
};
