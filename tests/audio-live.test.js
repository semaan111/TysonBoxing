'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'../recorder.js'),'utf8');
test('audio del entrenador se mezcla en video y se escucha en el celular',()=>{
 assert.match(js,/coachOutput\.connect\(mixer\)/);
 assert.match(js,/coachOutput\.connect\(speakerGain\)\.connect\(ctx\.destination\)/);
 assert.match(js,/nativeMonitor=new Audio\(\)/);
 assert.match(js,/nativeMonitor\.play\(\)/);
 assert.match(js,/playNativeMonitor\(clips,token\)/);
 assert.match(js,/navigator\.audioSession\.type/);
});
test('activar sonido no cancela las combinaciones en curso',()=>{
 const handler=js.match(/\$\('recordStageSound'\)\.addEventListener\('click',\(\)=>\{([\s\S]*?)\n  \}\);/);
 assert.ok(handler);
 assert.doesNotMatch(handler[1],/say\(/);
 assert.match(handler[1],/nativeMonitor\.play\(\)/);
});
