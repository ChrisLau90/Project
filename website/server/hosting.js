var express = require('express');
var url = require('url');
var app = express();
var path = require('path');
var database = require('./database.js');

app.configure(function(){
    app.use(express.static(path.join(__dirname, '../')));
    app.use(express.bodyParser());
	app.use(express.logger('dev'));
});

app.listen(8888);
console.log('Listening on port 8888');

var handler = function(req,res) {
	
    //var urlParts = url.parse(req.url, true);
    var levelNo = req.query['levelNo'];
    
    console.log(levelNo);

    database.getScores(levelNo, function(err,topScores){
        if(!err) {
            res.send(topScores);
        } else {
            res.send(400, err);
        }
    });
}

var handler2 = function(req,res) {

    //var urlParts = url.parse(req.url, true);
    var levelNo = req.query['levelNo'];

    console.log(levelNo);

    database.getAllScores(levelNo, function(err,topScores){
        if(!err) {
            res.send(topScores);
        } else {
            res.send(400, err);
        }
    });
}

var postHandler = function(req, res) {
    var level = req.param("level");
    var name = req.param("name");
    var score = req.param("score");
    var scoreNo = parseInt(score)
    if(!isNaN(scoreNo)) {
        database.submitScore(level, name, scoreNo);
        res.send(200);
    } else {
        res.send(400)
    }
}

app.get("/score",handler);
app.get("/score2", handler2);
app.post("/score",postHandler);
