
const CACHE_NAME = 'aau-student-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: We can't cache CDN assets with a basic service worker due to CORS.
  // A more advanced setup with Workbox would be needed for that.
  // For this demo, we cache the essential local files.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve from cache
        }
        return fetch(event.request); // Fetch from network
      }
    )
  );
});
