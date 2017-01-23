# An unofficial Alfa web app.
---
### info
this is an webb app makes it easy to display roosters.xedule.nl and some alfa school links.

Also the app has a service worker built-in, a manifest to enable add to home screen(not tested), material design ui and a view little thigs more!

![screenshot](http://i.imgur.com/7ZhvQQE.png)

### Website made with:
[xedule web api](https://github.com/mjarkk/smallprojects/tree/master/xeduleAPI)  
[velocity.js](http://velocityjs.org/)  
[jquery](https://jquery.com/)  
[lockr](https://github.com/tsironis/lockr)
### how to install

! for add to home screen and offline you need https

to use the timetable you need to download & install: https://github.com/bmpvieira/simple-corsproxy
if you have a https server you need to install inside of the simple-corsproxy folder:
npm install https
after that you need to change the index.js
```
// also change the /etc/letsencrypt/live/www.yourserver.com/*.pem to where your .pem is located.
#!/usr/bin/env node
var http = require('https')
var request = require('request')
var fs = require('fs')
var port = process.env.PORT || 8080
var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.yourserver.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/www.yourserver.com/fullchain.pem')
}
http.createServer(options, function (req, res) {
  res.setTimeout(2500)
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    request(req.url.slice(1), {encoding: null}, function(error, response, body) {
      res.write(body)
      res.end()
    })
  }
  catch(e) {}
}).listen(port)
console.log("Listening on port: " + port)
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
