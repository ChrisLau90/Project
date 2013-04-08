var express = require('express');
var app = express();
var path = require('path');

var scoreList = new Array();

app.configure(function(){
  app.use(express.static(path.join(__dirname, '../')))
  app.use(express.bodyParser())
});

app.listen(8888);
console.log('Listening on port 8888');

var handler = function(req,res) {
	res.send("hello");
}

var postHandler = function(req, res) {
	console.log(req.param("message"));
    scoreList.push(req.param("message"));
	res.send(200);
}

app.get("/foo",handler)
app.post("/score",postHandler)
