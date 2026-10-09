'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {moves,combos,pool,choose}=require('./core.js');
const allowed=new Set(['index.html','style.css','app.js','mobile.js','music.js','i18n.js','recorder.js','voice-bank.js','coach-audio/es-orthodox.mp3','coach-audio/es-southpaw.mp3','coach-audio/en-orthodox.mp3','coach-audio/en-southpaw.mp3','tyson-3d.png','core.js','icon.svg']);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg'};
function createServer(){return http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
if(req.method!=='GET'&&req.method!=='HEAD')return json(405,{error:'Método no permitido'});
if(url.pathname==='/api/health')return json(200,{ok:true,app:'Tyson',version:'1.0.0'});
if(url.pathname==='/api/moves')return json(200,moves);
if(['/api/combos','/api/combo'].includes(url.pathname)){const level=Number(url.searchParams.get('level')||2),focus=url.searchParams.get('focus')||'all';if(![1,2,3].includes(level)||!['all','technique','body','defense'].includes(focus))return json(400,{error:'Nivel o enfoque inválido'});return json(200,url.pathname==='/api/combo'?choose(level,focus,url.searchParams.get('last')):pool(level,focus));}
let name;try{name=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';}catch{return json(400,{error:'Ruta inválida'});}if(!allowed.has(name))return json(404,{error:'No encontrado'});fs.readFile(path.join(__dirname,name),(err,data)=>{if(err)return json(500,{error:'No se pudo leer el archivo'});res.writeHead(200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);});});}
if(require.main===module)createServer().listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Tyson listo en http://localhost:'+(process.env.PORT||3000)));
module.exports={createServer};
