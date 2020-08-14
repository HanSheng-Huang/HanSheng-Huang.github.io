'use strict';

console.log('Hello from sw.js');



// 引用workbox build
importScripts('./../js/workbox-sw');
importScripts("./")


workbox.setConfig({
    debug: true
});

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}




// 使用cache功能
// 存任何的.js
workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    new workbox.strategies.CacheFirst({})
);

// 存任何的css
workbox.routing.registerRoute(
    new RegExp('.*\.css'),
    new workbox.strategies.CacheFirst({
        cacheName: 'css-cache',
        cacheableResponse: {
            statuses: [0, 200]
        }
    })
);

// 存任何的images
workbox.routing.registerRoute(
    new RegExp('.*\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        cacheableResponse: {
            statuses: [0, 200]
        }
    })
);

// precache放routing之後
// workbox.precaching.precacheAndRoute([]);

workbox.precaching.precacheAndRoute([{
    url: 'index.html',
    revision: '123456'
}]);




const OFFLINE_VERSION = 1;
const CACHE_NAME = 'offline';
// Customize this with a different URL if needed.
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Setting {cache: 'reload'} in the new request will ensure that the response
    // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload if it's supported.
    // See https://developers.google.com/web/updates/2017/02/navigation-preload
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // We only want to call event.respondWith() if this is a navigation request
  // for an HTML page.
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        // catch is only triggered if an exception is thrown, which is likely
        // due to a network error.
        // If fetch() returns a valid HTTP response with a response code in
        // the 4xx or 5xx range, the catch() will NOT be called.
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }

  // If our if() condition is false, then this fetch handler won't intercept the
  // request. If there are any other fetch handlers registered, they will get a
  // chance to call event.respondWith(). If no fetch handlers call
  // event.respondWith(), the request will be handled by the browser as if there
  // were no service worker involvement.
});