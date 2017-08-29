"use strict";
import React from "react";
import PropTypes from "prop-types";
import style from "styles/messageView.scss"

const MessageView = (props) => {

    let messages = props.messages.map((message, i) => {
      return (
        <li class={style.message} key={i}>
          <span class={style.msgLabel}>{message.nameUser}</span>:  {message.text}
        </li>
    )})

    return (
    	<div class={style.container}>
	    	<ul class={style.msgCont}>
	    		{messages}
	    	</ul>
	    </div>
    );
}

MessageView.propTypes = {
  messages: PropTypes.array
};

export default MessageView;
