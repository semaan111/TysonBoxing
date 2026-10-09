'use strict';
/* YouTube IFrame API: volumen configurable 0-35%, música durante todas
   las fases, atenuación cuando suena el entrenador y pausa manual. */
(() => {
  const VID='OXavSAGH8P8';
  const $=id=>document.getElementById(id);
  const T=(es,en)=>window.TysonI18n?.lang==='en'?en:es;
  let player=null,ready=false,playing=false,manuallyPaused=false,speaking=false,volume=18;
  const status=v=>{$('ytStatus').textContent=v;};
  const adjust=()=>{if(ready)try{player.setVolume(speaking?Math.max(3,Math.round(volume*.45)):volume)}catch{}};
  function render(){
    $('ytToggle').textContent=playing?T('Ⅱ Pausar','Ⅱ Pause'):T('▶ Música','▶ Music');
    $('ytToggle').setAttribute('aria-pressed',String(playing));
    if(!ready)status(T('Cargando YouTube…','Loading YouTube…'));
    else if(manuallyPaused)status(T('Música pausada.','Music paused.'));
    else if(playing)status(speaking?T('Volumen bajo: entrenador hablando.','Low volume: coach speaking.'):T('Música durante todo el entrenamiento.','Music through the whole workout.'));
    else status(T('Pulsa Play en YouTube si el navegador lo solicita.','Tap Play on YouTube if needed.'));
  }
  function play(){if(!ready||document.hidden)return;manuallyPaused=false;adjust();try{player.playVideo()}catch{};render();}
  function pause(){manuallyPaused=true;if(ready)try{player.pauseVideo()}catch{};render();}
  $('ytToggle').onclick=()=>playing?pause():play();
  $('ytVolume').oninput=e=>{volume=+e.target.value;adjust();};
  window.onYouTubeIframeAPIReady=()=>{
    if(!window.YT?.Player)return;
    try{player=new YT.Player('youtubePlayer',{
      height:200,width:200,videoId:VID,
      playerVars:{controls:1,playsinline:1,loop:1,playlist:VID,rel:0},
      events:{
        onReady(){ready=true;adjust();render();play();},
        onStateChange(e){playing=e.data===YT.PlayerState.PLAYING;if(playing){manuallyPaused=false;adjust();}render();},
        onError(){status(T('Este video no permite reproducción integrada.','This video cannot be embedded.'));}
      }
    });}catch(e){status(T('Error al cargar YouTube.','YouTube load error.'));}
  };
  window.TysonMusic={
    voiceStart(){speaking=true;adjust();render();},
    voiceEnd(){speaking=false;adjust();render();},
    tryStart(){if(!manuallyPaused)play();}
  };
  // Cada acción directa del usuario puede habilitar la reproducción de audio.
  $('start').addEventListener('click',()=>{if(!manuallyPaused)play();});
  $('recordStart').addEventListener('click',()=>{if(!manuallyPaused)play();});
  document.addEventListener('tyson-language-change',render);
  render();
})();
