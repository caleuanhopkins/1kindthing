require('dotenv').load();

var http = require('http');
var path = require('path');
var express = require('express');
var request = require('request');
var nunjucks = require('nunjucks');

var bodyParser = require('body-parser');

var Oneall = require('oneall');

var bodyParser   = require('body-parser');

var app = express();

app.set('view engine', nunjucks.render);
app.set('views', __dirname + '/public');

nunjucks.configure(__dirname + '/public',{
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

	var oneall = new Oneall({
	    endpoint: 'https://1kindthing.api.oneall.com/',
	    publickey: '0f57d31c-6135-46e1-92e3-490fe2d5956d',
	    privatekey: 'c3d98e8e-0d35-4863-9533-4a60ee909742'
	});

	var token = req.query.auth_token;

	///identities/<identity_token>
	//console.log("https://1kindthing.api.oneall.com/identities/"+token+".json");
	  oneall.connection.get(
	    token,
	    function (err, data, fullData) {
	        if (err) {
	            throw(err);
	        }
	        //data = JSON.parse(data);
	        //fullData = JSON.parse(fullData);
	        console.log(data);
	        console.log(fullData);
	    }
	  );



	  console.log(oneall);
   	request({url: "https://1kindthing.api.oneall.com/connection/"+token+".json", USERPWD: '0f57d31c-6135-46e1-92e3-490fe2d5956d:c3d98e8e-0d35-4863-9533-4a60ee909742' }, function(err, request, data) {
	    
   		var returnStr = '';
   		var apiData = JSON.parse(data);


	    if (!err && res.statusCode == 200 && apiData.response.request.status.code == 200) {
	    	status = res.statusCode;
	    	console.log(apiData);
    		returnStr = 'This is just a test';
	    }else{
	    	status = res.statusCode;
	    	if(err){
    			returnStr = err;
    		}else{
    			returnStr = apiData.response.request.status.info;
    		}
	    }

	    res.setHeader('Content-Type', 'application/json');
	    res.send(JSON.stringify({ status: status, msg: returnStr }));
   	});
});

app.get('/auth', function(req, res){
	res.render('auth.html');
});

app.post('/callback', function(req, res){
	res.redirect('/kindness?auth_token='+req.body.connection_token);
});

var port = process.env.PORT || 3000;
server.listen(port, function() {
    console.log('Express server now listening on *:' + port);
});