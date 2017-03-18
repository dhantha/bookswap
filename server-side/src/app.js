var express = require('express');
var bodyParser = require('body-parser');
var Database = require("../db/database");
var session = require('client-sessions');
var fs = require('fs');

var app = express();
app.use(express.static("../../client-side/src"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var sql = new Database();
var sk = fs.readFileSync('../sessionkey.txt','utf8');
app.use(session({
	cookieName: 'session',
	secret:sk,
	duration: 30*6*1000,
	activeDuration: 5*60*1000,
}));
app.use(function(req,res,next){	
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();	
});


app.get('/search',function(req,res){
	sql.once('search',function(html){
		console.log('got search emit with:',html);
		res.send(html);
	});

	sql.getBooks(req);
});

//session part
app.post('/login',function(req,res){
	sql.once('loggedin',function(msg){
		if(msg==0){
			req.session.msg = "Invalid login";
		}
		else{
			req.session.userid=msg[0].id;
			console.log(req.session.userid);
			return res.redirect('/getUser');
		}
	});
	console.log(req.body.password);
	sql.login(req.body.username,req.body.password);
});

app.post('/signup',function(req,res){

	sql.once('duplicate',function(msg){
		if(msg==0){
			res.send(0);
		}
		else{
			res.send(1);
		}
	})
	sql.signup(req.body.name, req.body.email, req.body.password);

});

app.get('/getUser',function(req,res){
	var Id = req.session.userid;
	//res.status(200).send(id.toString());
	res.send(Id.toString());
});


app.get('/logout',function(req,res){
	req.session.reset();
	req.session.msg = 'Logged out';
	return res.redirect('/')
});

app.get('/personal',function(req,res){
	
});
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
	sql.once('books_have',function(html){
		res.send(html);
	});
	sql.booksHave(Id);
});

app.listen(8080,function(){
	console.log("listening on port 8080");
});
