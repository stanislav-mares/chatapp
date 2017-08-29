"use strict";
import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router';

import style from "styles/header.scss";
import logo from "images/logo.png"

const Header = (props) => {

    let text = undefined;

    if (props.userName) {
      text = props.userName;
    }else {
      text = '';
    }

    return (
        <header class={style.container}>
          <div class={style.titleCont}>
            <img class={style.logo} src={logo} alt="logo" />
            <Link class={style.link} to="/">Chat application</Link>
          </div>
          <nav class={style.navigation}>
            <Link to="/" class={style.link} onClick={props.onUserLogout}>Logout</Link>
            <span class={style.userName}>{text}</span>
          </nav>
        </header>

    );
}

Header.propTypes = {
    userName: PropTypes.string,
    onUserLogout: PropTypes.func
};

export default Header;
