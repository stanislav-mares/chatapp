"use strict";
import React from "react";
import PropTypes from "prop-types";
import style from "styles/messageEnter.scss"

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
    	<div class={style.container}>
	    	<form class={style.formCont} onSubmit={this.handleSubmit}>
          <textarea rows="5" cols="30" type="text" class={style.textarea}
            value={this.state.value}
            placeholder="Enter a message"
            onChange={this.handleChange}>
          </textarea>
          <button type="submit" class={style.btn}>Send</button>
        </form>
	    </div>
    );
  }
}

MessageEnter.propTypes = {
    sendMessage: PropTypes.func.isRequired
};
