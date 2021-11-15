const FILES_TO_CACHE = [
  '/',
  '/manifest.json',
  '/index.html',
  '/styles.css',
  '/db.js',
  '/index.js',
  'https://fonts.googleapis.com/css?family=Istok+Web|Montserrat:800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

const PRECACHE = 'my-site-cache-v1';
const RUNTIME = 'data-cache-v1';

//set up for install events
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', (event) => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  //check if request to update data
  if (e.request.url.includes("/api")) {
    e.respondWith(
      caches.open(RUNTIME)
      .then(async (cachedResponse) => {
        try {
          const response = await fetch(e.request);
          if (response.status === 200) {
            cache.put(e.request.url, response.clone());
          }
          return cachedResponse;
        } catch (err) {
          console.log(`There is an error in Network conect, cache time ${err}`);
          return cachedResponse.match(e.request);
        }
      })
    );
  return;
}

  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request).then(function(response){
      if (response) {
        return response;
      } else if (e.request.headers.get("accept").includes("text/html")) {
        return caches.match("/");
      }
    });
    })
  );
});
