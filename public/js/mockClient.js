"use strict";

function httpGetAsync(theUrl, path, method, data, headerData, callback)
{
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function() { 
       
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            
            callback(xmlHttp.responseText);
               
        }
    }

    switch(method) {
        case "GET":
            
            xmlHttp.open(method, theUrl + path, true); 
            xmlHttp.send(null);
            break;
        
        case "POST":
            
            xmlHttp.open(method, theUrl + path, true);
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded",
                                     "Authorization", headerData);
            if(data){
                xmlHttp.send(data);
            }else {
                xmlHttp.send(null);
            }
            break;

        case "DELETE":
    
            
            xmlHttp.open(method, theUrl + path, true);
            xmlHttp.send(null);
            break;
    }
    
    
}


/* GET
httpGetAsync("http://private-01a11-chatappapi.apiary-mock.com", '/api/users', "GET", null, null, function(jsonText) {
    var jsonData = JSON.parse(jsonText);
    console.log(jsonData);
});
*/

/* POST 1
var data = { "name": "Bob",
             "password": "askdgnsdg5asdg5as4d",
             "email": "Bob@gmail.com" };

httpGetAsync("http://private-01a11-chatappapi.apiary-mock.com", '/api/signup', "POST", data, null, function(jsonText) {
    var jsonData = JSON.parse(jsonText);
    console.log(jsonData);
});
*/

/*POST 2
httpGetAsync("http://private-01a11-chatappapi.apiary-mock.com", '/api/authtest', "POST", null, "TOKEN", function(jsonText) {
    var jsonData = JSON.parse(jsonText);
    console.log(jsonData);
});
*/

/*DELETE*/
/*
var nameRoom = 'Sport';

httpGetAsync("http://private-01a11-chatappapi.apiary-mock.com", '/api/room-delete/' + nameRoom, "DELETE", null, null, function(jsonText) {
    var jsonData = JSON.parse(jsonText);
    console.log(jsonData);
});
*/
