"use strict";
import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router';

import style from "styles/newRoom.scss";

export default class NewRoom extends React.Component {

  	constructor(props) {

  		super(props);

  		this.state = {roomValue: '', descValue: ''};

  		this.handleChange = this.handleChange.bind(this);
  		this.onSubmit = this.onSubmit.bind(this);
  	}

  	handleChange(event) {

  		event.preventDefault();

  		if(event.target.name === 'room') {
  			this.setState({roomValue: event.target.value});
  		}else {
  			this.setState({descValue: event.target.value});
  		}

    }

  	onSubmit(event) {

  		event.preventDefault();

  		if (this.state.roomValue.length > 0) {

  			let newRoom = {
          name: this.state.roomValue,
  				desc: this.state.descValue,
  			}

  			this.props.sendRoom(newRoom);

  			newRoom = [];
		    }

		      this.setState({roomValue: '', descValue: ''});
	  }

    render() {
      return (
	    	<section class={style.container}>
          <div class={style.head}>
            <h2>New Room</h2>
          </div>
          <div class={style.body}>
            <form class={style.formCont} onSubmit={this.onSubmit}>
  			   		   <div class={style.inputCont}>
                    <div>
                      <label for="room">New room:</label>
      			      		<input
                        onChange={this.handleChange}
                        value={this.state.roomValue}
                        type="text" class="form-control"
                        name="room"
                        placeholder="Enter room name"
                      />
                    </div>
                    <div>
                      <label for="desc">Description:</label>
                      <textarea
                        class={style.textarea}
                        onChange={this.handleChange}
                        value={this.state.descValue}
                        name="desc"
                        rows="3"
                        placeholder="Description of the room">
                      </textarea>
                    </div>
                    <div class={style.btnCont}>
                      <button class={style.btn} type="submit">Submit</button>
        			  			<Link class={style.btn + ' ' + style.link} to="/chat">Back</Link>
                    </div>
                </div>
  			    </form>
          </div>
	    	</section>
	    );
  	}
}

NewRoom.propTypes = {
  sendRoom: PropTypes.func
};
