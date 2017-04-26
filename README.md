# An unofficial Alfa web app.

### info
This is an webb app makes it easy to display roosters.xedule.nl and some alfa school links.

Tecnical:  
This app has a service worker built-in, a manifest to enable add to home screen, material design ui, webp support and a view little tings more!

![screenshot](http://i.imgur.com/7ZhvQQE.png)

### Website made with:
[xedule web api](https://github.com/mjarkk/node-xedule-web-api)  
[velocity.js](http://velocityjs.org/)  
[lockr](https://github.com/tsironis/lockr)  
[Service Worker](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)  
[WebP](https://developers.google.com/speed/webp/)

### how to install  

! this web app requires https !  
1: download & configure: https://github.com/mjarkk/node-xedule-web-api  
2: Copy the content from www to you'r web server root.  
Dune!  

### Sub directory
If you place it in a sub directory like www.yoursite.com/school there are some settings you need to change.

In settings.js
```
  "SiteDir": "/",
  // to
  "SiteDir": "/school/",
```
In manifest.json all:
```
{
  "src": "/icons/...png",
  ....
},
// to
{
  "src": "/school/icons/...png",
  ....
},
```  

## Bugs:
- none!
