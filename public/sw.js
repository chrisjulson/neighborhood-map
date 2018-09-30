var CACHE_NAME = 'neighborhood-map-cache-v1';
var urlsToCache = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/manifest.json',
    '/fb_logo.svg',
    '/www_logo.svg',
    '/places.json',
    '/src/App.css',
    '/src/App.js',
    '/src/Map.js',
    '/src/PlacesList.js',
    '/src/QueryBox.js',
    '/src/DBHelper',
    '/src/FoursquareAPI.js',
    '/src/index.js',
    '/src/index.css',
    '/src/sw-supporter.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // response found in cache - return it
                if (response) {
                    return response;
                }
 
                // Cloning the request stream in order to
                // provide it both to cache and browser.
                var fetchRequest = event.request.clone();
 
                return fetch(fetchRequest).then(
                    function(response) {
                        // Check for valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Cloning the response stream in order to
                        // provide it both to browser and to cache.
                        var responseToCache = response.clone();
 
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            })
                            .catch(err => console.log(err));
                        return response;
                    }
                ).catch(function(error){
                    return new Response('Service Worker: could not load data. Possibly network outage. Please try again later.');
                });
            }).catch(function(){
            })
    );
});