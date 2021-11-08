const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/favorites.html',
  '/styles.css',
  '/dist/app.bundle.js',
  '/dist/favorites.bundle.js',
  '/dist/topic.bundle.js',
  'https://fonts.googleapis.com/css?family=Istok+Web|Montserrat:800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
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

self.addEventListener('fetch', (event) => {
  //check if request to update data
  if (event.request.url.indcludes("/api")) {
    event.respondWith(
      caches.open(RUNTIME)
      .then(async (cachedResponse) => {
        try {
          const response = await fetch(event.request);
          if (response.status === 200) {
            cache.put(event.request.url, response.clone());
          }
          return cachedResponse;
        } catch (err) {
          console.log(`There is an error in Network conect, cache time ${err}`);
          return cachedResponse.match(event.request);
        }
      })
    );
  return;
}

  e2.respondWith(
    fetch(e2.request).catch(function() {
      return caches.match(e2.request).then(function(response){
      if (respone) {
        return response;
      } else if (e2.request.headers.get("accept").includes("text/html")) {
        return caches.match("/");
      }
    });
    })
  );
});
