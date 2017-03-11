var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var bodyParser = require('body-parser');


var fs = require('fs');
var pw = fs.readFileSync('../pw.txt','utf8');

var mysql = require('mysql');
var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: pw,
	database: 'bookswap'
});

db.connect(function(err){
	if(err){
		console.log("Error connecting to the db: ",err);
	}
	else{
		console.log("Connected to db");
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
	
	console.log('got title',title);

	var qry = "select * from books,users where "; 
	if(req.query.title) qry += "books.title=" + db.escape(title);
	if(req.query.author) qry += "books.author=" + db.escape(author);
	if(req.query.isbn) qry += "books.isbn=" + db.escape(isbn);
	qry +=  " and books.status='1' and books.ownerid=users.id";
	
	console.log('query',qry);
	
	db.query(qry, function(err,rows,fields){
		if(err) throw err;
		//
		html += "<table><tr>";
		html += "<th>Title</th><th>Author</th><th>ISBN</th><th>Owner</th>";
		html += "</tr>";

// 		var result = json.parse(json.stringify(rows));
		var result = rows;

		for(var j=0; j < rows.length; j++){
			html += "<tr>";
			html += "<td>" + result[j].title + "</td>";
			html += "<td>" + result[j].author + "</td>";
			html += "<td>" + result[j].isbn + "</td>";
// 			html += "<td><a href=\"/user?id=" + result[j].ownerid + "\">" + result[j].name + "</a></td>";
			html += "<td><a href=\"profile.html\">" + result[j].name + "</a></td>";
			html += "</tr>";
		}
		html += "</table>";
		
		console.log('html',html);
	self.emit('search',html);

	});//query

}//end function

module.exports = Database;