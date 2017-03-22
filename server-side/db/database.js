var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var bodyParser = require('body-parser');

var fs = require('fs');
var pw = fs.readFileSync('../pw.txt','utf8').trim();

var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: pw,
  database: 'bookswap'
});

db.connect(function(err){
  if(err){
    console.log('Error connecting to the db: ',err);
  }
  else{
    console.log('Connected to db');
  }
});

function Database(){
  EventEmitter.call(this);
}

utils.inherits(Database, EventEmitter);

Database.prototype.getBooks = function(req){
  var self = this;
  var html = '';
  var cols = [];

  var title = req.query.title;
  var author = req.query.author;
  var isbn = req.query.isbn;
  
  var qry = 'SELECT * FROM books,users WHERE'; 
  var tmp = ''
  if (req.query.title){
    if (tmp.length != 0)
      tmp += ' AND '
    tmp += ' books.title regexp '  + db.escape(title);
  }
  if (req.query.author){
    if (tmp.length != 0)
      tmp += ' AND'
    tmp += ' books.author regexp ' + db.escape(author);
  }
  if (req.query.isbn){
    if (tmp.length != 0)
      tmp += ' AND '
    tmp += ' books.isbn='          + db.escape(isbn);
  }
  qry += tmp
  qry +=  ' and books.status=\'1\' and books.ownerid=users.id';
  
  console.log(qry);
  
  db.query(qry, function(err,rows,fields){
    if(err) throw err;
    //

    if(rows.length == 0) { 
      html  = "<h3>Sorry! No results found.</h3>";
      self.emit('search',html);
    }

    html += '<table class="table table-bordered"><tr>';
    html += '<th>Title</th><th>Author</th><th>ISBN</th><th>Owner</th>';
    html += '<book>';

//    var result = json.parse(json.stringify(rows));
    var result = rows;
    console.log(rows.length);
    for(var j=0; j < rows.length; j++){
      html += '<tr>';
      html += '<td>' + result[j].title + '</td>';
      html += '<td>' + result[j].author + '</td>';
      html += '<td>' + result[j].isbn + '</td>';
      html += '<td><a href=\'profile.html?id=' 
            + result[j].ownerid + '\'>' 
            + result[j].name 
            + '</a></td>';
//    html += '<td><a href=\'profile.html\'>' + result[j].name + '</a></td>';
      html += '</tr>';
    }
    html += '</table>';
    
    self.emit('search',html);

  });//query

}//end function

Database.prototype.getUser = function(ID){
  var self = this;
  var userID = ID;
  var qry = 'select name,email from users where users.id=' + db.escape(userID)
  console.log(qry)
  db.query(qry,
    function(err,rows,fields){
      if(err) 
        throw err;

      var User = {
        'name' :rows[0].name,
        'email':rows[0].email
      }
      self.emit('user_profile', User);
    }
  )
}

Database.prototype.booksWant = function(ID){
  var self = this;
  var userID = ID;
  var html = '<table><tr>'
           + '<th>Title</th><th>Author</th><th>ISBN</th><th>Remove?</th>'
           + '</tr>'
  var qry = 'select * from books where ownerid=' + db.escape(userID)
          + 'and status=\'0\''
  console.log(qry)
  db.query(qry, function(err,rows,fields){
    for(var j=0; j < rows.length; j++){
      html += '<tr>'
      html += '<td>' + rows[j].title  + '</td>'
      html += '<td>' + rows[j].author + '</td>'
      html += '<td>' + rows[j].isbn   + '</td>'
      html += '<td>'
            + '<input id=\'wantRmBox_' + rows[j].bookid + '\' '
            + 'class=\'wantRmBox\' '
            + 'type=\'checkbox\' '
            + 'value=\'' + rows[j].bookid + '\'>'
            + '</td>'
      html += '</tr>'
    }
    html += '</table>'
    self.emit('books_want',html);
  })
}

Database.prototype.booksHave = function(ID){
  var self = this;
  var userID = ID;
  var html = '<table><tr>'
           + '<th>Title</th><th>Author</th><th>ISBN</th><th>Remove?</th>'
           + '</tr>'
  var qry = 'select * from books where ownerid=' + db.escape(userID)
          + 'and status=\'1\''
  console.log(qry)
  db.query(qry, function(err,rows,fields){
    for(var j=0; j < rows.length; j++){
      html += '<tr>'
      html += '<td>' + rows[j].title  + '</td>'
      html += '<td>' + rows[j].author + '</td>'
      html += '<td>' + rows[j].isbn   + '</td>'
      html += '<td>'
            + '<input id=\'haveRmBox_' + rows[j].bookid + '\' '
            + 'class=\'haveRmBox\' '
            + 'type=\'checkbox\' '
            + 'value=\'' + rows[j].bookid + '\'>'
            + '</td>'
      html += '</tr>'
    }
    html += '</table>'
    self.emit('books_have',html);
  })
}

Database.prototype.login = function(username,password){
  var self = this
  var qry = 'SELECT id from users WHERE email = \'' 
          + username 
          + '\' AND password = \'' 
          + password + '\';'
  console.log(qry)
  db.query(qry,function(err,rows,fields){
    if (err){
      console.log('Error during query processing')
      return 0;
    }
    else
      if (0 < rows.length)
        self.emit('loggedin', rows[0].id)
      else
        self.emit('loggedin', -1)
  });
}

Database.prototype.signup = function(username,email,password){
  var self = this
  var qry ='SELECT id from users WHERE email = \'' + email +'\';';
  console.log(qry)
  db.query(qry,function(err,rows,fields){
    if (err){
      console.log('Error during query processing');
      return 0;
    }
    else{
      if (0 < rows.length)
        self.emit('duplicate', 0);
      else{
        qry = 'INSERT INTO users (name, email, password) VALUES ('
            + db.escape(username) + ', '
            + db.escape(email)    + ',' 
            + 'PASSWORD('
            + db.escape(password) 
            +'));'
        console.log(qry)
        db.query(qry, function(err, rows, fields){
          if (err){
            console.log('Error during query processing')
            return 0
          }
          else{ 
            qry = 'SELECT id FROM users WHERE '
                + 'name=' + db.escape(username) + ' AND '
                + 'email=' + db.escape(email) + ';'
            console.log(qry)
            db.query(qry, function(err, rows, fields){
              if (err)
                throw err
              else{
                self.emit('duplicate', rows[0].id)
              }
            })
          }
        })
      }
    }
  });
  //add auto increasement to the id in database
}

Database.prototype.addBook = function(userid, title, author, isbn, sts){
  var self = this
  var qry = 'INSERT INTO books (title, author, ownerid, isbn, status) '
          + ' values ('
          + '\'' + title  + '\','
          + '\'' + author + '\','
          + '\'' + userid + '\','
          + '\'' + isbn   + '\','
          + '\'' + sts    + '\''
          + ');'
  console.log(qry)
  db.query(qry, function(err, rows, fields){
    if (err)
      throw err
    else
      self.emit('add_book')
  })
}

Database.prototype.rmBooks = function(ID, sts, books){
  var self = this
  if (books.length == 0){
    self.emit('rm_book')
    return
  }

  books = books.split(',')

  var qry = 'DELETE FROM books WHERE bookid=\'' + books[0] + '\' '
  for (var i = 1 ; i < books.length ; i++)
    qry += 'OR bookid=\'' + books[i] + '\' '
  qry += 'AND ownerid=\'' + ID + '\' '
  qry += 'AND status=\'' + sts + '\';'
  console.log(qry)
  db.query(qry, function(err, rows, fields){
    if (err)
      throw err
    else
      self.emit('rm_book')
  })
}

module.exports = Database;
