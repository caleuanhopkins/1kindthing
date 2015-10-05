require('dotenv').load();

var http = require('http');
var path = require('path');
var express = require('express');
var request = require('request');
var nunjucks = require('nunjucks');

var bodyParser = require('body-parser')

var app = express();

app.set('view engine', 'html');
app.set('view engine', nunjucks.render);
app.set('views', __dirname + '/public');

nunjucks.configure({
    autoescape: true,
    express: app,
    watch: true,
    noCache: true
}, app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var server = http.createServer(app);

app.get('/', function (req, res) {
  res.render('home.html');
});

app.get('/kindness', function (req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ kindAct: 'This is just a test' }));});

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Express server now listening on *:' + port);
});