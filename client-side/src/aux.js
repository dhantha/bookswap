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
}
