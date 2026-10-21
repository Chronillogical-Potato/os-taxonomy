// Poses follow simulation time, so pause, replay and speed controls stay coherent.
export function otterPose(o,time,reduced=false){
 const eating=o.cooldown>.2,age=o.catchAt===undefined?Infinity:Math.max(0,time-o.catchAt);
 const returning=eating&&o.y<4.5;
 const diving=!eating&&o.y<4.8&&o.energy<19;
 const reach=diving&&o.y<2;
 const surface=eating?Math.max(0,Math.min(1,(o.y-2.5)/2))*Math.min(1,Math.max(0,(o.cooldown-.2)/.45)):0;
 const stroke=reduced?0:Math.sin(time*6+o.id);
 return {phase:reach?'reach':diving?'dive':returning?'carry':eating?'eat':'swim',
  pitch:diving?.7:returning?.7-1.25*Math.min(1,age/.35):.06,
  roll:!reduced&&o.meals>0&&o.meals%5===0?Math.PI*surface:0,
  stroke,reach,eating,mealScale:eating?Math.min(1,age/.22):0,
  chew:eating&&!returning&&!reduced?Math.sin(time*9)*.09:0};
}
