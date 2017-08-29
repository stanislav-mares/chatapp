"use strict";
import React from "react";
import PropTypes from "prop-types";
import MessageView from "components/Main/MessageWindow/MessageView";
import MessageEnter from "components/Main/MessageWindow/MessageEnter";

import style from "styles/messageWindow.scss";

const MessageWindow = (props) => {

  let activeRoom = '';
  if (props.activeRoom.name.length > 0) {
    activeRoom = props.activeRoom.name;
  }else {
    activeRoom = 'No room selected!';
  }

  return (
    	<section class={style.container}>
        <div class={style.head}>
          <div class={style.titleCont}>
            <h2>Room: {activeRoom}</h2>
            <h4>{props.activeRoom.desc}</h4>
          </div>
        </div>
        <div class={style.body}>
          <MessageView messages={props.activeRoom.messages}/>
      		<MessageEnter sendMessage={props.sendMessage}/>
        </div>
    	</section>
    );
}

MessageWindow.propTypes ={
  activeRoom:  PropTypes.shape({
                  name: PropTypes.string.isRequired,
                  desc: PropTypes.string,
                  messages: PropTypes.array.isRequired
  }),
  sendMessage: PropTypes.func,
};

export default MessageWindow;
