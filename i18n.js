'use strict';
/* Tyson Boxing Club: español / English, sin servicios externos de traducción. */
(() => {
  const en = {
    'La cámara se activará al pulsar Grabar y entrenar.':'The camera turns on when you tap Record & train.',
    'Compartir / Guardar en Fotos':'Share / Save to Photos', 'Iniciar otra grabación':'Start another recording',
    'Grabar entrenamiento + voz':'Record workout + voice',
    'Graba tu entrenamiento':'Record your workout',
    'Cerrar':'Close','Tu video incluirá la voz del entrenador y las combinaciones en español o inglés.':'Your video will include coach voice and combinations in Spanish or English.',
    'Cámara':'Camera','Frontal':'Front','Trasera':'Rear','Grabar sonido ambiente':'Include ambient sound',
    'Para evitar eco, el micrófono está desactivado por defecto. La voz del entrenador siempre se incluye en el video. No se graba Spotify.':'To prevent echo, the microphone starts muted. The coach voice is included in the video. Spotify is not recorded.',
    'Durante la grabación usamos una voz provisional incluida en la aplicación. La voz normal del dispositivo se mantiene cuando no grabas.':'Recording uses a bundled temporary coaching voice. Outside recording, the device voice is used as before.',
    'Pulsa Grabar y entrenar. Incluiremos la voz en el video.':'Tap Record & train. The coach voice will be included in the video.',
    '● Grabar y entrenar':'● Record & train', 'Tu grabación':'Your video',
    'Revisa el video y guárdalo antes de cerrar la página.':'Preview and save your video before leaving this page.',
    '↓ Guardar video':'↓ Save video','Video local: no se sube a ningún servidor.':'Local video: nothing is uploaded to a server.',
    '■ Detener video':'■ Stop video',

    'TYSON Boxing Club · Tu esquina':'TYSON Boxing Club · Your corner',
    'ENTRENA A TU RITMO':'TRAIN AT YOUR PACE','ENTRA EN':'STEP INTO','EL RING.':'THE RING.',
    'Tu esquina. Tu ritmo. Tu siguiente round.':'Your corner. Your pace. Your next round.',
    'NIVELES':'LEVELS','A TU RITMO':'AT YOUR PACE',
    'AJUSTAR':'SET UP', 'Intermedio · Completo':'Intermediate · All-round',
    'EN TU ESQUINA':'IN YOUR CORNER','TIEMPO POR ROUND':'ROUND TIME',
    'PREPARA LA GUARDIA':'HANDS UP','Manos arriba.':'Hands up.',
    'Escucha la combinación y sigue tu ritmo.':'Listen to the combination. Find your rhythm.',
    'Voz activada':'Voice on','Sin voz':'Voice off','SIGUIENTE COMBO':'NEXT COMBO',
    'EMPEZAR ENTRENAMIENTO':'START TRAINING','Finalizar sesión':'End session',
    'UNA COMBINACIÓN A LA VEZ.':'ONE COMBINATION AT A TIME.',
    'Entrenar':'Train','Actividad':'Activity','Técnica':'Technique',
    'Tu sesión':'Your session','Listo':'Done','ENTRENAMIENTO':'TRAINING',
    'Nivel':'Level','Principiante':'Beginner','Intermedio':'Intermediate','Avanzado':'Advanced',
    'Enfoque':'Focus','Completo':'All-round','Técnica y precisión':'Technique & precision',
    'Trabajo al cuerpo':'Body shots','Defensa y pasos':'Defense & footwork',
    'Guardia':'Stance','Diestra':'Orthodox','Zurda':'Southpaw',
    'TIEMPOS':'TIMING','Round':'Round','seg':'sec','Descanso':'Rest',
    'Preparación':'Warm-up','Tiempo para ejecutar':'Time to execute',
    'La pausa empieza cuando termina la voz.':'The execution pause starts after each spoken combination.',
    'Suave':'Easy','Clásico 3′':'Classic 3′','10 minutos':'10 minutes',
    'Duración total':'Total duration','TU ENTRENADOR':'YOUR CORNER',
    'Instrucciones por voz':'Spoken instructions','Campana':'Bell',
    'Voz en español':'Voice in English','Buscando voces…':'Loading voices…',
    'Tono':'Pitch','Velocidad':'Speed','Escuchar entrenador':'Test coach voice',
    'La voz depende de tu dispositivo.':'Voice quality depends on your device.',
    'Mantén la pantalla abierta. Al salir, la sesión se pausa.':'Keep this screen open. Training pauses when you leave.',
    'Tu actividad':'Your activity','Cada round cuenta.':'Every round counts.',
    'Borrar historial':'Clear history',
    'Tus sesiones se guardan en este dispositivo. El contador registra combos indicados, no golpes detectados.':'Sessions are saved on this device. The counter tracks announced combinations, not detected punches.',
    'La técnica primero':'Technique first','Aprende. Practica. Repite.':'Learn. Practice. Repeat.',
    'Calienta antes de empezar. Practica sombra o saco con espacio libre. Para trabajo de contacto, busca un entrenador.':'Warm up first. Practice shadowboxing or bag work with enough room. For contact training, work with a qualified coach.',
    'Golpes y movimientos':'Punches & movements',
    '1–6: golpes básicos. C: cuerpo. Las manos adelantada y atrasada cambian según tu guardia.':'1–6: basic punches. C: body. Lead and rear hands depend on your stance.',
    'Tus combinaciones':'Your combinations','Sobre Tyson':'About Tyson',
    '114 secuencias con referencias de':'114 sequences informed by', 'y':'and',
    ', y adaptaciones propias. No existe una lista finita de todas las combinaciones.':', plus original adaptations. There is no finite list of all possible combinations.',
    'App independiente, sin afiliación a Mike Tyson. No utiliza su voz.':'Independent app, not affiliated with Mike Tyson. His voice is not used.',
    'Conectando música':'Connecting music','El ritmo de tu round':'Your round soundtrack',
    'Conectando con Spotify…':'Connecting to Spotify…',
    'La música se intenta reproducir en la bienvenida y durante los descansos. En preparación y durante cada round solo suena la voz del entrenador. Spotify puede pedir que pulses Play una vez, especialmente cuando funciona con el reproductor alternativo.':'Music plays on the welcome screen and during rest periods. During preparation and rounds, only your coach speaks. Spotify may require a tap on Play, especially in fallback mode.',
    'Tu canción o playlist de Spotify':'Your Spotify song or playlist',
    'Usar este enlace':'Use this link','Abrir en Spotify':'Open in Spotify',
    'La reproducción completa depende de Spotify, tu cuenta y tu navegador. Si el inicio automático está bloqueado, activa la música aquí una vez.':'Full playback depends on Spotify, your account and your browser. If autoplay is blocked, press Play here.',
    'Pantalla completa':'Full screen','Configurar sesión':'Configure session','Tu entrenador Tyson':'Your Tyson coach','Caricatura tridimensional de Mike Tyson con guantes rojos':'3D caricature of Mike Tyson with red boxing gloves',
    'Entrenamiento':'Training','Tiempo restante':'Time remaining',
    'Activar o desactivar instrucciones de voz':'Toggle spoken instructions',
    'Navegación principal':'Main navigation','Control de música':'Music controls',
    'Activar música':'Play music','Abrir reproductor y opciones de música':'Open music player and options',
    'Pausar música':'Pause music','Reanudar música':'Resume music',
    'Reproductor oficial de Spotify':'Official Spotify player',
    'El navegador no permite guardar datos. La sesión sí funciona.':'Your browser cannot save data, but training will still work.',
    'Voz no disponible':'Voice unavailable',
    'Este navegador no ofrece síntesis de voz. Usa Chrome, Edge o Safari con voces en español.':'This browser does not support speech synthesis. Try Chrome, Edge, or Safari.',
    'Español automático':'Automatic Spanish','Inglés automático':'Automatic English',
    'Si no escuchas español, instala una voz en español en los ajustes de tu dispositivo.':'If you hear no Spanish voice, install one in your device settings.',
    'Si no escuchas inglés, instala una voz en inglés en los ajustes de tu dispositivo.':'If you hear no English voice, install one in your device settings.',
    'VOZ NO DISPONIBLE · SIGUE LA PANTALLA':'VOICE UNAVAILABLE · FOLLOW THE SCREEN',
    'ESCUCHA Y EJECUTA':'LISTEN & EXECUTE','COMBOS':'COMBOS',
    'A TRABAJAR':'WORK','RECUPERA':'RECOVER','RESPIRA. REINICIA.':'BREATHE. RESET.',
    'Relaja los hombros. Recupera el aire para el próximo round.':'Relax your shoulders. Catch your breath for the next round.',
    'DESCANSO':'REST','EN PAUSA':'PAUSED','CONTINUAR':'RESUME',
    'Tómate un respiro. Continúa cuando estés listo.':'Take a breather. Resume when you are ready.',
    'PAUSAR':'PAUSE','PREPÁRATE':'GET READY','EMPEZAMOS EN UN MOMENTO':'GETTING STARTED',
    'EN TU ESQUINA.':'IN YOUR CORNER.',
    'Pies firmes, mentón abajo y manos arriba.':'Feet planted, chin down, hands up.',
    'SESIÓN COMPLETA':'SESSION COMPLETE','SESIÓN FINALIZADA':'SESSION ENDED',
    'BUEN TRABAJO.':'GREAT WORK.','HASTA EL PRÓXIMO ROUND.':'UNTIL THE NEXT ROUND.',
    'ENTRENAMIENTO GUARDADO':'WORKOUT SAVED','OTRA SESIÓN':'TRAIN AGAIN',
    'ENTRENADOR POR VOZ':'VOICE COACH','MODO VISUAL':'VISUAL MODE',
    'Aún no hay sesiones. La primera empieza hoy.':'No sessions yet. Your first starts today.',
    'COMPLETA':'COMPLETE','PARCIAL':'PARTIAL',
    '¿Borrar las sesiones guardadas en este dispositivo?':'Delete saved sessions on this device?',
    'Pantalla completa no disponible. Puedes usar la app normalmente.':'Full screen is unavailable. You can keep using the app.',
    'Sesión pausada al salir de la pantalla. Pulsa Continuar para retomar.':'Session paused when leaving the screen. Press Resume to continue.',
    'Sesión en pausa. Vuelve cuando estés listo.':'Session paused. Come back when you are ready.',
    'TIEMPO RESTANTE':'TIME LEFT','BUEN TRABAJO':'GOOD WORK',
    'Tu tiempo está a salvo. Continúa cuando quieras.':'Your timer is safe. Resume when ready.',
    'Sesión guardada en Actividad.':'Workout saved in Activity.',
    'Sin prisa. Técnica antes que fuerza.':'No rush. Technique before power.',
    'Solo voz del entrenador':'Coach voice only','Música al inicio y en descansos':'Music at the start and during rests',
    'Escucha al entrenador':'Listen to your coach','La música vuelve al terminar':'Music resumes afterward',
    'Pausada por ti':'Paused by you','Abrir reproductor':'Open player',
    'Spotify requiere usar Play':'Press Play in Spotify',
    'Conectando Spotify':'Connecting to Spotify','Preparando la música':'Preparing music',
    'Spotify · Reproduciendo':'Spotify · Playing','Spotify · Iniciar o reanudar':'Spotify · Start or resume',
    'Pulsa Play en el reproductor de Spotify.':'Press Play in the Spotify player.',
    'Spotify puede bloquear el inicio automático. Pulsa Play en el reproductor de las opciones de música.':'Spotify may block autoplay. Press Play in the player under music options.',
    'Música al inicio y en descansos. Durante el round escucharás únicamente a tu entrenador.':'Music at the start and during rests. During each round, only your coach will be heard.',
    'No se pudo activar el control automático de Spotify.':'Could not enable automatic Spotify control.',
    'La música solo suena al entrar a la aplicación o durante los descansos.':'Music plays only on the welcome screen and during rest periods.',
    'Pega un enlace válido de canción, álbum o playlist de Spotify.':'Paste a valid Spotify song, album or playlist link.',
    'No se pudo cambiar la canción. Ábrela directamente en Spotify.':'Could not change the song. Open it directly in Spotify.',
    'Enlace cargado. Pulsa Play en el reproductor de Spotify cuando estés al inicio o en un descanso.':'Link loaded. Press Play in the Spotify player on the home screen or during a rest.',
    'Spotify no respondió al control automático.':'Spotify did not respond to automatic controls.',
    ' En este modo, pulsa Play dentro de Spotify. Al empezar un round la app detiene el reproductor; al descansar puede ser necesario pulsar Play otra vez.':' In this mode, press Play in Spotify. The app stops the player when a round starts; you may need to press Play again during rests.',
    '6 rounds · 2 min':'6 rounds · 2 min'
  };
  const movesEN={
    '1':['Jab','Straight punch with your lead hand. Return to guard.'],
    '2':['Cross','Straight punch with your rear hand. Rotate your hip and rear foot.'],
    '3':['Lead hook','Hook to the head with your lead hand.'],
    '4':['Rear hook','Hook to the head with your rear hand.'],
    '5':['Lead uppercut','Short upward punch with your lead hand.'],
    '6':['Rear uppercut','Short upward punch with your rear hand.'],
    '1C':['Body jab','Bend your knees and keep the other hand up.'],
    '2C':['Body cross','Bend your knees while staying balanced.'],
    '3C':['Lead body hook','Hook to the body with your lead hand.'],
    '4C':['Rear body hook','Hook to the body with your rear hand.'],
    '5C':['Lead body uppercut','Short uppercut to the body. Keep your guard tight.'],
    '6C':['Rear body uppercut','Short rear uppercut to the body.'],
    'SI':['Slip left','Move your head slightly to your left.'],
    'SD':['Slip right','Move your head slightly to your right.'],
    'R':['Roll under','Bend your knees to roll under an imaginary hook.'],
    'B':['High guard','Protect your head with gloves and forearms.'],
    'P':['Parry the jab','Deflect an imaginary jab with a small movement.'],
    'PA':['Step back','Step back without crossing your feet.'],
    'PI':['Pivot','Pivot on your lead foot, then reset your stance.'],
    'LI':['Step left','Lead with your left foot without crossing your feet.'],
    'LD':['Step right','Lead with your right foot without crossing your feet.'],
    'F':['Jab feint','Fake a jab without losing your stance.']
  };
  let lang='es';
  try{lang=localStorage.getItem('tyson-language')==='en'?'en':'es';}catch{}
  const originals=new WeakMap();
  const dynamicIds=new Set(['phase','round','clockCaption','timer','comboLabel','counter','sequence','cue','voiceStatus','sessionSummary','sessionDetail','sessionFootnote','start','catalogCount','catalog','dictionary','history','total','gapValue','audioNote','musicLabel','musicStatus','spotifyFeedback','voices']);
  function t(s){return lang==='en'?(en[s]??s):s;}
  function move(code){if(lang==='en')return movesEN[code];return window.Tyson?.moves?.[code]||['',''];}
  function staticText(){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let n;
    while((n=walker.nextNode())){
      const parent=n.parentElement;
      if(!parent||parent.closest('script,style')||parent.closest('[id]')&&[...dynamicIds].some(id=>parent.closest('#'+id)))continue;
      if(!originals.has(n)) originals.set(n,n.nodeValue);
      const original=originals.get(n); const match=original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if(match&&Object.prototype.hasOwnProperty.call(en,match[2]))n.nodeValue=match[1]+t(match[2])+match[3];
    }
    // Attribute translations cannot be discovered from text nodes.
    document.querySelectorAll('[aria-label],[title]').forEach(node=>{
      for(const attr of ['aria-label','title']){
        const value=node.getAttribute(attr);if(!value)continue;
        const stored='i18nOriginal'+attr.replace(/[^a-z]/g,'');
        if(!node.dataset[stored])node.dataset[stored]=value;
        const original=node.dataset[stored];if(en[original])node.setAttribute(attr,t(original));
      }
    });
    document.querySelector('.welcome h1').setAttribute('aria-label',lang==='en'?'Step into the ring':'Entra en el ring');
    document.querySelector('meta[name=description]').content=lang==='en'?'Tyson Boxing Club: boxing drills with spoken coaching. Music during rest periods.':'Tyson Boxing Club: tu entrenador de boxeo por voz. Música al inicio y en los descansos.';
    document.title=lang==='en'?'TYSON Boxing Club · Your corner':'TYSON Boxing Club · Tu esquina';
    document.documentElement.lang=lang==='en'?'en':'es';
    const s=document.getElementById('language');if(s)s.value=lang;
  }
  function setLang(value){
    if(value!=='es'&&value!=='en'||value===lang)return;
    lang=value;
    try{localStorage.setItem('tyson-language',lang);}catch{}
    document.dispatchEvent(new CustomEvent('tyson-language-change',{detail:{lang}}));
    staticText();
  }
  window.TysonI18n={t,move,get lang(){return lang;},setLang,staticText};
  document.addEventListener('DOMContentLoaded',()=>{
    staticText();
    document.getElementById('language')?.addEventListener('change',e=>setLang(e.target.value));
  });
})();
