// // SW.js 的生命週期（鉤子）

// // 這裡是預設內容
// // 儲存在 cache 的空間名稱 // 透過版本號去控制抓取的快取對象
// // 避免快取空間未更新之問題
// const staticCacheName = 'site.static.v1';
// const dynamicCache = 'site-dynamic-v1';
// // 儲存內容
// const assets = ['/', '/index.html', '/errPage.html'];

// self.addEventListener('install', evt => {
//   // 等待裡面內容完成
//   evt.waitUntil(
//     // 開一個新個空間命名為 staticCacheName
//     caches.open(staticCacheName).then(cache => {
//       console.log('caching shell assets');
//       // 然後加入需要儲存內容
//       cache.addAll(assets);
//     })
//   );
// });

// // 啟動上述的安裝事項
// self.addEventListener('activate', evt => {
//   evt.waitUntil(
//     // 把所有的快取空間過濾
//     caches.keys().then(keys => {
//       // 若是所有的空間名稱
//       return Promise.all(
//         keys
//           //不符合預設名稱
//           .filter(key => key !== staticCacheName && key !== dynamicCache)
//           // 就刪掉
//           .map(key => caches.delete(key))
//       );
//     })
//   );
// });

// // 任何從 network 抓取的事件
// self.addEventListener('fetch', evt => {
//   console.log('sw.js', evt);
//   // 關於其回應
//   evt.respondWith(
//     // 若 caches 有對應到的值
//     caches.match(evt.request).then(cacheRes => {
//       // 則會返回 cache 已經儲存得值
//       return (
//         // 若為空值則重新抓取
//         caches ||
//         // 這裡再次 fetch // fetch 對象有兩種可能， // 一是預設名單抓取失敗 // 一是不在預設名單裡面
//         fetch(evt.request)
//           .then(fetchRes => {
//             // 再開一個新的儲值空間
//             return caches.open(dynamicCache).then(cache => {
//               // 把抓取對象儲值（若是用 lazy load 則需要使用者有去瀏覽才會儲值）
//               // 所以會造成一種錯誤
//               cache.put(evt.request.url, fetchRes.clone());
//               return fetchRes;
//             });
//           })
//           // 若是造成了 ｌａｚｙ load 的錯誤
//           .catch(() => {
//             // 並且是 html 頁面，而非圖片, xhr, js...
//             if (evt.request.url.indexOf('.html') > -1) {
//               caches.match('/errPage.html');
//             }
//           })
//       );
//     })
//   );
// });
self.addEventListener('fetch', evt => {});
