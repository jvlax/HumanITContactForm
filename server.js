var express = require('express');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");
//var mongoClient = require('mongodb').MongoClient;

//var mongoUrl = "mongodb://human:humanRH2018@localhost:27017/contacts";
//var dbName = 'contacts';
var index = 'www/index.html';
var css = 'css/style.css';
var favicon = 'www/favicon.ico';
var contactFile = 'contactInfo.csv';
//var ip = '0.0.0.0';
//var port = "8181";
//var winner = {};

/*
function dataBase(operation, data) {
	mongoClient.connect(mongoUrl, {
		useNewUrlParser: true
	}, function(err, client) {
		if (err) throw err;
		const db = client.db(dbName);
		if (operation == "select") {
			db.collection('contactInfo').find({}).toArray(function(err, result) {
				if (err) throw err;
				winner = result[Math.floor(Math.random() * result.length)];
				console.log(winner);
				//winner = "hej";
			});
		}
		if (operation == "insert") {
			db.collection('contactInfo').insertOne(data, function(err, r) {
				if (err) throw err;
				console.log("inserted: ");
				console.log(data);
			});
		}

		client.close();

	});
	return winner;

}
*/

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
