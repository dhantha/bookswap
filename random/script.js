var express = require('express');
var app = express();
app.use(express.static("."));

var database = require('./database');
var sql = new database();

app.post("/display",function(req, res) {
	sql.once('doneTable', function(html){
		res.send(html);
	});

	sql.printTable(req.query.table);
});//end display tables


app.post("/report",function(req, res) {
	sql.once('doneTranscript', function(html){
		res.send(html);
	});

	sql.getTranscript(req.query.id,req.query.term);
});//end get transcript


app.post("/", function(req, res) {
	sql.once('doneStudents', function(html) {
		res.send(html);
	});

	sql.loadStudents();
});//end load students


app.listen(8080,function(){
	console.log('Server Running...');
});