"use strict";

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.onreadystatechange = function() { 
       
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            
            callback(xmlHttp.responseText);
               
        }
    }
    
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    
	xmlHttp.send(null);
}

httpGetAsync("http://private-f0c63-testapi2719.apiary-mock.com/questions", function(jsonText) {
    var jsonData = JSON.parse(jsonText);
    //zde se budou zpracovavat data 
    //console.log(jsonData);
});