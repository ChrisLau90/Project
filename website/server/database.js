var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('scoredb', server,{safe:true});

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'scoredb' database");
	} else {
		console.log("fack")
	}
});

level1scores = db.collection('level1scores');

exports.submitLevel1Score = function(name, score, callback){
	var record = {};
	record.name = name;
	record.score = score;
	level1scores.insert(record, {safe:true}, function(err, records){
		console.log('added a record');
	});
}


