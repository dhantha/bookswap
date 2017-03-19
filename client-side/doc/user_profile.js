$(document).ready(function(){
  // grab user ID from URL
  var ID = decodeURIComponent(window.location.search.substring(1));

  launchPostReq('User',      updateNameEmail, ID);
  launchPostReq('booksWant', updateBooksWant, ID);
  launchPostReq('booksHave', updateBooksHave, ID);
})
