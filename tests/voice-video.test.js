'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const data=fs.readFileSync(path.join(root,'voice-bank.js'),'utf8');
const sandbox={window:{}};vm.runInNewContext(data,sandbox);
const banks=sandbox.window.TysonVoiceBank;
const moves=['1','2','3','4','5','6','1C','2C','3C','4C','5C','6C','SI','SD','R','B','P','PA','PI','LI','LD','F'];
test('cuatro bancos de voz: audios incluidos y narración de los 20 rounds',()=>{
 for(const lang of ['es','en'])for(const stance of ['orthodox','southpaw']){
  const b=banks[`${lang}-${stance}`];assert.ok(b);
  const audio=path.join(root,b.url);assert.ok(fs.statSync(audio).size>10000);
  for(let n=1;n<=20;n++)assert.ok(b.phrases[`round ${n}`]);
  const expected=lang==='es'?'manos arriba':'hands up';assert.ok(b.phrases[expected]);
  assert.ok(Object.keys(b.phrases).length>=50);
 }
});
test('la app incluye mezcla MediaRecorder con audio grabable, sin capturar Spotify',()=>{
 const s=fs.readFileSync(path.join(root,'recorder.js'),'utf8');
 assert.match(s,/createMediaStreamDestination/);
 assert.match(s,/new MediaStream\(/);
 assert.match(s,/MediaRecorder\(/);
 assert.match(s,/coachOutput\.connect\(mixer\)/);
 assert.match(s,/canvasStream\.getVideoTracks\(\)/);
 assert.match(s,/recordCanvas\.captureStream\(24\)/);
 assert.doesNotMatch(s,/const topGrad=/);
 assert.doesNotMatch(s,/const bottomGrad=/);
 assert.doesNotMatch(s,/spotifyEmbed/);
});
