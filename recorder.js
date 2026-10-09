'use strict';
/* Cámara + voz pregrabada mezcladas en Web Audio => una pista de audio en el video.
   A diferencia de speechSynthesis, esta pista sí puede grabarse con MediaRecorder.
   El contenido nunca se sube a servidores: solo se conserva como Blob local. */
(() => {
  const $=id=>document.getElementById(id);
  const I=window.TysonI18n;
  const T=(es,en)=>I.lang==='en'?en:es;
  const status=(es,en)=>{$('recordMessage').textContent=T(es,en);};
  const normalise=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/^[¡¿]|[.!?¡¿]+$/g,'').replace(/\s+/g,' ');
  let cameraStream=null, ctx=null, mixer=null, coachOutput=null, voiceBuffer=null, voiceData=null;
  let mediaRecorder=null, combinedStream=null, chunks=[], sources=[], generation=0;
  let active=false, stopping=false, recordingURL=null, lastBlob=null, lastFileName='', micSource=null;
  const apple=/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent);
  const opts=apple?['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp8,opus','video/webm']:['video/webm;codecs=vp8,opus','video/webm','video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4'];

  function supportedType(){return opts.find(x=>MediaRecorder.isTypeSupported(x))||'';}
  function setState(){
    document.body.classList.toggle('is-recording',active);
    $('recBadge').hidden=!active;
    $('recordSetup').setAttribute('aria-label',active?T('Grabando entrenamiento','Recording workout'):T('Grabar entrenamiento','Record workout'));
    $('recordStop').hidden=!active;
    $('recordStart').disabled=active;
    $('language').disabled=active;
  }
  function stopSpeaking(){
    ++generation;
    sources.forEach(s=>{try{s.stop()}catch{}});
    sources=[];
  }
  function say(text,done){
    if(!active||!voiceBuffer||!ctx||!voiceData)return false;
    stopSpeaking();
    const token=generation;
    const parts=text.split(/\.\s*/).map(normalise).filter(Boolean);
    const clips=parts.map(p=>voiceData.phrases[p]);
    if(clips.some(c=>!c)){
      console.warn('Unrecorded coaching phrase:',parts.filter((p,i)=>!clips[i]));
      done();return true;
    }
    let at=ctx.currentTime+0.035;
    clips.forEach(([start,duration],index)=>{
      const source=ctx.createBufferSource();source.buffer=voiceBuffer;
      source.connect(coachOutput);
      const length=Math.max(0.05,duration-0.015);
      source.start(at, start+0.006, length);
      at+=length+0.14;
      sources.push(source);
      if(index===clips.length-1){
        source.onended=()=>{if(token===generation){sources=[];done();}};
      }
    });
    return true;
  }
  function releaseHardware(){
    cameraStream?.getTracks().forEach(t=>t.stop());
    combinedStream?.getTracks().forEach(t=>t.stop());
    cameraStream=null;combinedStream=null;
    micSource?.disconnect();micSource=null;
    coachOutput?.disconnect();coachOutput=null;
    if(ctx){ctx.close().catch(()=>{});ctx=null;}
    voiceBuffer=null;voiceData=null;
    $('cameraPreview').srcObject=null;
  }
  function finish(){
    if(!active||stopping)return;
    stopping=true;
    stopSpeaking();
    if(mediaRecorder?.state!=='inactive'){
      try{mediaRecorder.requestData()}catch{}
      mediaRecorder.stop();
    }
  }
  function showResult(blob,mediaType){
    if(recordingURL)URL.revokeObjectURL(recordingURL);
    lastBlob=blob;recordingURL=URL.createObjectURL(blob);
    const ext=mediaType.includes('mp4')?'mp4':'webm';
    $('recordedVideo').src=recordingURL;
    $('recordedVideo').hidden=false;
    $('downloadRecording').href=recordingURL;
    lastFileName=`TYSON-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.${ext}`;
    $('downloadRecording').download=lastFileName;
    $('downloadRecording').hidden=false;
    $('shareRecording').hidden=!navigator.share;
    $('recordStart').hidden=true;
    $('newRecording').hidden=false;
    $('recordResultTitle').hidden=false;
    status('Video listo. Reprodúcelo y pulsa Guardar video.','Video ready. Preview it and tap Save video.');
    const dialog=$('recordSheet');if(!dialog.open)dialog.showModal();
    if(!['done','idle','paused'].includes(clock.state))pause(T('Sesión en pausa al abrir la grabación.','Workout paused to review the video.'));
  }
  async function begin(){
    if(active)return;
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder||!window.AudioContext&&!window.webkitAudioContext){
      status('Este navegador no ofrece grabación compatible. Intenta Safari actualizado o Chrome.','Recording is unavailable here. Try current Safari or Chrome.');return;
    }
    if(!['idle','done'].includes(clock.state)){
      status('Finaliza la sesión actual antes de empezar a grabar.','End your current workout before recording.');return;
    }
    if(!$('settings').checkValidity()){
      status('Revisa los tiempos de tu entrenamiento antes de grabar.','Check your workout timings first.');return;
    }
    $('recordStart').disabled=true;
    status('Preparando cámara y voz grabable…','Preparing camera and recordable coach audio…');
    try{
      // Resume while still inside the explicit user click; required on many mobile browsers.
      const AudioCtor=window.AudioContext||window.webkitAudioContext;
      ctx=new AudioCtor();const unlocked=ctx.resume();
      mixer=ctx.createMediaStreamDestination();
      coachOutput=ctx.createGain();coachOutput.gain.value=0.95;
      coachOutput.connect(ctx.destination);coachOutput.connect(mixer);
      const bankId=I.lang+'-'+$('stance').value;
      voiceData=window.TysonVoiceBank[bankId];
      const response=await fetch(voiceData.url);
      if(!response.ok)throw new Error('Audio files not found');
      voiceBuffer=await ctx.decodeAudioData(await response.arrayBuffer());
      await unlocked;
      cameraStream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:{ideal:$('cameraDirection').value},width:{ideal:720},height:{ideal:1280},frameRate:{ideal:24}},
        audio:$('recordMicrophone').checked?{echoCancellation:true,noiseSuppression:true}:false
      });
      $('cameraPreview').srcObject=cameraStream;
      $('cameraPreview').play().catch(()=>{});
      if(cameraStream.getAudioTracks().length){
        micSource=ctx.createMediaStreamSource(cameraStream);
        const micGain=ctx.createGain();micGain.gain.value=0.75;
        micSource.connect(micGain).connect(mixer);
      }
      combinedStream=new MediaStream([...cameraStream.getVideoTracks(),...mixer.stream.getAudioTracks()]);
      const type=supportedType();
      mediaRecorder=new MediaRecorder(combinedStream,type?{mimeType:type,videoBitsPerSecond:1800000,audioBitsPerSecond:96000}:{});
      chunks=[];stopping=false;
      mediaRecorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data);};
      mediaRecorder.onerror=e=>{
        status('No se pudo completar la grabación. Intenta de nuevo.','Recording failed. Please try again.');
        console.error('MediaRecorder',e);
      };
      mediaRecorder.onstop=()=>{
        active=false;setState();
        releaseHardware();
        if(chunks.length){
          const contentType=mediaRecorder.mimeType||chunks[0].type||'video/webm';
          showResult(new Blob(chunks,{type:contentType}),contentType);
        }else{
          status('No se obtuvo un video. Comprueba los permisos de la cámara.','No video was captured. Check camera permissions.');
        }
        mediaRecorder=null;chunks=[];stopping=false;
      };
      mediaRecorder.start(1000);
      active=true;setState();
      if(!$('voice').checked){$('voice').checked=true;$('voice').dispatchEvent(new Event('change'));}
      // Clicking the app's real start control preserves the existing workout logic.
      $('recordSheet').close();
      $('start').click();
    }catch(e){
      console.error('Camera/recorder error:',e);
      if(!active)releaseHardware();
      status('No se pudo iniciar. Permite la cámara y verifica que estés en HTTPS.','Could not start. Allow camera access and use HTTPS.');
      $('recordStart').disabled=false;
    }
  }
  $('recordStart').addEventListener('click',begin);
  $('recordStop').addEventListener('click',()=>{if(confirm(T('¿Detener el video? El entrenamiento continuará.','Stop the video? Training will continue.')))finish();});
  function clearResult(){
    if(recordingURL)URL.revokeObjectURL(recordingURL);
    recordingURL=null;lastBlob=null;lastFileName='';
    $('recordedVideo').hidden=true;$('recordedVideo').removeAttribute('src');$('recordedVideo').load();
    $('recordStart').hidden=false;$('recordResultTitle').hidden=true;
    $('downloadRecording').hidden=true;$('shareRecording').hidden=true;$('newRecording').hidden=true;
    $('recordStart').disabled=active;
    status('Pulsa Grabar y entrenar. Incluiremos la voz en el video.','Tap Record & train. The coach voice will be included in the video.');
  }
  $('newRecording').onclick=()=>{
    if(!confirm(T('Antes de comenzar otra grabación, guarda el video anterior. ¿Continuar?','Save your previous video before starting another recording. Continue?')))return;
    clearResult();
  };
  $('shareRecording').onclick=async()=>{
    if(!lastBlob||!navigator.share)return;
    const f=new File([lastBlob],lastFileName,{type:lastBlob.type});
    try{if(!navigator.canShare||navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Tyson Boxing Club'});}
    catch(e){if(e.name!=='AbortError')status('No se pudo compartir. Usa Guardar video.','Sharing failed. Use Save video instead.');}
  };
  $('recordSetup').addEventListener('click',()=>{
    if(!recordingURL){
      $('recordStart').disabled=active;
      status(active?'Ya estás grabando. Finaliza la sesión para guardar el video.':'Pulsa Grabar y entrenar. Incluiremos la voz en el video.','Tap Record & train. The video will include the coach voice.');
    }
  });
  window.addEventListener('pagehide',()=>{if(active)finish();});
  window.TysonRecorder={get active(){return active},say,stopSpeaking,finish};
  setState();
})();
