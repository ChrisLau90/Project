var express = require('express');
var app = express();
var path = require('path');
var database = require('./database.js');

var scoreList = new Array();

app.configure(function(){
  app.use(express.static(path.join(__dirname, '../')))
  app.use(express.bodyParser())
	app.use(express.logger('dev'));
});

app.listen(8888);
console.log('Listening on port 8888');

var handler = function(req,res) {
	res.send(scoreList[0]);
}

var postHandler = function(req, res) {
	console.log(req.param("message"));
    scoreList.push(req.param("message"));
	database.submitLevel1Score("bob", 100,function(){});
	res.send(200);
}

app.get("/score",handler);
app.post("/score",postHandler);
