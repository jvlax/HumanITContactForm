var express = require('express');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var index = 'www/index.html';
var css = 'css/style.css';
var favicon = 'www/favicon.ico';
var contactFile = '/contactinfo/contactInfo.csv';
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	var html = fs.readFileSync(index);
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end(html);
});

app.get('/css/style.css', function(req, res) {
	var html = fs.readFileSync(css);
	res.writeHead(200, {
		'Content-Type': 'text/css'
	});
	res.end(html);
});

app.get('/favicon.ico', function(req, res) {
	var html = fs.readFileSync(favicon);
	res.writeHead(200, {
		'Content-Type': 'image/x-icon'
	});
	res.end(html);
});

app.get('/winner', function(req, res) {
	res.send("OK");
});

app.post('/', function(req, res) {
	var contactInfo = req.body.email + "," + req.body.name + "," + req.body.company + "\r\n";
	fs.appendFileSync(contactFile, contactInfo, function(err) {
		if (err) {
			return console.log(err);
		}
	});
	res.redirect('/');
});

app.listen(port, ip);
console.log("Server running on http://%s:%s", ip, port);
