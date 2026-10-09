'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../i18n.js'),'utf8');
function make(storage={}){
 const listeners={};
 const context={NodeFilter:{SHOW_TEXT:4},window:{Tyson:{moves:{'1':['Jab','Golpe adelantado']}}},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{addEventListener:(k,fn)=>listeners[k]=fn,dispatchEvent:()=>{},createTreeWalker:()=>({nextNode:()=>null}),querySelectorAll:()=>[],querySelector:(s)=>s==='meta[name=description]'?{content:''}:{setAttribute:()=>{}},getElementById:()=>null,documentElement:{lang:''}},CustomEvent:class{}};
 context.document.documentElement=context.documentElement={lang:''};vm.runInNewContext(source,context);
 return {api:context.window.TysonI18n,storage};
}
test('selector bilingüe conserva idioma y localiza golpes e instrucciones',()=>{
 const s=make();assert.equal(s.api.lang,'es');assert.equal(s.api.move('1')[0],'Jab');
 s.api.setLang('en');assert.equal(s.api.lang,'en');
 assert.equal(s.storage['tyson-language'],'en');
 assert.equal(s.api.move('2')[0],'Cross');
 assert.equal(s.api.move('PA')[0],'Step back');
 assert.equal(s.api.t('Voz en español'),'Voice in English');
 assert.equal(make(s.storage).api.lang,'en');
});
