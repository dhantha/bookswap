var express    = require('express')
var bodyParser = require('body-parser')
var Database   = require('../db/database')
var session    = require('client-sessions')

var app = express()
app.use(express.static("../../client-side/src"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(session({
    cookieName: 'session', // sha256 of 'bookswap'
    secret: '7303cf3fdd688c1901d7a5dd3eb7f9bddbb8a16cdf14346e57d3d1eb1ad24cac', 
    duration: 30*60*1000, 
    activeDuration: 5*60*1000, 
  })
)


var sql = new Database()

app.use(function(req,res,next){	
    res.setHeader('Access-Control-Allow-Origin', 
                  'http://localhost:8080')
    res.setHeader('Access-Control-Allow-Methods', 
                  'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 
                  'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', 
                   true)
    res.setHeader('X-Content-Type-Options', 
                  'nosniff')
    next();	
})


app.get('/search',function(req,res){
	sql.once('search',function(html){
		console.log('got search emit with:',html)
		res.send(html)
	})

	sql.getBooks(req)
})

// session part
app.post('/login',function(req,res){
	sql.once('loggedin',function(msg){
    if (msg < 0){
			req.session.msg = "Invalid login"
			return res.redirect('/')
		}
		else{
      console.log('here: ' + req.body.email)
			req.session.userid = msg
			return res.redirect('/getUser')
		}
	})
	sql.login(req.body.email, req.body.pword)
})

app.post('/signup',function(req,res){

	sql.once('duplicate',function(msg){
		if(msg==0){
			res.send(0)
		}
		else{
			res.send(1)
		}
	})
	sql.signup(req.body.name, req.body.email, req.body.password)
})

app.get('/getUser',function(req,res){
	if(!req.session.userid){
		req.session.msg='No userid, no access'
		return res.redirect('/')
	}

  var url = '/profile.html?id=' + req.session.userid
  console.log(url)
	return res.send(url)
})


app.get('/logout',function(req,res){
	req.session.reset()
	req.session.msg = 'Logged out'
	return res.redirect('/')
})

app.get('/personal',function(req,res){
	var Id = req.session.userid
	sql.once('user_profile',function(user){
		res.json(user)
	})
	sql.getUser(Id)
})

// populate the user page
app.post('/User',function(req,res){
	var ID = req.body.id
	sql.once('user_profile',function(user){
		res.json(user)
	})
	sql.getUser(ID)
})

app.post('/booksWant',function(req,res){
	var ID = req.body.id
	sql.once('books_want',function(html){
		res.send(html)
	})
	sql.booksWant(ID)
})

app.post('/booksHave',function(req,res){
	var ID = req.body.id
	sql.once('books_have',function(html){
		res.send(html)
	})
	sql.booksHave(ID)
})

app.listen(8080,function(){
	console.log('listening on port 8080')
})
