"use-strict";
/*
document.getElementsByClassName("clickableList").addEventListener("click", changeStyle(event));

function changeStyle(event) {
	event.preventDefault();
	event.target.style.background = "#18bc9c";
	event.target.style.color = "white"; 
}
*/

messages = [{_id: 1, text: "ldfjasldf"}, {_id: 2, text:"ldfjasldf"}, {_id: 3, text:"ldfjasldf"}];

var getMessagesID = function(messages) {

	messages = messages.map((message) => {
	    return (
	      message._id
	    ) 
  	})

  	return messages;
};

console.log(getMessagesID(messages));