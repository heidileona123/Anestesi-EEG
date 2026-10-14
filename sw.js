const V='anestesi-eeg-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./en.html','./manifest-en.webmanifest',
 './icon-192.png','./icon-512.png','./icon-512-maskable.png','./apple-touch-icon.png','./favicon-64.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  if(/\.png$/.test(url.pathname)){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));return res;})));
    return;
  }
  e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(e.request,cp));return res;})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
