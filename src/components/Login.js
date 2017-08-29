"use strict";
import React from "react";
import PropTypes from "prop-types";
import axios from 'axios';
import { browserHistory } from 'react-router';

import style from 'styles/login.scss';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
  	this.state = {name : '', password: '', userName : ''};

  	this.handleChangeName = this.handleChangeName.bind(this);
  	this.handleChangePass = this.handleChangePass.bind(this);
  	this.handleUserLogin = this.handleUserLogin.bind(this);
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

    handleUserLogin(userName, token){
      this.props.onUserLogin(userName, token);
    }

    onSubmit(event) {

  		event.preventDefault();

      axios.post('/api/auth', { name: this.state.name, password: this.state.password })
    			.then((resp) => {
            //console.log(`${resp.data.user}, ${resp.data.token}`);
            this.handleUserLogin(resp.data.user, resp.data.token);
        })

			.catch((err) => {
        console.log(err);
      });

      this.setState({name : '', password: ''});
    }

  render() {

 	return (
		   	<div class={style.container}>
      			<form class={style.formCont} onSubmit ={this.onSubmit}>
            <div class={style.header}>
              <h1>Login</h1>
            </div>
            <div class={style.body}>
              <div class={style.inputCont}>
                <div>
                    <label for="room">Name:</label>
    			      		<input
                      onChange={this.handleChangeName}
                      value={this.state.name}
                      type="text"
                      name="name"
                      placeholder="Enter name or email"
                      required
                    />
    			    	</div>
    			    	<div>
                    <label for="desc">Password:</label>
                    <input
                      onChange={this.handleChangePass}
                      value={this.state.password}
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                    />
    			    	</div>
                <button type="submit" class={style.btn}>Submit</button>
              </div>
            </div>
			    </form>
	  		</div>
    );
  }
}

Login.propTypes = {
    onUserLogin: PropTypes.func
};
