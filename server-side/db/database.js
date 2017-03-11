var EventEmitter = require('events').EventEmitter;
var utils = require('util');

var fs = require('fs');
var pw = fs.readFileSync('../pw.txt','utf8');

var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: pw,
	database: 'lab'
});

db.connect(function(err){
	if(err){
		console.log("Error connecting to the db");
	}
	else{
		console.log("Error connecting to the db");
	}
});

function Database(){
	EventEmitter.call(this);
}

utils.inherits(Database, EventEmitter);

Database.prototype.getBooks = function(req){
	var self = this;
	var html = "";
	var cols = [];

	var title = req.query.title;
	var author = req.query.author;
	var isbn = req.query.isbn;

	var qry = "select * from books,users where "; 
	if(req.query.title) qry += "books.title=" + db.escape(title);
	if(req query.author) qry += "books.author=" + db.escape(author);
	if(req.query.isbn) qry += "books.isbn=" + db.escape(isbn);
	qry +=  " and books.ownerid=users.id";
	db.query(qry, function(err,rows,fields){
		if(err) throw err;
		//
		html += "<table><tr>";
		html += "<th>Title</th><th>Author</th><th>ISBN</th><th>Owner</th>";
		html += "</tr>";

		var result = JSON.PARSE(JSON.stringify(rows));

		for(var j=0; j < rows.length; j++){
			html += "<tr>";
			html += "<td>" + result[i].title + "</th>";
			html += "<td>" + result[i].author + "</th>";
			html += "<td>" + result[i].isbn + "</th>";
			html += "<td>" + result[i].name + "</th>";
			html += "</tr>";
		}
		html += "</table>";
	});

	self.emit('search',html);
}