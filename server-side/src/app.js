var express = require('express');
var bodyParser = require('body-parser');
var database = require("../db/database");

var app = express();
app.use(express.static("."));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var sql = new database();

app.use(function(req,res,next){	
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();	
});


app.get('/search',function(req,res){
	sql.once('search',function(html){
		res.send(html);
	});

	sql.getBooks(req);
});

app.listen(8080,function(){
	console.log("listening on port 8080");
});