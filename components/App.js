"use-strict";
import React from "react";
import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Home from "./Home";
import styles from "../public/css/style.css"
import axios from 'axios';

let socket = io();

export default class App extends React.Component {
  
  constructor(props) {
      super(props);
      this.state = {
        userAuth : {TOKEN : '', loggedIn: false},
        userData : {name: ''},
      };

      this.onUserLogin = this.onUserLogin.bind(this);
      this.onUserLogout = this.onUserLogout.bind(this);
      this.renderChildren = this.renderChildren.bind(this)
  }
      
  
  componentDidMount() {

    // Check browser support
    if (typeof(Storage) !== "undefined") {
     
      var TOKEN = localStorage.getItem('token');

      axios.get('/api/authtest', {
        headers : {'Authorization' : TOKEN,
                   'Content-Type'  : 'application/x-www-form-urlencoded'
                  } 
        })

        .then((resp) => {
          this.setState({userData: {name: resp.data.name}});
          this.setState({userAuth : {TOKEN: TOKEN, loggedIn: true}});
          socket.emit('user login', resp.data.name);
        })
      
        .catch((err) => {
          this.setState({userData: ''});
          this.setState({userAuth : {TOKEN : '', loggedIn: false}});
          localStorage.removeItem('token');
        
          browserHistory.push('/login');
        });
    
    } else {

      console.log("Error: Browser doesnot support local storage!");
    
    }
  }
  
  componentWillUnmount() {
    socket.emit('user logout', this.state.userData.name);
  }

  onUserLogin(userData, userAuth) {

    this.setState({
      userAuth : userAuth,
      userData : userData
    });

    localStorage.setItem('token', userAuth.TOKEN);
    
    socket.emit('user login', userData.name);

    browserHistory.push('/');
  
  }

  onUserLogout() {
    this.setState({userAuth : {TOKEN : '', loggedIn: false}});
    this.setState({userData : {name : ''}});
    localStorage.removeItem('token');
    
    socket.emit('user logout', this.state.userData.name);
    
    browserHistory.push('/');  
  }

  renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      if(child.type.name === "Home") {
        return React.cloneElement(child, {
          userLoggedIn : this.state.userAuth.loggedIn,
          userName : this.state.userData.name
        });
      }

      if(child.type.name === "Login") {
        if(!this.state.userAuth.loggedIn) {
          return React.cloneElement(child, {
            userLoggedIn : this.state.userAuth.loggedIn,
            onUserLogin : this.onUserLogin
          });
        }else {
          browserHistory.push('/');
        }
      }

      if(child.type.name === "Chat") {
        return React.cloneElement(child, {
         socket : socket,
         userName : this.state.userData.name
        });  
      }
    })
  }

  render() {
    
    return (
        <div class="mainContainer">
          <div class="row header">
            <Header onUserLogout={this.onUserLogout}
                    userName={this.state.userData.name}
            />
          </div> 
          <div class="row main">
           {this.renderChildren()}
          </div>
          <div id="statusMessage"></div>
          <div class="row footer"><Footer /></div>
        </div>
    );
  }
}