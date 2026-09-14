const CACHE='bizus-gpt-v1';
const ROOT=new URL('./',self.location).href;
const ASSETS=['./','./index.html','./pwa.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bizus-gpt-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
if(e.request.method!=='GET'||!e.request.url.startsWith(ROOT))return;
e.respondWith((async()=>{
const cache=await caches.open(CACHE);
try {const response=await fetch(e.request); if(response.ok)await cache.put(e.request,response.clone());return response;}
catch(error){const saved=await cache.match(e.request);if(saved)return saved;if(e.request.mode==='navigate'){const home=await cache.match(new URL('./index.html',ROOT).href);if(home)return home;}throw error;}
})());
});