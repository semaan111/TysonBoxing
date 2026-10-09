(function(root){
'use strict';
const moves={
'1':['Jab','Golpe recto con la mano adelantada. Vuelva a la guardia.','punch'],
'2':['Recto','Golpe recto con la mano atrasada; gire cadera y talón.','punch'],
'3':['Gancho adelantado','Gancho lateral a la cabeza con la mano adelantada.','punch'],
'4':['Gancho atrasado','Gancho lateral a la cabeza con la mano atrasada.','punch'],
'5':['Upper adelantado','Golpe ascendente corto con la mano adelantada.','punch'],
'6':['Upper atrasado','Golpe ascendente corto con la mano atrasada.','punch'],
'1C':['Jab al cuerpo','Baje el nivel con las piernas y mantenga la otra mano arriba.','body'],
'2C':['Recto al cuerpo','Flexione las rodillas sin inclinarse fuera de su base.','body'],
'3C':['Gancho adelantado al cuerpo','Gancho lateral al cuerpo con la mano adelantada.','body'],
'4C':['Gancho atrasado al cuerpo','Gancho lateral al cuerpo con la mano atrasada.','body'],
'5C':['Upper adelantado al cuerpo','Upper corto al cuerpo sin abrir la guardia.','body'],
'6C':['Upper atrasado al cuerpo','Upper corto al cuerpo con la mano atrasada.','body'],
'SI':['Esquiva izquierda','Desplace ligeramente la cabeza a su izquierda.','defense'],
'SD':['Esquiva derecha','Desplace ligeramente la cabeza a su derecha.','defense'],
'R':['Esquiva en U','Pase bajo un gancho imaginario flexionando las piernas.','defense'],
'B':['Bloqueo alto','Proteja la cabeza con guantes y antebrazos.','defense'],
'P':['Parada del jab','Desvíe un jab imaginario con un movimiento pequeño.','defense'],
'PA':['Paso atrás','Salga de distancia sin cruzar los pies.','footwork'],
'PI':['Pivote hacia el lado adelantado','Gire sobre el pie adelantado y recupere su base.','footwork'],
'LI':['Paso lateral izquierdo','Mueva primero el pie izquierdo; no cruce los pies.','footwork'],
'LD':['Paso lateral derecho','Mueva primero el pie derecho; no cruce los pies.','footwork'],
'F':['Finta de jab','Amague el jab sin perder la postura.','feint']};
const bases=[
[1,'1'],[1,'1 1'],[1,'1 2'],[1,'1 1 2'],[1,'1 2 1'],[1,'1 2 3'],[1,'1 2 3 2'],[1,'1 3'],[1,'2 3'],[1,'1 1C'],[1,'1 2C'],[1,'1 2 3C'],[1,'1 3C'],[1,'B 1 2'],[1,'1 2 PA'],[1,'1 PA'],[1,'1 LI'],[1,'1 LD'],
[2,'1 2 5 2'],[2,'1 6 3'],[2,'1 1 6'],[2,'1 1 4'],[2,'2 3 2'],[2,'3 2 3'],[2,'5 2 3'],[2,'6 3 2'],[2,'1 2C 3'],[2,'1 3C 2'],[2,'2 3C 3'],[2,'1 4C 3'],[2,'1 6C 3'],[2,'1 2 5C'],[2,'SI 2 3'],[2,'SD 3 2'],[2,'P 1 2'],[2,'1 2 R 3'],[2,'1 2 PI'],[2,'F 1 2'],
[3,'1 2 3C 3 2'],[3,'1 1 2C 3 2'],[3,'1 6 3 2 3C'],[3,'5C 5 2 3'],[3,'6C 3 2 3C'],[3,'1 2 SI 2 3 PI'],[3,'1 2 R 3 2'],[3,'F 2C 3 2 PI'],[3,'SD 3C 3 2 PA'],[3,'P 2 3C 3 PI'],[3,'1 2 3 2 PA 2'],[3,'1 1C 2 3 PI'],[3,'1 4C 5 2'],[3,'F 1 2 3C R'],[3,'1 2 3 6 3'],[3,'B 6 3 2 PI'],[3,'1 LI 2 3 PA'],[3,'1 LD 1 2 PI']];
const combos=bases.map(([level,s],i)=>({id:'T'+String(i+1).padStart(3,'0'),level,steps:s.split(' '),variant:false}));
// Controlled exits add variety without inventing arbitrary punch chains.
for(const c of [...combos]) if(c.level>=2 && moves[c.steps.at(-1)][2]!=='footwork') for(const exit of ['PA','PI']) combos.push({...c,id:c.id+'-'+exit,steps:[...c.steps,exit],variant:true});
function pool(level,focus='all'){return combos.filter(c=>c.level<=level&&(focus==='all'||focus==='technique'&&!c.steps.some(s=>['defense','footwork','feint'].includes(moves[s][2]))||focus==='body'&&c.steps.some(s=>moves[s][2]==='body')||focus==='defense'&&c.steps.some(s=>['defense','footwork'].includes(moves[s][2]))));}
function choose(level,focus,last,random=Math.random){const p=pool(level,focus).filter(c=>c.id!==last);return p[Math.floor(random()*p.length)]||pool(level,focus)[0];}
class Clock{constructor(){this.state='idle';this.round=0;this.remaining=0;} start(cfg,now){this.cfg=cfg;this.round=1;this.state='prepare';this.end=now+cfg.prepare*1000;this.remaining=cfg.prepare*1000;} pause(now){if(['idle','done','paused'].includes(this.state))return;this.remaining=Math.max(0,this.end-now);this.previous=this.state;this.state='paused';} resume(now){if(this.state!=='paused')return;this.state=this.previous;this.end=now+this.remaining;} tick(now){if(['idle','done','paused'].includes(this.state))return false;let changed=false;while(now>=this.end&&this.state!=='done'){changed=true;if(this.state==='prepare'){this.state='work';this.end+=this.cfg.work*1000;}else if(this.state==='work'){if(this.round>=this.cfg.rounds){this.state='done';this.remaining=0;}else if(this.cfg.rest){this.state='rest';this.end+=this.cfg.rest*1000;}else{this.round++;this.end+=this.cfg.work*1000;}}else{this.round++;this.state='work';this.end+=this.cfg.work*1000;}}if(this.state!=='done')this.remaining=Math.max(0,this.end-now);return changed;}}
const api={moves,combos,pool,choose,Clock};if(typeof module!=='undefined')module.exports=api;else root.Tyson=api;
})(globalThis);
