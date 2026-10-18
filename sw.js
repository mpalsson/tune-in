const CACHE='tune-in-v8-gospel-library-icon';
const FILES=['./','./index.html','./manifest.webmanifest','./sw.js','./icon-192.png','./icon-512.png','./randy-w.png','./assets/gospel-library-icon.png','./assets/randy-byu-dance.gif','./assets/randy-byu-poster.png','./assets/bali-life.webp','./assets/future-feed.webp','./assets/raccoon-driver.webp'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(path=>new Request(path,{cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n => n.startsWith('tune-in-') && n !== CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==self.location.origin)return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(cached=>cached||fetch(e.request)));
});
