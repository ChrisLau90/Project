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

scores = db.collection('scores');

exports.submitScore = function(level, name, score){
	var record = {};
	record.level = level;
	record.name = name;
	record.score = score;
	scores.insert(record, {safe:true}, function(err, records){
		console.log('added a record');
	});
}

exports.getScores = function(levelNo, callback){
	scores.find({level:levelNo}).toArray(function(err, allScores){
		console.log(allScores)
	});
}
