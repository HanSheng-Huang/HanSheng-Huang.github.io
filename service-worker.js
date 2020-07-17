'use strict';

console.log('Hello from sw.js');



// 引用workbox build
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');


workbox.setConfig({ debug: true });

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}




// 使用cache功能
// 存任何的.js
workbox.routing.registerRoute(
    new RegExp('.*\.js'),
    new workbox.strategies.CacheFirst({
    })
);

// 存任何的css
workbox.routing.registerRoute(
    new RegExp('.*\.css'),
    new workbox.strategies.CacheFirst({
        cacheName: 'css-cache',
        cacheableResponse: { statuses: [0, 200] }
    })
);

// 存任何的images
workbox.routing.registerRoute(
    new RegExp('.*\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        cacheableResponse: { statuses: [0, 200] }
    })
);

// precache放routing之後
// workbox.precaching.precacheAndRoute([]);

workbox.precaching.precacheAndRoute([
    {
        url: 'index.html',
        revision: '123456'
    }
]);

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith((async () => {
        try {
          const preloadResp = await event.preloadResponse;
  
          if (preloadResp) {
            return preloadResp;
          }
  
          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
  
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })());
    }
  });