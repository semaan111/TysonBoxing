'use strict';
const names={1:'Principiante',2:'Intermedio',3:'Avanzado'};
function mobileRefresh(){const c=config();const duration=c.work%60===0?c.work/60+' min':c.work+' s';$('sessionSummary').textContent=`${c.rounds} ${c.rounds===1?'round':'rounds'} · ${duration}`;$('sessionDetail').textContent=T(names[c.level])+' · '+$('focus').selectedOptions[0].textContent;$('voiceStatus').textContent=T($('voice').checked?'Voz activada':'Sin voz');$('voiceQuick').setAttribute('aria-pressed',String($('voice').checked));}
const sheets=document.querySelectorAll('.sheet');
function closeSheet(d){if(d.id==='settingsSheet'&&!$('settings').reportValidity())return;d.close();mobileRefresh();}
for(const b of document.querySelectorAll('[data-sheet]'))b.onclick=()=>{if(!['idle','done','paused'].includes(clock.state))pause(T('Sesión en pausa. Vuelve cuando estés listo.'));$(b.dataset.sheet).showModal();};
for(const d of sheets){d.querySelector('[data-close]').onclick=()=>closeSheet(d);d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)closeSheet(d);}});d.addEventListener('close',mobileRefresh);}
$('trainTab').onclick=()=>{for(const d of sheets)if(d.open)d.close();window.scrollTo({top:0,behavior:'smooth'});};
$('voiceQuick').onclick=()=>{if($('voice').disabled)return;$('voice').checked=!$('voice').checked;$('voice').dispatchEvent(new Event('change'));mobileRefresh();};
$('voice').addEventListener('change',mobileRefresh);fields.forEach(k=>$(k).addEventListener('input',mobileRefresh));document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',mobileRefresh));
setInterval(()=>{const phase=clock.state;document.querySelector('.clock-face').style.setProperty('--clock-progress',$('progress').style.width||'0%');$('clockCaption').textContent=T(({idle:'TIEMPO POR ROUND',prepare:'PREPÁRATE',work:'TIEMPO RESTANTE',rest:'RECUPERA',paused:'EN PAUSA',done:'BUEN TRABAJO'})[phase]);const text=T(({idle:'EMPEZAR ENTRENAMIENTO',prepare:'PAUSAR',work:'PAUSAR',rest:'PAUSAR',paused:'CONTINUAR',done:'OTRA SESIÓN'})[phase]);const icon=['work','rest','prepare'].includes(phase)?'Ⅱ':'▶';if($('start').dataset.label!==text){$('start').innerHTML=text+' <span aria-hidden="true">'+icon+'</span>';$('start').dataset.label=text;}$('sessionFootnote').textContent=T(phase==='paused'?'Tu tiempo está a salvo. Continúa cuando quieras.':phase==='done'?'Sesión guardada en Actividad.':'Sin prisa. Técnica antes que fuerza.');},150);
mobileRefresh();

document.addEventListener('tyson-language-change',()=>{$('start').dataset.label='';mobileRefresh();});
