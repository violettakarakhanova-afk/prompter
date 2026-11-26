// Prompter: osnovni service worker – stranica radi i kad je mreža slaba (govor ipak treba internet).
const C = 'prompter-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'ikona-192.png', 'ikona-512.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
// uvijek prvo s interneta (da nova verzija odmah stigne), a iz spremnika samo kad mreže nema
self.addEventListener('fetch', e => { if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request))); });
