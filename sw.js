// Menyimpan game agar bisa dibuka tanpa internet.
const V='super-bpom-v2';
const LOCAL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
const REMOTE=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Fredoka:wght@500;700&display=swap'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all([...LOCAL,...REMOTE].map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}
    return r;
  }).catch(()=>caches.match('index.html'))));
});
