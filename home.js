'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const T=(es,en)=>window.TysonI18n?.lang==='en'?en:es;
  function resetHome(){
    if(!['idle','done'].includes(clock.state))$('stop').click();
    window.TysonUnifiedVoice?.stop();
    try{window.speechSynthesis?.cancel()}catch{}
    clock.state='idle';document.body.dataset.state='idle';
    $('phase').textContent=T('EN TU ESQUINA','IN YOUR CORNER');
    $('comboLabel').textContent=T('PREPARA LA GUARDIA','GET YOUR GUARD UP');
    $('sequence').replaceChildren(Object.assign(document.createElement('span'),{className:'ready-word',textContent:T('Manos arriba.','Hands up.')}));
    $('cue').textContent=T('Escucha la combinación y sigue tu ritmo.','Listen to the combination and keep your rhythm.');
    $('counter').textContent='00 COMBOS';$('progress').style.width='0%';
    $('stop').disabled=true;$('config').disabled=false;$('start').disabled=false;
    $('start').dataset.label='';refresh();
    for(const dialog of document.querySelectorAll('dialog'))if(dialog.open)dialog.close();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $('homeMenu').onclick=()=>{
    if(window.TysonRecorder?.active){window.TysonRecorder.finish();return;}
    if(!['idle','done'].includes(clock.state)&&!confirm(T('¿Volver al menú? Terminarás la sesión actual.','Return to home? You will end your current session.')))return;
    resetHome();
  };
  $('recordStageHome').onclick=()=>{
    window.TysonRecorder?.finish();
    // Abre el resultado para guardarlo antes de regresar; no descarta el archivo.
  };
  window.TysonHome={resetHome};
})();
