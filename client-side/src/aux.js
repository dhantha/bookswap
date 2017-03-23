// dumb
function noFn(arg){
  // dumb
}

// fwd to page
function loadPage(url){
  window.location = url
}

function loadNav(id) {
	console.log('call loadNav');

	// different nav links if you are logged in/out
	var navHtml="";

	if(id == undefined || id == 0) {
		navHtml += "<li><a id='signupLnk' href='signup.html'>Sign up</a></li>";
		navHtml += "<li><a id='loginLnk' href='login.html'>Log in</a></li>";
	}
	else {
		navHtml += "<li><a id='profileLnk' href='profile.html'>Edit profile</a></li>";
		navHtml += "<li><a id='logoutLnk' href='#'>Log out</a></li>";
	}

	navHtml += "<li><a id='searchLnk' href='/'>Search!</a></li>";

	$("#navLinks").html(navHtml);

	$('#logoutLnk' 		 ).click(function(ev){ doLogout() })
	$('#signupLnk'       ).click(function(ev){ doSignup() })
	$('#loginLnk'        ).click(function(ev){ doLogin() })
	$('#profileLnk'      ).click(function(ev){ doProfile() })

}//end loadNav

function hideUpdatePrivs(status) {
	// prevent list update privileges if you are not the correct user
	console.log('got status',status);

	if(status != "admin") {
	var style = $('<style>#haveRmBtn, #wantRmBtn, .table-rmCol tr td:nth-child(4), .table-rmCol tr th:nth-child(4) { display:none; } #update-wrapper { display:none; }</style>');
	$('html > head').append(style);
	}
}//end hideUpdatePrivs

function doSignup(){
	console.log('call doSignup');
	launchPostReq('signuppage', loadPage)
}

function doLogin(){
	console.log('call doLogin');
	launchPostReq('loginpage', loadPage)
}

function doProfile(){
	console.log('call doProfile');
	launchPostReq('profile', loadPage)
}

// tell server to log out
function doLogout(){
	console.log('call doLogout');
	launchPostReq('logout', loadPage)
}

