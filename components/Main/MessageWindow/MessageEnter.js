"use strict";
import React from "react";

import io from 'socket.io-client';

export default class MessageEnter extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(message) {
    this.props.sendMessage(message);
  }

  handleSubmit(event) {
     event.preventDefault();
     
     const message = {
        
        "id" : '',
        "text" : this.state.value,
        "nameUser" : '',
        "nameRoom" : '',
        "time" : new Date().toString()    
     
     }

     if(message.text.trim() != '') {
        this.handleMessage(message); 
     }
     
      
     this.setState({value: ''});
  }

   handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
    	<section>
	    	<form onSubmit={this.handleSubmit}>
	    		
    			<div class="messageInputCont">
            <textarea rows="3" type="text" class="form-control messageInput" value={this.state.value} 
                   placeholder="Enter a message" onChange={this.handleChange}></textarea>
      			<button type="submit" class="btn btn-primary">Submit</button>			
	    	  </div>
        </form>
	    </section>  
    );
  }
}