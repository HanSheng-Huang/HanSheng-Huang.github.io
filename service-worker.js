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
workbox.precaching.precacheAndRoute([]);

// workbox.precaching.precacheAndRoute([
//     {
//         url: '/website/biowebpwa/bio.html',
//         revision: '123456'
//     }
// ]);

self.addEventListener('fetch', evt => {});