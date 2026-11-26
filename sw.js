// Prompter: osnovni service worker – samo datoteke s ove adrese (model govora sprema prepoznavanje samo, ne ovdje).
const C = 'prompter-v2';
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'index.html', 'manifest.json', 'ikona-192.png', 'ikona-512.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
// uvijek prvo s interneta (da nova verzija odmah stigne), a iz spremnika samo kad mreže nema
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const k = r.clone(); caches.open(C).then(c => c.put(e.request, k)); return r; }).catch(() => caches.match(e.request)));
});
