$(document).ready(function(){
	var ID = decodeURIComponent(window.location.search.substring(1)); // this should be the user id

  launchPostReq('User',      updateNameEmail, ID);
  launchPostReq('booksWant', updateBooksWant, ID);
  launchPostReq('booksHave', updateBooksHave, ID);
})
