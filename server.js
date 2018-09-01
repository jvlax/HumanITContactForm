var express = require('express');
var fs = require('fs');
var express = require('express'),
	app = express(),
	morgan = require('morgan');
var bodyParser = require("body-parser");
Object.assign = require('object-assign');
var mongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://human:humanRH2018@localhost:27017/contacts";
var dbName = 'contacts';
var index = 'www/index.html';
var css = 'css/style.css';
var favicon = 'www/favicon.ico';
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
	if (mongoURL == null) return;

	var mongodb = require('mongodb');
	if (mongodb == null) return;

	mongodb.connect(mongoURL, function(err, conn) {
		if (err) {
			callback(err);
			return;
		}

		db = conn;
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
app.use(morgan('combined'))


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
	//var html = dataBase("select");
	//console.log(html);
	//console.log(html.email);
	if (!db) {
		initDb(function(err) {});
	}
	if (db) {
		db.collection('contactInfo').find({}).toArray(function(err, result) {
			var winner = result[Math.floor(Math.random() * result.length)];
			res.send('{ winner: ' + winner + '}');
		});
	}

	/*res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end("html");
	*/
});

app.post('/', function(req, res) {
	//dataBase("insert", req.body);
	var col = db.collection('contactInfo');
	col.insert(req.body);
	res.redirect('/');
});

app.listen(port, ip);
console.log("Server running on http://%s:%s", ip, port);
