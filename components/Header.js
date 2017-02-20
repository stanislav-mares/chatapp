"use strict";
import React from "react";
import { Link } from 'react-router';
import styles from "../public/css/style.css"

export default class Header extends React.Component {
  
  render() {
  
    let text = undefined;

    if (this.props.userName) {
      text = this.props.userName;
    }else {
      text = '';
    }

    return (
        <nav class="navbar navbar-inverse navbar-static-top headerPanel">
  			  <div class="navbar-header">
                <Link to="/" class="navbar-brand">Chat application</Link>
          </div>   	     
  		    
          <div class="logout">
              <Link to="/" class="userHeader headerLink" onClick={this.props.onUserLogout}>Logout</Link>
              <span class="userHeader textColorDarkBlue bold">{text}</span>
          </div>
        </nav>
    );
  }
}
