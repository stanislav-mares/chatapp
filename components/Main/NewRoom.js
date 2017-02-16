"use strict";
import React from "react";
import { Link } from 'react-router';
import styles from "../../public/css/style.css"

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

  			let newRoom = {name: this.state.roomValue,
  						   desc: this.state.descValue,
  						  }

  			this.props.sendRoom(newRoom);

  			newRoom = [];
		}

		this.setState({roomValue: '', descValue: ''});
	}


  	render() {

      return (
	    	<div class="text-center newRoomFormCont">
	    		<h2>New Room</h2>
	    		<form class="newRoomForm" onSubmit={this.onSubmit}>
			   		<div class="form-group">
			      		<label for="room" class="title">New room:</label>
			      		<input onChange={this.handleChange} value={this.state.roomValue} type="text" class="form-control" name="room" placeholder="Enter room name"/>
			    	</div>
			    	<div class="form-group">
			      		<label for="desc">Description:</label>
			      		<textarea onChange={this.handleChange} value={this.state.descValue} class="form-control custom-control messageInput" name="desc" rows="3" placeholder="Description  of the room"></textarea>
			    	</div>
			    		<button type="submit" class="btn btn-default newRoomBtn">Submit</button>
			  			<Link to="/chat" class="btn btn-default newRoomBtn">Back</Link>
			  	</form>
	    	</div>  
	    );
  	}
}