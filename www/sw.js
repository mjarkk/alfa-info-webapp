var CACHE_NAME = 'my-site-cache-v1.1';

importScripts('./settings.js');

var sitedir = settings.SiteDir;

var urlsToCache = [
  sitedir,
  'https://fonts.googleapis.com/css?family=Roboto:400,500',
  sitedir + 'settings.js',
  sitedir + 'style.css',
  sitedir + 'script.js',
  sitedir + 'lockr.js',
  sitedir + 'jquery.js',
  sitedir + 'velocity.js',
  sitedir + 'manifest.json',
  sitedir + 'icons/96.png',
  sitedir + 'icons/144.png',
  sitedir + 'icons/192.png',
  sitedir + 'iconfont/material-icons.css',
  sitedir + 'iconfont/MaterialIcons-Regular.eot',
  sitedir + 'iconfont/MaterialIcons-Regular.ijmap',
  sitedir + 'iconfont/MaterialIcons-Regular.svg',
  sitedir + 'iconfont/MaterialIcons-Regular.ttf',
  sitedir + 'iconfont/MaterialIcons-Regular.woff',
  sitedir + 'iconfont/MaterialIcons-Regular.woff2'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
