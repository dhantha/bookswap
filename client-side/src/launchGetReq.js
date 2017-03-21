// dumb object to wrap GET arguments
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
<<<<<<< HEAD
  console.log('doCB',doCb);
=======
>>>>>>> parent of 6d7318c... fix merge

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
  }
  else{
    console.log('bad endpoint: ' + endpoint)
    return
  }

  $.ajax({
<<<<<<< HEAD
   type: 'GET', 
   url : URL, 
   success: function(msg){
              console.log('launchGetReq success')
              updateSearchResults(msg)
            }, 
   error: function(jgXHR, textStatus, errorThrown){
            console.log('launchGetReq error')
            alert('Error: ' + textStatus + '\n' + errorThrown)
          }
  }) //end ajax
} //end launch get req
=======
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
      })
}
>>>>>>> parent of 6d7318c... fix merge
