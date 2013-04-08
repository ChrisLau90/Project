var express = require('express');
var app = express();
var path = require('path');

app.configure(function(){
  app.use(express.static(path.join(__dirname, '../')))
});

app.listen(8888);
console.log('Listening on port 8888');

val handler = function(req,res) {
	res.send("hello")
}

app.get("/foo",handler)