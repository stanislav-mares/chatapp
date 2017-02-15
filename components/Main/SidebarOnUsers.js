"use strict";
import React from "react";

export default class SidebarOnUsers extends React.Component {
  render() {
    
    const currentUsers = this.props.users.map((user, i) => {
      return (
        <li class="list-group-item" key={i}>{user}</li>
      )
    });

    return (
    	<div class="text-center">
	    	<h2 class="title">Online users ({this.props.users.length})</h2>
	    	<ul class="list-group mainAsideList ">
	    		{currentUsers}
	    	</ul>
	    </div>  
    );
  }
}