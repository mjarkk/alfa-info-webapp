# An unofficial Alfa web app.

### info
this is an webb app makes it easy to display roosters.xedule.nl and some alfa school links.

Also the app has a service worker built-in, a manifest to enable add to home screen(not tested), material design ui and a view little thigs more!

![screenshot](http://i.imgur.com/7ZhvQQE.png)

### Website made with:
[xedule web api for translating the html into a json](https://github.com/mjarkk/smallprojects/tree/master/xeduleAPI)  
[velocity.js for all the animations](http://velocityjs.org/)  
[jquery for the add elemets](https://jquery.com/)  
[npm for the serverside request](https://www.npmjs.com/)
[lockr for the offline saved data](https://github.com/tsironis/lockr)
[letsencrypt for the https](https://letsencrypt.org/)
[Service Worker for the offline site](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
### how to install

! for add to home screen and offline you need https

to use the timetable you need to download: the serverside folder
and install: npm install
add eddit the path to https in index.js: 
```
// https
https.createServer({
  key: fs.readFileSync('/link/to/your/key.pem', 'utf8'),
  cert: fs.readFileSync('/link/to/your/cert.pem', 'utf8')
}, app).listen(8080);
```

my webserver (nginx) config:

```
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}
server {
  listen 443 ssl http2;
  server_name yourdomain.com;
  ssl on;
  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
  root /usr/share/nginx/yourdomain.com;
  server_name yourdomain.com;
  index index.php index.html index.htm;
  location / {
    try_files $uri $uri/ =404;
  }
}
```

Copy the content from www to you'r web server root.

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
In sw.js
```
var sitedir = "/"
// to
var sitedir = "/school/"
```

if you have problems opening you'r site for the first time:
press in your website ctrl + shift + i
![screenshot](http://i.imgur.com/wwSBQzN.png)

## Bugs:
- serviceworker doesn't delete rooster site. that means after 100+ times opening the site your cache is 10mb
