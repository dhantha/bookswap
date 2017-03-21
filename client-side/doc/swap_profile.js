$(document).ready(function(){
	var ID = decodeURIComponent(window.location.search.substring(1)); // this should be the user id

	$.ajax({
		url: "http://localhost:8080/User",
		dataType: 'jsonp',
		data: {id:ID},
		error: function(){
			// indicate there is an error
		},
		success: function(data){
			$("name").innerHTML(data.name);
			$("email").innerHTML(data.email);
		},
		type: 'POST'
	});
});