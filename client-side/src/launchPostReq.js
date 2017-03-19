// dumb object to wrap arguments
// http://host:port/endpoint?name=val
function argObj(_name, _val){
  this.name = _name
  this.val  = _val
}

// Launch POST request
// input:  endpoint (string), callback (function(arg)), ID
// output: none
// sidefx: launches asynchronous GET request
function launchPostReq(){
  if (arguments.length < 3)
    return;

  var endpoint = arguments[0]
  var doCb = arguments[1]
  console.log('doCb', doCb);

  // build json out of arguments
  var json = '{\n  '
  for (var i = 2 ; i < arguments.length ; i++){
    json += '\"' + arguments[i].name + '\"' 
          + ':' 
          + '\"' + arguments[i].val + '\"' 
    if (i < arguments.length - 1)
      json += ', \n  '
    else
      json += '\n'
  }
  json += '}'

  console.log(json)
  var obj = JSON.parse(json)
  console.log(obj)

  var URL = 'http://localhost:8080/' + endpoint
  $.ajax({
   type: 'POST', 
   url : URL, 
   datatype: 'jsonp',
   data: obj, 
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
