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

db.connect(function(err) {
	if (err) {
	console.log("Error connecting to database");
	}
	else {
	console.log("Database successfully connected");
	}
});//connect to database

function Database(){
	EventEmitter.call(this);
}

utils.inherits(Database, EventEmitter);

var response = "";

Database.prototype.printTable = function(table) {

	var self = this;
	var html = "";
	var cols = [];

	db.query('SELECT * from '+table,
	function(err, rows, fields) {
		if (err) {
		html += 'Error during display processing:<br>'+err;
		}
		
		else {
		html += "<table><tr>";

		for(var i = 0; i < fields.length; i++) {
			html += "<th>" + fields[i].name + "</th>";
			cols.push(fields[i].name);
		}//end for fields

		html += "</tr>";

		for(var j = 0; j < rows.length; j++) {
			html += "<tr>";
			for(var k = 0; k < cols.length; k++) {
				html += "<td>" + rows[j][cols[k]] + "</td>";
			}
			html += "</tr>";
		}//end for rows


		}//end else

		html += "</table>";

		self.emit('doneTable',html);

	});//end query
}//end printTable


Database.prototype.getTranscript = function(id,term) {

	var self = this;
	var html = "";
	var cols = [];

	db.query('select student.id, student.firstName, student.lastName, grades.term, grades.courseid, course.title, grades.grade from student, course, grades where student.id = grades.studentid and grades.courseid = course.id and grades.term = \''+term+'\' and student.id = \''+id+'\';',
	function(err, rows, fields) {
		if (err) {
		html += 'Error during transcript processing:<br>'+err;
		}
		
		else {
		html += "<table><tr>";

		for(var i = 0; i < fields.length; i++) {
			html += "<th>" + fields[i].name + "</th>";
			cols.push(fields[i].name);
		}//end for fields

		html += "</tr>";

		for(var j = 0; j < rows.length; j++) {
			html += "<tr>";
			for(var k = 0; k < cols.length; k++) {
				html += "<td>" + rows[j][cols[k]] + "</td>";
			}
			html += "</tr>";
		}//end for rows


		}//end else

		html += "</table>";

		self.emit('doneTranscript',html);

	});//end query
}//end getTranscript


Database.prototype.loadStudents = function() {

	var self = this;
	var html = "";
	var cols = [];

	db.query('select id, firstName, lastName from student;',
	function(err, rows, fields) {
		if (err) {
		html += 'Error during student processing:<br>'+err;
		}
		
		else {
		for(var j = 0; j < rows.length; j++) {
			html += '<option value="' + rows[j].id + '">'
			+ rows[j].firstName + ' '
			+ rows[j].lastName + '</option>';
		}//end for rows
		}//end else

		self.emit('doneStudents',html);

	});//end query
}//end loadStudents


module.exports = Database;