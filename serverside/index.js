var fs = require('fs'),
https = require('https'),
express = require('express'),
app = express();
var request = require("request");

// https
https.createServer({
  key: fs.readFileSync('/link/to/your/key.pem', 'utf8'),
  cert: fs.readFileSync('/link/to/your/cert.pem', 'utf8')
}, app).listen(8080);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
  var roosterurl = req.query['url'];
  console.log(roosterurl);
  if (roosterurl.substring(0, 26) == "https://roosters.xedule.nl") {
    request({
      uri: roosterurl,
    }, function(error, response, body) {
      res.send(body);
    })
  } else {
    res.send("nope");
  }
});
