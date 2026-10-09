'use strict';
/* Voz de la misma fuente MP3 tanto en sesión normal como en grabación. */
(() => {
  const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/^[¡¿]|[.!?¡¿]+$/g,'').replace(/\s+/g,' ');
  let ctx=null, bank=null, buffer=null, key='', generation=0, sources=[];
  const Ctor=window.AudioContext||window.webkitAudioContext;
  function stop(){generation++;sources.forEach(s=>{try{s.stop()}catch{}});sources=[];}
  async function prepare(){
    if(!Ctor)return false;
    const desired=window.TysonI18n.lang+'-'+document.getElementById('stance').value;
    if(!ctx)ctx=new Ctor();
    try{await ctx.resume()}catch{}
    if(buffer&&desired===key)return true;
    const b=window.TysonVoiceBank[desired];if(!b)return false;
    const r=await fetch(b.url);if(!r.ok)return false;
    const decoded=await ctx.decodeAudioData(await r.arrayBuffer());
    bank=b;buffer=decoded;key=desired;return true;
  }
  async function say(text,done=()=>{}){
    stop();const token=generation;
    try{
      if(!await prepare())throw Error('Audio no disponible');
      if(token!==generation)return;
      const clips=String(text).split(/\.\s*/).map(norm).filter(Boolean).map(s=>bank.phrases[s]);
      if(!clips.length||clips.some(c=>!c)){console.warn('Frase sin grabar',text);done();return;}
      let at=ctx.currentTime+.05;
      clips.forEach(([offset,duration],i)=>{
        const src=ctx.createBufferSource();src.buffer=buffer;src.connect(ctx.destination);
        const d=Math.max(.05,duration-.015);src.start(at,offset+.006,d);
        at+=d+.14;sources.push(src);
        if(i===clips.length-1)src.onended=()=>{if(token===generation){sources=[];done();}};
      });
    }catch(e){console.warn(e);if(token===generation)done();}
  }
  window.TysonUnifiedVoice={say,stop,prepare};
})();
