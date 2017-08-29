"use strict";
import React from "react";
import PropTypes from "prop-types";
import style from "styles/sideBarOnUsers.scss";

const SidebarOnUsers = (props) => {

    let currentUsers = props.users.map((user, i) => {
      return (
        <li key={i}>{user}</li>
      )
    });

    return (
    	<aside class={style.container}>
        <div class={style.head}>
          <h2>Online users ({props.users.length})</h2>
        </div>
        <div class={style.listCont}>
          <ul class={style.list}>
  	    		{currentUsers}
  	    	</ul>
        </div>
	    </aside>
    );
}

SidebarOnUsers.propTypes = {
    users: PropTypes.array.isRequired
};

export default SidebarOnUsers;
