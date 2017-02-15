"use strict";
import React from "react";
import axios from 'axios';
import { browserHistory } from 'react-router';



export default class Login extends React.Component {
  
  constructor(props) {
  	super(props);
  	this.state = {name : '', password: '', userName : ''};
  
  	this.handleChangeName = this.handleChangeName.bind(this);
  	this.handleChangePass = this.handleChangePass.bind(this);
  	this.handleUserLogin = this.handleUserLogin.bind(this);
    this.handleLoginError = this.handleLoginError.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  	 
  	}


    handleChangeName(event) {
  		this.setState({name : event.target.value});
  		//console.log(this.state.name);
  	}

  	handleChangePass(event) {
  		this.setState({password : event.target.value});
  		//console.log(this.state.password);
  	}

    handleUserLogin(userData, userAuth){
      this.props.onUserLogin(userData, userAuth);
    }

    handleLoginError() {
      this.refStatusBar.innerHTML = "Wrong user name or password!";

      setInterval(function(){ 
        this.refStatusBar.innerHTML = '';           
      }, 5000);
    }

    onSubmit(event) {
  		
  		event.preventDefault();

  		let userData = undefined;
      let userAuth = undefined;

      axios.post('/api/auth', { name: this.state.name, password: this.state.password })
    			.then((resp) => {
      			
    			  userData = {
    						"name" : resp.data.user
    				};

    				userAuth = {
    						loggedIn: true,
                TOKEN : resp.data.token
    				};

            this.handleUserLogin(userData, userAuth);
        })

			.catch(function(err) {
				
        //this.handleLoginError();

      });

		  this.setState({name : '', password: ''});
    }

  render() {

 	return (
      	<div class="row">
		   	<div class="loginFormCont text-center">		
      			<form onSubmit = {this.onSubmit}> 
	   				<h1>Login</h1>
			   		<hr/>
			   		<div class="form-group">
			      		<label for="room">Name:</label>
			      		<input onChange={this.handleChangeName} value={this.state.name} type="text" class="form-control" name="name" placeholder="Enter name or email" required/>
			    	</div>
			    	<div class="form-group">
			      		<label for="desc">Password:</label>
			      		<input onChange={this.handleChangePass} value={this.state.password} type="password" class="form-control" name="password" placeholder="Enter password" required/>
			    	</div>
			    	<button type="submit" class="btn btn-default newRoomBtn">Submit</button>
            <div class="statusBar" ref={(ref) => this.refStatusBar = ref}></div>
		  		</form>
	  		</div>
	  </div>
    );
  }
}