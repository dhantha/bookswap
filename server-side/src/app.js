var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.get('/',function(req,res){
	res.send("Hey its working");
});

app.listen(8080,function(){
	console.log("listening on port 8080");
});