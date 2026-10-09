'use strict';
/* Record full-screen video + canvas overlays + coach audio.
   The user sees a live full-screen "reel" preview while recording.
   The recorded file includes the live camera image, timer, round status,
   combo text and the provisional coach voice. */
(() => {
  const $=id=>document.getElementById(id);
  const I=window.TysonI18n;
  const T=(es,en)=>I.lang==='en'?en:es;
  const normalise=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/^[¡¿]|[.!?¡¿]+$/g,'').replace(/\s+/g,' ');

  let cameraStream=null, canvasStream=null, ctx=null, mixer=null, coachOutput=null, voiceBuffer=null, voiceData=null;
  let mediaRecorder=null, combinedStream=null, chunks=[], sources=[], generation=0;
  let active=false, stopping=false, recordingURL=null, lastBlob=null, lastFileName='', micSource=null, drawRAF=0;
  let facingMode='user';
  const apple=/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent);
  const opts=apple?['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp8,opus','video/webm']:['video/webm;codecs=vp8,opus','video/webm','video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4'];

  const previewVideo=$('cameraPreview');
  const recordStage=$('recordStage');
  const recordCanvas=$('recordCanvas');
  const gfx=recordCanvas.getContext('2d');

  function supportedType(){return opts.find(x=>MediaRecorder.isTypeSupported(x))||'';}
  function status(es,en){$('recordMessage').textContent=T(es,en);}
  function setState(){
    document.body.classList.toggle('is-recording',active);
    $('recBadge').hidden=!active;
    $('recordStop').hidden=true;
    $('recordStart').disabled=active;
    $('language').disabled=active;
    $('recordSetup').disabled=active;
    $('recordStage').hidden=!active;
    if(active)$('recordStageStop').disabled=false;
  }
  // Safari may interrupt an AudioContext when getUserMedia opens the camera.
  // Re-check and re-arm it before every instruction, and offer a manual user-gesture recovery.
  async function ensureAudible(){
    if(!ctx)return false;
    try{
      if(ctx.state!=='running')await ctx.resume();
    }catch(e){console.warn('Unable to resume coach sound', e)}
    updateSoundButton();
    return ctx.state==='running';
  }
  function updateSoundButton(){
    const b=$('recordStageSound');
    const ready=Boolean(ctx&&ctx.state==='running');
    b.classList.toggle('is-ready',ready);
    b.textContent=ready?T('◖)) Voz activa','◖)) Voice on'):T('◖)) Activar voz','◖)) Enable voice');
    b.setAttribute('aria-label',ready?T('Probar voz','Test coach audio'):T('Activar voz del entrenador','Enable coach audio'));
  }
  function stopSpeaking(){
    ++generation;
    sources.forEach(s=>{try{s.stop()}catch{}});
    sources=[];
  }
  function say(text,done){
    if(!active||!voiceBuffer||!ctx||!voiceData){done();return false;}
    stopSpeaking();
    const token=generation;
    const parts=text.split(/\.\s*/).map(normalise).filter(Boolean);
    const clips=parts.map(p=>voiceData.phrases[p]);
    if(clips.some(c=>!c)){
      console.warn('Missing recorded phrase:', parts.filter((p,i)=>!clips[i]));
      done();return true;
    }
    // Resume if iOS suspended audio after granting permission for the camera.
    ensureAudible().then(ok=>{
      if(token!==generation)return;
      if(!ok){
        const b=$('recordStageSound');
        b.classList.remove('is-ready');
        b.textContent=T('◖)) Activar voz','◖)) Enable voice');
        // Do not hang the combo scheduler if the browser still blocks sound.
        done();return;
      }
      try{
        let at=ctx.currentTime+0.06;
        clips.forEach(([start,duration],index)=>{
          const source=ctx.createBufferSource();source.buffer=voiceBuffer;
          source.connect(coachOutput);
          const length=Math.max(0.05,duration-0.015);
          source.start(at,start+0.006,length);
          at+=length+0.14;
          sources.push(source);
          if(index===clips.length-1){
            source.onended=()=>{if(token===generation){sources=[];done();}};
          }
        });
      }catch(e){
        console.error('Coach audio could not play:',e);
        if(token===generation)done();
      }
    });
    return true;
  }
  function releaseHardware(){
    cancelAnimationFrame(drawRAF);drawRAF=0;
    cameraStream?.getTracks().forEach(t=>t.stop());
    canvasStream?.getTracks().forEach(t=>t.stop());
    combinedStream?.getTracks().forEach(t=>t.stop());
    cameraStream=null;canvasStream=null;combinedStream=null;
    micSource?.disconnect();micSource=null;
    coachOutput?.disconnect();coachOutput=null;
    if(ctx){ctx.onstatechange=null;ctx.close().catch(()=>{});ctx=null;}
    voiceBuffer=null;voiceData=null;
    previewVideo.pause();
    previewVideo.srcObject=null;
  }
  function finish(){
    if(!active||stopping)return;
    stopping=true;
    const btn=$('recordStageStop');btn.disabled=true;
    stopSpeaking();
    // The video stops at the moment the user taps; there is no confirmation dialog.
    if(mediaRecorder&&mediaRecorder.state!=='inactive'){
      try{mediaRecorder.requestData()}catch{}
      try{mediaRecorder.stop()}catch(e){console.warn('MediaRecorder.stop:',e)}
    }
    // Hide camera immediately and pause the workout as the video is being finalized.
    active=false;setState();
    if(!['idle','paused','done'].includes(clock.state))pause(T('Video detenido. Revisa tu grabación.','Recording stopped. Review your video.'));
    status('Procesando video…','Finalizing video…');
    if(!$('recordSheet').open)$('recordSheet').showModal();
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
  function clearResult(){
    if(recordingURL)URL.revokeObjectURL(recordingURL);
    recordingURL=null;lastBlob=null;lastFileName='';
    $('recordedVideo').hidden=true;$('recordedVideo').removeAttribute('src');$('recordedVideo').load();
    $('recordStart').hidden=false;$('recordResultTitle').hidden=true;
    $('downloadRecording').hidden=true;$('shareRecording').hidden=true;$('newRecording').hidden=true;
    $('recordStart').disabled=active;
    status('Pulsa Grabar y entrenar. Incluiremos la voz en el video.','Tap Record & train. The coach voice will be included in the video.');
  }
  function resizeCanvas(){
    const dpr=Math.min(2,window.devicePixelRatio||1);
    const w=Math.max(360, window.innerWidth || 720);
    const h=Math.max(640, window.innerHeight || 1280);
    recordCanvas.width=Math.round(w*dpr);
    recordCanvas.height=Math.round(h*dpr);
  }
  function coverRect(vw,vh,cw,ch){
    const scale=Math.max(cw/vw,ch/vh);
    const dw=vw*scale, dh=vh*scale;
    return {x:(cw-dw)/2,y:(ch-dh)/2,w:dw,h:dh};
  }
  function fitFont(text,maxWidth,start,sizeFloor=24,weight='800',family='system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'){
    let s=start;
    while(s>sizeFloor){gfx.font=`${weight} ${s}px ${family}`; if(gfx.measureText(text).width<=maxWidth) return s; s-=2;}
    return sizeFloor;
  }
  function drawWrapped(text,x,y,maxWidth,lineHeight,align='center',font='700 34px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',fill='#fff'){
    gfx.font=font;gfx.textAlign=align;gfx.fillStyle=fill;
    const words=String(text).split(/\s+/);let lines=[];let line='';
    for(const word of words){
      const test=line?line+' '+word:word;
      if(gfx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;} else line=test;
    }
    if(line)lines.push(line);
    lines.forEach((ln,i)=>gfx.fillText(ln,x,y+i*lineHeight));
    return lines.length;
  }
  function roundedRect(x,y,w,h,r,fill){
    gfx.beginPath();gfx.moveTo(x+r,y);gfx.arcTo(x+w,y,x+w,y+h,r);gfx.arcTo(x+w,y+h,x,y+h,r);gfx.arcTo(x,y+h,x,y,r);gfx.arcTo(x,y,x+w,y,r);gfx.closePath();gfx.fillStyle=fill;gfx.fill();
  }
  function currentOverlay(){
    const moveTexts=[...document.querySelectorAll('#sequence .move span')].map(el=>el.textContent.toUpperCase()).filter(Boolean);
    const ready=document.querySelector('#sequence .ready-word')?.textContent?.toUpperCase()||'';
    return {
      phase:$('phase').textContent,
      round:$('round').textContent,
      timer:$('timer').textContent,
      comboLabel:$('comboLabel').textContent,
      combo:moveTexts.length?moveTexts.join(' · '):ready,
      cue:$('cue').textContent,
      state:document.body.dataset.state||'idle'
    };
  }
  function drawFrame(){
    if(!active)return;
    const w=recordCanvas.width,h=recordCanvas.height;
    gfx.clearRect(0,0,w,h);
    gfx.fillStyle='#050505';gfx.fillRect(0,0,w,h);
    if(previewVideo.readyState>=2 && previewVideo.videoWidth && previewVideo.videoHeight){
      const r=coverRect(previewVideo.videoWidth,previewVideo.videoHeight,w,h);
      gfx.save();
      if(facingMode==='user'){
        gfx.translate(w,0);gfx.scale(-1,1);
        gfx.drawImage(previewVideo,w-r.x-r.w,r.y,r.w,r.h);
      }else{
        gfx.drawImage(previewVideo,r.x,r.y,r.w,r.h);
      }
      gfx.restore();
    }
    // Transparent lettering with a small shadow replaces the two opaque overlays.
    gfx.shadowColor='rgba(0,0,0,.75)';
    gfx.shadowBlur=Math.round(w*.014);
    gfx.shadowOffsetY=2;

    const pad=w*0.06;
    const overlay=currentOverlay();
    // Top line
    gfx.textBaseline='middle';
    gfx.textAlign='left';
    gfx.font=`900 ${Math.round(w*0.05)}px Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif`;
    gfx.fillStyle='#ef473c';gfx.fillText('TYSON',pad,pad*1.3);
    gfx.font=`700 ${Math.round(w*0.018)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillStyle='rgba(255,255,255,.92)';gfx.fillText('BOXING CLUB',pad,pad*1.9);
    gfx.textAlign='right';
    gfx.fillStyle='#ffffff';gfx.font=`700 ${Math.round(w*0.022)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillText(overlay.round,w-pad-18,pad*1.3);

    // REC badge
    gfx.textAlign='left';gfx.fillStyle='#ff5146';gfx.font=`900 ${Math.round(w*0.024)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillText('● REC',pad+14,h*0.105);
    gfx.fillStyle='rgba(255,255,255,.94)';gfx.font=`700 ${Math.round(w*0.024)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillText(overlay.phase,pad+86,h*0.105);

    // Timer
    const timerBoxW=w*0.42, timerBoxH=h*0.105, timerBoxX=(w-timerBoxW)/2, timerBoxY=h*0.16;
    gfx.textAlign='center';
    gfx.fillStyle='#ffffff';
    gfx.font=`900 ${Math.round(w*0.135)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillText(overlay.timer,w/2,timerBoxY+timerBoxH*0.58);
    gfx.font=`700 ${Math.round(w*0.022)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillStyle='rgba(255,255,255,.75)';
    gfx.fillText(overlay.state==='rest'?T('DESCANSO','REST'):T('TIEMPO RESTANTE','TIME LEFT'),w/2,timerBoxY+timerBoxH*0.9);

    // Bottom copy
    const labelY=h*0.64;
    gfx.textAlign='center';gfx.fillStyle='rgba(255,255,255,.82)';
    gfx.font=`800 ${Math.round(w*0.024)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillText((overlay.comboLabel||'').toUpperCase(),w/2,labelY);

    const maxWidth=w*0.82;
    const comboText=(overlay.combo||'').replace(/\s*·\s*/g,'  ·  ');
    const comboSize=fitFont(comboText,maxWidth,Math.round(w*0.08),Math.round(w*0.05));
    gfx.fillStyle='#ffffff';
    const lines=drawWrapped(comboText,w/2,labelY+Math.round(h*0.055),maxWidth,comboSize*1.08,'center',`900 ${comboSize}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`,'#ffffff');

    // Cue / footer
    const cueY=labelY+Math.round(h*0.055)+lines*(comboSize*1.08)+Math.round(h*0.03);
    drawWrapped((overlay.cue||'').toUpperCase(),w/2,cueY,w*0.78,Math.round(w*0.032),'center',`700 ${Math.round(w*0.03)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`,'rgba(255,255,255,.82)');
    gfx.font=`700 ${Math.round(w*0.02)}px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    gfx.fillStyle='rgba(255,255,255,.56)';
    gfx.fillText('TYSON BOXING CLUB',w/2,h*0.90);
    drawRAF=requestAnimationFrame(drawFrame);
  }

  async function begin(){
    if(active)return;
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder||!(window.AudioContext||window.webkitAudioContext)){
      status('Este navegador no ofrece grabación compatible. Intenta Safari actualizado o Chrome.','Recording is unavailable here. Try current Safari or Chrome.');return;
    }
    if(!recordCanvas.captureStream){
      status('Tu navegador no permite grabar esta vista en pantalla completa.','Your browser cannot record this full-screen view.');return;
    }
    if(!['idle','done'].includes(clock.state)){
      status('Finaliza la sesión actual antes de empezar a grabar.','End your current workout before recording.');return;
    }
    if(!$('settings').checkValidity()){
      status('Revisa los tiempos de tu entrenamiento antes de grabar.','Check your workout timings first.');return;
    }
    $('recordStart').disabled=true;
    status('Preparando cámara, pantalla completa y voz grabable…','Preparing camera, full-screen view and recordable coach audio…');
    try{
      const AudioCtor=window.AudioContext||window.webkitAudioContext;
      ctx=new AudioCtor();
      ctx.onstatechange=updateSoundButton;
      const unlocked=ctx.resume();
      // Start a silent oscillator while handling a real user tap to unlock mobile audio.
      try{const osc=ctx.createOscillator(),gain=ctx.createGain();gain.gain.value=0;osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.025);}catch{}
      mixer=ctx.createMediaStreamDestination();
      coachOutput=ctx.createGain();coachOutput.gain.value=0.95;
      coachOutput.connect(ctx.destination);coachOutput.connect(mixer);
      const bankId=I.lang+'-'+$('stance').value;
      voiceData=window.TysonVoiceBank[bankId];
      const response=await fetch(voiceData.url);
      if(!response.ok)throw new Error('Audio files not found');
      voiceBuffer=await ctx.decodeAudioData(await response.arrayBuffer());
      await unlocked;
      facingMode=$('cameraDirection').value;
      cameraStream=await navigator.mediaDevices.getUserMedia({
        video:{facingMode:{ideal:facingMode},width:{ideal:720},height:{ideal:1280},frameRate:{ideal:24}},
        audio:$('recordMicrophone').checked?{echoCancellation:true,noiseSuppression:true}:false
      });
      previewVideo.srcObject=cameraStream;
      await previewVideo.play().catch(()=>{});
      // iOS may change the audio session when the camera starts; re-arm monitoring.
      await ensureAudible();
      if(cameraStream.getAudioTracks().length){
        micSource=ctx.createMediaStreamSource(cameraStream);
        const micGain=ctx.createGain();micGain.gain.value=0.72;
        micSource.connect(micGain).connect(mixer);
      }
      resizeCanvas();
      active=true;setState();
      drawFrame();
      canvasStream=recordCanvas.captureStream(24);
      combinedStream=new MediaStream([...canvasStream.getVideoTracks(),...mixer.stream.getAudioTracks()]);
      const type=supportedType();
      mediaRecorder=new MediaRecorder(combinedStream,type?{mimeType:type,videoBitsPerSecond:2500000,audioBitsPerSecond:96000}:{});
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
        }else status('No se obtuvo un video. Comprueba los permisos de la cámara.','No video was captured. Check camera permissions.');
        mediaRecorder=null;chunks=[];stopping=false;
      };
      mediaRecorder.start(1000);
      // Keep the recorded audio graph running even without ambient microphone.
      updateSoundButton();
      if(!$('voice').checked){$('voice').checked=true;$('voice').dispatchEvent(new Event('change'));}
      $('recordSheet').close();
      $('start').click();
    }catch(e){
      console.error('Camera/recorder error:',e);
      active=false;setState();releaseHardware();
      status('No se pudo iniciar. Permite la cámara y verifica que estés en HTTPS.','Could not start. Allow camera access and use HTTPS.');
      $('recordStart').disabled=false;
    }
  }

  $('recordStart').addEventListener('click',begin);
  const askStop=()=>finish();
  $('recordStop').addEventListener('click',askStop);
  $('recordStageStop').addEventListener('click',askStop);
  $('recordStageSound').addEventListener('click',async()=>{
    const ok=await ensureAudible();
    if(ok){
      // Audible test; also included in the recording.
      say(I.lang==='en'?'Hands up.':'Manos arriba.',()=>{});
    }else{
      alert(T('El sonido sigue bloqueado. Sube el volumen del celular y vuelve a tocar Activar voz.','Sound is still blocked. Increase your phone volume and tap Enable voice again.'));
    }
  });
  $('newRecording').onclick=()=>{if(!confirm(T('Antes de comenzar otra grabación, guarda el video anterior. ¿Continuar?','Save your previous video before starting another recording. Continue?')))return;clearResult();};
  $('shareRecording').onclick=async()=>{
    if(!lastBlob||!navigator.share)return;
    const f=new File([lastBlob],lastFileName,{type:lastBlob.type});
    try{if(!navigator.canShare||navigator.canShare({files:[f]}))await navigator.share({files:[f],title:'Tyson Boxing Club'});}catch(e){if(e.name!=='AbortError')status('No se pudo compartir. Usa Guardar video.','Sharing failed. Use Save video instead.');}
  };
  $('recordSetup').addEventListener('click',()=>{
    if(!recordingURL){
      $('recordStart').disabled=active;
      status(active?'Ya estás grabando. Finaliza el video para guardarlo.':'Pulsa Grabar y entrenar. Verás la toma en pantalla completa tal como quedará en el video.','Tap Record & train. You will see a full-screen preview exactly as it will look in the video.');
    }
  });
  // Canvas resolution stays fixed throughout a recording to protect video encoders.
  window.addEventListener('pagehide',()=>{if(active)finish();});
  window.TysonRecorder={get active(){return active},say,stopSpeaking,finish};
  clearResult();
  setState();
})();
