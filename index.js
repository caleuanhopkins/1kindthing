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

var gDriveKeys = require('./1kindthing-aee6d0c38aa5.json');

var GoogleSpreadsheet = require('google-spreadsheet');

var creds = {
  client_email: gDriveKeys.client_email,
  private_key: gDriveKeys.private_key
}

var actSheet = new GoogleSpreadsheet(gDriveKeys.spreadsheet_id);

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

	/*var oneall = new Oneall({
	    endpoint: 'https://1kindthing.api.oneall.com',
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
	        res.send(JSON.stringify(fullData.response));
	    }
	  );*/

	var kindActs = '';

	actSheet.useServiceAccountAuth(creds, function(err){
		var i=1;
		actSheet.getRows( 1, function(err, row_data){
			var randKey = Math.floor(Math.random() * (row_data.length - 1 + 1)) + 1;
			console.log(row_data[randKey].acts);
			kindActs = row_data[randKey].acts;

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({ act: kindActs }));

		});
	});

});

app.post('/kindness', function (req, res){
	actSheet.useServiceAccountAuth(creds, function(err){
		actSheet.addRow( 1, { acts: request.body.act} );
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ msg: 'thank you! your act of kindness suggestion has been submitted' }));
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