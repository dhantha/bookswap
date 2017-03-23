// dumb
function noFn(arg){
  // dumb
}

// fwd to page
function loadPage(url){
  window.location = url
}

function loadNav(msg) {
	console.log('call loadNav');
	$("#navLinks").html(msg);

	$('#logoutLnk' 		 ).click(function(ev){ doLogout() })
	$('#signupLnk'       ).click(function(ev){ doSignup() })
	$('#loginLnk'        ).click(function(ev){ doLogin() })
	$('#profileLnk'      ).click(function(ev){ doProfile() })
}

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

