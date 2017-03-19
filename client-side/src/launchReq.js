// dumb object to wrap arguments
// http://host:port/endpoint?name=val
function argObj(_name, _val){
  this.name = _name
  this.val  = _val
}

// Launch general GET request
// input:  endpoint (string), callback (function(arg)), argObjs...
// output: none
// sidefx: launches asynchronous GET request
function launchGetReq(){
  if (arguments.length < 2)
    return;

  var doCb = arguments[1]
  console.log('doCb',doCb);

  var URL
  var endpoint = arguments[0]
  if (endpoint == 'search'){
    URL = 'http://localhost:8080/' 
       + endpoint 
       + '?' 
    for (var i = 2 ; i < arguments.length ; i++){
      var obj
      obj = arguments[i]
      if (obj.val.length > 0){
        URL += obj.name + '=' + encodeURIComponent(obj.val)
        if (i != arguments.length - 1)
          URL += '&'
      }
    }
  }//end if
  else{
    console.log('bad endpoint: ' + endpoint)
    return
  }

  $.ajax({
   type: 'GET', 
   url : URL, 
   success: function(msg){
              console.log('launchGetReq success')
              doCb(msg)
            }, 
   error: function(jgXHR, textStatus, errorThrown){
            console.log('launchGetReq error')
            alert('Error: ' + textStatus + '\n' + errorThrown)
          }
  }) //end ajax
} //end launch get req

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
