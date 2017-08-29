"use-strict";
import React from "react";
import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import Header from "components/Header";
import Footer from "components/Footer";
import Login from "components/Login";
import Home from "components/Home";
import axios from 'axios';

import style from "styles/app.scss";

export default class App extends React.Component {

  constructor(props) {
      super(props);

      this.activeUser = '';
      this.socket = io();
      this.onUserLogin = this.onUserLogin.bind(this);
      this.onUserLogout = this.onUserLogout.bind(this);
      this.renderChildren = this.renderChildren.bind(this);
      this.toggleBackground = this.toggleBackground.bind(this);
  }

  componentDidMount() {

    // Check browser support
    if (typeof(Storage) !== "undefined") {

      let TOKEN = localStorage.getItem('token');

      axios.get('/api/authtest', {
        headers : {'Authorization' : TOKEN,
                   'Content-Type'  : 'application/x-www-form-urlencoded'
                  }
      })

      .then((resp) => {
        onUserLogin(resp.data.name);
      })

      .catch((err) => {
          localStorage.removeItem('token');
          browserHistory.push('/');
      });

    } else {
        console.log("Error: Browser doesnot support local storage!");
    }
  }

  componentWillUnmount() {
    this.socket.emit('user logout', this.activeUser);
  }

  onUserLogin(userName, token) {

    //console.log(`${userName} ${token}`);

    this.activeUser = userName;

    if (token) {
        localStorage.setItem('token', token);
    }

    this.socket.emit('user login', userName);

    browserHistory.push('/');
  }

  onUserLogout() {
    if(this.activeUser !== '') {
      localStorage.removeItem('token');
      this.socket.emit('user logout', this.activeUser);
      this.activeUser = '';
      this.toggleBackground();
      browserHistory.push('/');
      //console.log('user logged out!');
    }
  }

  toggleBackground() {
    this.contRef.classList.toggle(style.backgroundImgNone);
    this.backgroundVis = this.backgroundVis ? false : true;
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      if(child.type.name === "Home") {

        return React.cloneElement(child, {
          userLoggedIn : this.activeUser ? true : false,
          userName : this.activeUser,
          toggleBackground: this.toggleBackground
        });
      }

      if(child.type.name === "Login") {
        if(!this.activeUser) {
          return React.cloneElement(child, {
            userLoggedIn : true,
            onUserLogin : this.onUserLogin
          });
        }
      }

      if(child.type.name === "Chat") {
        return React.cloneElement(child, {
         userName : this.activeUser,
         socket: this.socket
       });
      }
    })
  }

  render() {
    return (
        <div class={style.container} ref = {(input) => {this.contRef = input}}>
          <Header
            onUserLogout={this.onUserLogout}
            userName={this.activeUser}
          />
          {this.renderChildren()}
          <Footer backgroundVis={this.backgroundVis}/>
        </div>
    );
  }
}
