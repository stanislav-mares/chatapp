"use strict";
import React from "react";
import styles from "../../public/css/style.css"

import MessageView from "./MessageWindow/MessageView";
import MessageEnter from "./MessageWindow/MessageEnter";

export default class MessageWindow extends React.Component {
  
  constructor(props) {
  	super(props);

  }

  render() {
  
   return (
    	<div class="MessageWindow">
    		<h2 class="title">Room: <span class="bold">{this.props.activeRoom.name}</span></h2>
        <h4>{this.props.activeRoom.desc}</h4>
        <MessageView messages={this.props.activeRoom.messages}/>
    		<MessageEnter sendMessage={this.props.sendMessage}/>
    	</div>  
    );
  }
}