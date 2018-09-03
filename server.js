var express = require('express');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var index = 'www/index.html';
var css = 'css/style.css';
var favicon = 'www/favicon.ico';

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
	ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
	mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
	mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
	var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
		mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
		mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
		mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
		mongoPassword = process.env[mongoServiceName + '_PASSWORD']
	mongoUser = process.env[mongoServiceName + '_USER'];

	if (mongoHost && mongoPort && mongoDatabase) {
		mongoURLLabel = mongoURL = 'mongodb://';
		if (mongoUser && mongoPassword) {
			mongoURL += mongoUser + ':' + mongoPassword + '@';
		}
		// Provide UI label that excludes user id and pw
		mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
		mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;


	}
}

var db = null,
	dbDetails = new Object();

var initDb = function(callback) {
	console.log("initializing db connection: ");
	console.log(mongoURL);
	console.log("....");
	if (mongoURL == null) return;

	var mongodb = require('mongodb');
	if (mongodb == null) return;

	mongodb.connect(mongoURL, {
		useNewUrlParser: true
	}, function(err, conn) {
		if (err) {
			callback(err);
			return;
		}

		//db = conn;
		db = conn.db(mongoDatabase);
		dbDetails.databaseName = db.databaseName;
		dbDetails.url = mongoURLLabel;
		dbDetails.type = 'MongoDB';

		console.log('Connected to MongoDB at: %s', mongoURL);
	});
};


app.use('/img', express.static(__dirname + '/img'));
app.use('/js', express.static(__dirname + '/js'));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());


app.get('/', function(req, res) {
	if (!db) {
		initDb(function(err) {});
	}
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
	if (!db) {
		initDb(function(err) {});
	}
	if (db) {
		db.collection('contactInfo').find({}).toArray(function(err, result) {
			var winner = result[Math.floor(Math.random() * result.length)];
			res.send('{ winner: ' + winner.email + '}');
		});
	}
});

app.post('/', function(req, res) {
	var col = db.collection('contactInfo');
	col.insertOne(req.body);
	res.redirect('/');
});

initDb(function(err) {
	console.log('Error connecting to Mongo. Message:\n' + err);
});

app.listen(port, ip);
console.log("Server running on http://%s:%s", ip, port);
module.exports = app;
