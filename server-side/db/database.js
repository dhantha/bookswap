var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var bodyParser = require('body-parser');


var fs = require('fs');
var pw = fs.readFileSync('../pw.txt','utf8'); // change this if i commit this without changing

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

Database.prototype.getUser = function(ID){
	var self = this;
	var userID = ID;
	db.query("select name,email from users where users.id="+ db.escape(userID),function(err,rows,fields){
		if(err) throw err;
		var User = {
			name:rows.name,
			email:rows.email
		}
		self.emit('user_profile',User);
	});
}

Database.prototype.booksWant = function(ID){
	var self = this;
	var userID = ID;
	var html = "";
	html += "<table><tr>";
	html += "<th>Title</th><th>Author</th><th>ISBN</th>";
	html += "</tr>";
	db.query("select * from books, users where users.id=books.ownerid and books.status='0'",function(err,rows,fields){
		for(var j=0; j < rows.length; j++){
			html += "<tr>";
			html += "<td>" + result[j].title + "</td>";
			html += "<td>" + result[j].author + "</td>";
			html += "<td>" + result[j].isbn + "</td>";
			html += "</tr>";
		}
		html += "</table>";
	});
	self.emit('books_want',html);
}

Database.prototype.booksHave = function(ID){
	var self = this;
	var userID = ID;
	var html = "";
	html += "<table><tr>";
	html += "<th>Title</th><th>Author</th><th>ISBN</th>";
	html += "</tr>";
	db.query("select * from books, users where users.id=books.ownerid and books.status='1'",function(err,rows,fields){
		for(var j=0; j < rows.length; j++){
			html += "<tr>";
			html += "<td>" + result[j].title + "</td>";
			html += "<td>" + result[j].author + "</td>";
			html += "<td>" + result[j].isbn + "</td>";
			html += "</tr>";
		}
		html += "</table>";
	});
	self.emit('books_have',html);
}

Database.prototype.login=function(username,password){
	var str ='SELECT id from Users WHERE email = \'' + username + '\' AND password = \''+password+'\';';
	con.query(str,function(err,rows,fields){
		if (err){
			console.log('Error during query processing');
			return 0;
		}
		else
			if (rows.lenth>0)
				self.emit('loggedin',1);
			else
				self.emit('loggedin',0)
	});
}

Database.prototype.signup = function(username,email,password){
	var str ='SELECT id from Users WHERE email = \'' + email +'\';';
	con.query(str,function(err,rows,fields){
		if (err){
			console.log('Error during query processing');
			return 0;
		}
		else{
			if (rows.lenth>1)
				self.emit('duplicate',0);
			else{
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
				var str = 'INSERT INTO Users (name,email,password) valuse (\''+username+ '\',\''+email+ '\',PASSWORD(\''+password+'\'));';
=======
				var str = 'INSERT INTO Users (name,email,password) valuse (\''+username+ '\',\''+email+ '\',\''+password+'\');';
>>>>>>> parent of f37e67b... login update
				con.query(str,function(err,rows,fields){
=======
				var str = 'INSERT INTO Users (name,email,password) valuse (\''+username+ '\',\''+email+ '\',\''+password+'\');';
				db.query(str,function(err,rows,fields){
>>>>>>> parent of 6d7318c... fix merge
=======
				var str = 'INSERT INTO Users (name,email,password) valuse (\''+username+ '\',\''+email+ '\',\''+password+'\');';
				db.query(str,function(err,rows,fields){
>>>>>>> parent of 6d7318c... fix merge
					if (err){
						console.log('Error during query processing');
						return 0;
					}
					else 
						self.emit('duplicate',1);
				});
			}
		}
	});
	//add auto increasement to the id in database
}
module.exports = Database;