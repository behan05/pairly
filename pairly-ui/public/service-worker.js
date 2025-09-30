// Name + version of your cache (bump version when you deploy new build)
const CACHE_NAME = 'connect-cache-v4';

// Only cache static core files that won’t change between builds
// (index.html is handled by network fallback, not cache)
const urlsToCache = [
    '/',
    '/manifest.json',
    '/logo.png',
];

// Install event → cache static files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activate event → clean up old caches when you deploy a new build
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

// Fetch event → try network first, fallback to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Optional: cache fetched responses (only GET requests, not API posts)
                if (event.request.method === 'GET') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache if offline
                return caches.match(event.request);
            })
    );
});
