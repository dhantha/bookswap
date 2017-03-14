var express = require('express');
var bodyParser = require('body-parser');
var Database = require("../db/database");

var app = express();
app.use(express.static("../../client-side/src"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var sql = new Database();

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

app.post('/login',function(req,res){});

app.post('/signup',function(req,res){});

app.get('/logout',function(req,res){});

// populate the user page
app.post('/User',function(req,res){
	var Id = req.body.ID;
	sql.once('user_profile',function(user){
		res.json(user);
	});
	sql.getUser(Id);
});

app.post('/booksWant',function(req,res){
	var Id = req.body.ID;
	sql.once('books_want',function(html){
		res.send(html);
	});
	sql.booksWant(Id);
});

app.post('/booksHave',function(req,res){
	var Id = req.body.ID;
	sql.onec('books_have',function(html){
		res.send(html);
	});
	sql.booksHave(Id);
});

app.listen(8080,function(){
	console.log("listening on port 8080");
});