"use strict";

import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router';

import style from "styles/home.scss"

const Home = (props) => {

    let link = undefined;
    let userName = undefined;

    if (!(props.userLoggedIn)) {
      link = <Link to="/login" class={style.link}>Login</Link>;
      userName = '';
    }else {
      link = <Link to="/chat" onClick={props.toggleBackground} class={style.link}>Enter chat</Link>;
      userName = props.userName;
    }

    return (
      <main class={style.container}>
        <div class={style.titleCont}>
            <h1 class={style.title}>Welcome {userName}</h1>
            {link}
        </div>
      </main>
    );
}

Home.propTypes = {
  userLoggedIn: PropTypes.bool,
  toggleBackground: PropTypes.func,
  userName: PropTypes.string
}

export default Home;
