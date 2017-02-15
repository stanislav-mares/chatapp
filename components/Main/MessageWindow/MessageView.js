"use strict";
import React from "react";
import styles from "../../../public/css/style.css"

import io from 'socket.io-client';

export default class MessageView extends React.Component {
  
  constructor(props) { 
      super(props);
      /*
      this.state = { messages : this.props.messages};
      
      this.props.socket.on('new message', (msg) => {
          let list = Object.assign([], this.state.messages);
          list.push(msg);
          this.setState({messages : list}); 
      });
      */ 
  }

  render() {

      const messages = this.props.messages.map((message, i) => {

      return (
        <li class="list-group-item" key={i}>
          <span class="bold px16">{message.nameUser}</span>:  {message.text}
        </li>
      )})

    return (
    	<div>
	    	<ul class="list-group scrollAbleList">
	    		{messages}
	    	</ul>
	    </div>  
    );
  }
}