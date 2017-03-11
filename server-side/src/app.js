var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static("."));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password : '',
	database : 'cs275'
});


conn.connect(function(err){
	if(err){
		console.log("Error connecting to the db");
	}
	else{
		console.log("db connection was successful");
	}
});

app.use(function(req,res,next){	
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();	
});


app.get('/search',function(req,res){
	var title = req.query.title;
	var author = req.query.author;
	var isbn = req.query.isbn;
	
	var query = "select * from book where book.title=" + conn.escape(title) + " or book.author=" + conn.escape(author) + " or book.isbn=" + conn.escape(isbn);
	conn.query(query,function(err,rows,fileds){
		// need to populate the table 
		
	});
});

app.listen(8080,function(){
	console.log("listening on port 8080");
});