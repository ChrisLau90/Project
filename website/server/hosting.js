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
	
        var urlParts = url.parse(req.url, true);
        var levelNo = urlParts.levelNo;

        database.getScores("1", function(err,topScores){
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
app.post("/score",postHandler);
