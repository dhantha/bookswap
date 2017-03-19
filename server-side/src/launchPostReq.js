// Launch POST request
// input:  endpoint (string), callback (function(arg)), ID
// output: none
// sidefx: launches asynchronous GET request
function launchPostReq(){
  if (arguments.length < 3)
    return;

  var doCb = arguments[1]
  console.log('doCb', doCb);

  var endpoint = arguments[0]
  var ID = arguments[2]
  var URL = 'http://localhost:8080/' + endpoint

  $.ajax({
   type: 'POST', 
   url : URL, 
   datatype: 'jsonp',
   data: {id:ID}, 
   success: function(msg){
              console.log('launchPostReq success')
              doCb(msg)
            }, 
   error: function(jgXHR, textStatus, errorThrown){
            console.log('launchPostReq error')
            alert('Error: ' + textStatus + '\n' + errorThrown)
          }
  }) // end ajax
} // end launchPostReq
