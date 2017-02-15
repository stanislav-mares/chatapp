"use strict";
import React from "react";
import styles from "../public/css/style.css"
import { Link } from 'react-router';

export default class Home extends React.Component {
  
  constructor(props) {
    super(props);
  
  }

  render() {
    
    let link = undefined;
    let userName = undefined;
    
    if (!(this.props.userLoggedIn)) {

      link = <Link to="/login" class="btn loginenterBtn">Login</Link>;
      userName = '';
    }else {
      link = <Link to="/chat" class="btn loginenterBtn">Enter chat</Link>;
      userName = <span class="textColorGreen" >{this.props.userName}</span>;	
    }

    return (
      <div class="homeCont">
        <div class="text-center loginenter homeTitleCont">
            <h1 class="text-center">Welcome {userName}!</h1>  
            <hr />
        </div>
        <div class="btnCont">{link}</div>
      </div>
    );
  }
}

