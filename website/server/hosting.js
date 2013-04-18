var express = require('express');           //require Express module
var app = express();                        //initialise Express module
var url = require('url');                   //require prased URL object
var path = require('path');                 //require requested file path from URL
var database = require('./database.js');    //require database module

app.configure(function(){
    app.use(express.static(path.join(__dirname, '../'))); //
    app.use(express.bodyParser());
	app.use(express.logger('dev'));
});

app.listen(8888);
console.log('Listening on port 8888');

var getHandler = function(req,res) {

    var levelNo = req.query['levelNo'];

    database.getScores(levelNo, function(err,topScores){
        if(!err) {
            res.send(topScores);
        } else {
            res.send(400, err);
        }
    });
}

var getHandler2 = function(req,res) {

    //var urlParts = url.parse(req.url, true);
    var levelNo = req.query['levelNo'];

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

app.get("/score1",getHandler);
app.get("/score2", getHandler2);
app.post("/post",postHandler);
