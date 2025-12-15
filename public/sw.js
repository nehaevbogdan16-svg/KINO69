const CACHE_NAME = "kino69-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/room.html",
  "/css/style.css",
  "/js/room.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
