'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../music.js'),'utf8');

function setup(){
  const nodes=new Map();
  function element(id=''){
    const attrs={};
    return {id,style:{},open:false,src:'',value:'',textContent:'',children:[],
      setAttribute(k,v){attrs[k]=v;},getAttribute(k){return attrs[k]??null;},
      replaceChildren(...a){this.children=a;},showModal(){this.open=true;},
      querySelector(name){return this.children.find(x=>name==='iframe'&&x.tag==='iframe');},
      set src(v){this._src=v;attrs.src=v;},get src(){return this._src||'';}
    };
  }
  const get=id=>{if(!nodes.has(id))nodes.set(id,element(id));return nodes.get(id);};
  let counter=1;const pending=new Map(),listeners={};
  const state={state:'idle'};
  let observer;
  const doc={body:element('body'),hidden:false,getElementById:get,createElement(tag){const n=element();n.tag=tag;return n;},addEventListener(name,fn){listeners[name]=fn;}};
  const ctx={window:{},document:doc,clock:state,URL,performance:{now:()=>5000},
    setTimeout(fn,delay){const id=counter++;pending.set(id,{fn,delay});return id;},
    clearTimeout(id){pending.delete(id);},MutationObserver:class{constructor(fn){observer=fn;}observe(){}}};
  vm.runInNewContext(source,ctx,{filename:'music.js'});
  const fireTimers=limit=>{for(let i=0;i<8;i++){
    const targets=[...pending].filter(([id,t])=>t.delay<=limit);
    if(!targets.length)break;
    for(const [id,t] of targets){pending.delete(id);t.fn();}
  }};
  const setState=next=>{state.state=next;observer();};
  return {ctx,get,setState,fireTimers};
}

test('música por fases: inicio y descansos, no preparación ni rounds',()=>{
  const s=setup();const callbacks={};let resumes=0,pauses=0;
  const mock={resume(){resumes++;},pause(){pauses++;},addListener(name,fn){callbacks[name]=fn;}};
  s.ctx.window.onSpotifyIframeApiReady({createController(node,options,fn){fn(mock);}});
  callbacks.ready();assert.equal(resumes,1,'intenta sonar al entrar');
  s.setState('prepare');assert.ok(pauses>=1,'se pausa en la preparación');
  const before=resumes;
  s.ctx.window.TysonMusic.voiceStart();s.ctx.window.TysonMusic.voiceEnd();s.fireTimers(300);
  assert.equal(resumes,before,'no se reanuda durante la preparación');
  s.setState('work');assert.equal(resumes,before,'no suena en el round');
  s.setState('rest');assert.ok(resumes>before,'vuelve en descanso');
  const afterRest=resumes;
  s.setState('work');assert.equal(resumes,afterRest,'se calla en el siguiente round');
});

test('una pausa manual se conserva de un descanso al siguiente',()=>{
  const s=setup(),callbacks={};let resumes=0;
  const mock={resume(){resumes++;},pause(){},addListener(name,fn){callbacks[name]=fn;}};
  s.ctx.window.onSpotifyIframeApiReady({createController(n,o,fn){fn(mock);}});callbacks.ready();
  callbacks.playback_update({data:{isPaused:false,isBuffering:false}});
  s.get('musicToggle').onclick(); // Pausa desde el botón flotante
  const prior=resumes;
  s.setState('prepare');s.setState('work');s.setState('rest');
  assert.equal(resumes,prior,'no reactiva lo que el usuario pausó');
  s.get('musicToggle').onclick();assert.equal(resumes,prior+1,'permite reanudar en descanso');
});

test('reproductor alternativo se descarga en el round y vuelve en descanso',()=>{
  const s=setup();s.fireTimers(10000);
  const embed=s.get('spotifyEmbed').children[0];
  assert.ok(embed.src.includes('open.spotify.com/embed/'),'carga el iframe en inicio');
  s.setState('prepare');assert.equal(embed.src,'about:blank');
  s.setState('work');assert.equal(embed.src,'about:blank');
  s.setState('rest');assert.ok(embed.src.includes('open.spotify.com/embed/'));
  s.ctx.window.TysonMusic.voiceStart();assert.equal(embed.src,'about:blank');
  s.ctx.window.TysonMusic.voiceEnd();s.fireTimers(300);
  assert.ok(embed.src.includes('open.spotify.com/embed/'),'vuelve después del aviso hablado');
});
