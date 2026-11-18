const C='miniakits-v28';
const SHELL=['/','/en/','/ar/','/kits','/en/kits','/style.css','/homepage-refresh.css','/main.js?v=25','/i18n.js?v=25','/kits.js','/favicon.ico?v=2','/img/logo-miniakits.webp?v=2','/img/logo-miniakits-white.webp?v=2','/manifest.webmanifest?v=2','/img/icon-m-192.png?v=2','/404.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin||r.headers.has('range'))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{if(res.ok&&!res.redirected){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))};return res}).catch(()=>caches.match(r).then(h=>h||caches.match('/'))));return}
 e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok&&/\.(css|js|svg|webp|png|jpg|woff2?)$/.test(new URL(r.url).pathname)){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res})))});
