'use strict';
(() => {
  // Spotify suena en la pantalla inicial, descansos y cierre de la sesión.
  // La preparación y los rounds de trabajo quedan reservados para la voz.
  const DEFAULT_URL='https://open.spotify.com/track/6ndmKwWqMozN2tcZqzCX4K';
  const $=id=>document.getElementById(id);
  const feedback=$('spotifyFeedback');
  const T=window.TysonI18n?.t||((message)=>message);
  let lastFeedback='';
  function feedbackText(message){lastFeedback=message;feedback.textContent=T(message);}
  let source=DEFAULT_URL;
  let controller=null, ready=false, fallback=false, playing=false;
  let wanted=true, manualPause=false, speaking=false;
  let confirmTimer=null, fallbackTimer=null, resumeTimer=null;
  let programmaticPauseUntil=0, fallbackPlayer=null;

  const state=()=>clock.state;
  const sceneAllowsMusic=()=>['idle','rest','done'].includes(state());
  const mayPlay=()=>sceneAllowsMusic()&&!speaking&&!document.hidden;

  function iframeUrl(url){
    const u=new URL(url);
    const match=u.pathname.match(/^\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([A-Za-z0-9]{22})\/?$/);
    return match?'https://open.spotify.com/embed/'+match[1]+'/'+match[2]+'?utm_source=generator':null;
  }

  function fallbackPlayerEnabled(enabled){
    if(!fallbackPlayer)return;
    // Un iframe común de Spotify no permite pause/resume mediante JavaScript.
    // Descargar el iframe evita que la música se siga oyendo durante el round.
    const next=enabled?iframeUrl(source):'about:blank';
    if(fallbackPlayer.getAttribute('src')!==next)fallbackPlayer.src=next;
  }

  function render(){
    let label, status, icon='▶';
    if(!sceneAllowsMusic()){
      label='Solo voz del entrenador';status='Música al inicio y en descansos';icon='♪';
    }else if(speaking){
      label='Escucha al entrenador';status='La música vuelve al terminar';icon='♪';
    }else if(manualPause){
      label='Reanudar música';status='Pausada por ti';
    }else if(fallback){
      label='Abrir reproductor';status='Spotify requiere usar Play';icon='♫';
    }else if(!ready){
      label='Conectando Spotify';status='Preparando la música';icon='♫';
    }else if(playing){
      label='Pausar música';status='Spotify · Reproduciendo';icon='Ⅱ';
    }else{
      label='Activar música';status='Spotify · Iniciar o reanudar';
    }
    $('musicLabel').textContent=T(label);
    $('musicStatus').textContent=T(status);
    $('musicIcon').textContent=icon;
    $('musicToggle').setAttribute('aria-label',T(label));
    $('musicToggle').setAttribute('aria-pressed',String(playing));
  }

  function pause(){
    clearTimeout(confirmTimer);
    programmaticPauseUntil=performance.now()+1100;
    if(ready&&controller){try{controller.pause();}catch{}}
    if(fallback)fallbackPlayerEnabled(false);
    playing=false;
    render();
  }
  function play(){
    if(!mayPlay()||!wanted||manualPause){render();return;}
    if(fallback){
      fallbackPlayerEnabled(true);
      render();
      return; // Play manual: el iframe alternativo no tiene API de control.
    }
    if(!ready||!controller){render();return;}
    if(playing){render();return;}
    try{controller.resume();}
    catch{feedbackText('Pulsa Play en el reproductor de Spotify.');}
    clearTimeout(confirmTimer);
    confirmTimer=setTimeout(()=>{
      if(!playing&&mayPlay()&&wanted&&!manualPause){
        feedbackText('Spotify puede bloquear el inicio automático. Pulsa Play en el reproductor de las opciones de música.');
        render();
      }
    },3500);
    render();
  }
  function sync(){if(mayPlay())play();else pause();}

  // app.js avisa cuándo empieza/termina una intervención hablada.
  window.TysonMusic={
    voiceStart(){clearTimeout(resumeTimer);speaking=true;pause();},
    voiceEnd(){
      clearTimeout(resumeTimer);
      resumeTimer=setTimeout(()=>{speaking=false;sync();},250);
    }
  };

  function useFallback(reason){
    if(ready||fallback)return;
    fallback=true;
    fallbackPlayer=document.createElement('iframe');
    fallbackPlayer.title=T('Reproductor oficial de Spotify');
    fallbackPlayer.width='100%';fallbackPlayer.height='152';
    fallbackPlayer.style.border='0';fallbackPlayer.style.borderRadius='12px';
    fallbackPlayer.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    $('spotifyEmbed').replaceChildren(fallbackPlayer);
    fallbackPlayerEnabled(mayPlay()&&wanted&&!manualPause);
    feedback.textContent=T(reason)+T(' En este modo, pulsa Play dentro de Spotify. Al empezar un round la app detiene el reproductor; al descansar puede ser necesario pulsar Play otra vez.');lastFeedback='';
    render();
  }

  window.onSpotifyIframeApiReady=API=>{
    if(fallback)return;
    try{
      API.createController($('spotifyEmbed'),{url:source,width:'100%',height:152},c=>{
        if(fallback)return;
        controller=c;
        c.addListener('ready',()=>{
          clearTimeout(fallbackTimer);ready=true;
          feedbackText('Música al inicio y en descansos. Durante el round escucharás únicamente a tu entrenador.');
          sync();render();
        });
        c.addListener('playback_update',e=>{
          if(!e.data)return;
          const wasPlaying=playing;
          const active=!e.data.isPaused&&!e.data.isBuffering;
          playing=active;
          if(active){
            clearTimeout(confirmTimer);
            if(!mayPlay()||manualPause){pause();return;}
            wanted=true;
          }else if(wasPlaying&&e.data.isPaused&&performance.now()>programmaticPauseUntil&&mayPlay()){
            // La persona pausó desde Spotify; no reactivar en el siguiente descanso.
            wanted=false;manualPause=true;
          }
          render();
        });
      });
    }catch{useFallback('No se pudo activar el control automático de Spotify.');}
  };

  $('musicToggle').onclick=()=>{
    if(!sceneAllowsMusic()){
      feedbackText('La música solo suena al entrar a la aplicación o durante los descansos.');
      render();return;
    }
    if(fallback||!ready){
      if(fallback&&manualPause){manualPause=false;wanted=true;play();}
      if(!$('musicSheet').open)$('musicSheet').showModal();
      render();return;
    }
    if(playing){manualPause=true;wanted=false;pause();}
    else{manualPause=false;wanted=true;play();}
    render();
  };

  $('loadSpotify').onclick=()=>{
    const value=$('spotifyUrl').value.trim();let canonical;
    try{
      const u=new URL(value);
      if(u.protocol!=='https:'||u.hostname!=='open.spotify.com')throw Error();
      canonical=u.origin+u.pathname;
      if(!iframeUrl(canonical))throw Error();
    }catch{feedbackText('Pega un enlace válido de canción, álbum o playlist de Spotify.');return;}
    source=canonical;$('spotifyExternal').href=source;
    wanted=false;manualPause=true;pause();
    if(ready){
      try{controller.loadEntity(source);}
      catch{feedbackText('No se pudo cambiar la canción. Ábrela directamente en Spotify.');return;}
    }else if(fallback){
      wanted=true;manualPause=false;sync();
    }
    feedbackText('Enlace cargado. Pulsa Play en el reproductor de Spotify cuando estés al inicio o en un descanso.');
    render();
  };

  // La interfaz cambia body.dataset.state al pasar de preparación a trabajo,
  // descanso, pausa o fin. Spotify no se reanuda por cada frase del entrenador.
  const observer=new MutationObserver(sync);
  observer.observe(document.body,{attributes:true,attributeFilter:['data-state']});
  document.addEventListener('visibilitychange',sync);
  fallbackTimer=setTimeout(()=>{if(!ready)useFallback('Spotify no respondió al control automático.');},10000);
  document.addEventListener('tyson-language-change',()=>{render();if(lastFeedback)feedback.textContent=T(lastFeedback);if(fallbackPlayer)fallbackPlayer.title=T('Reproductor oficial de Spotify');});
  render();
})();
