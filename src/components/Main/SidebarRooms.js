"use strict";
import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router';

import style from "styles/sideBarRooms.scss";

export default class SidebarRooms extends React.Component {

  constructor(props) {
    super(props);

    this.activeRoomRef = null;
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();

    const clickedRoom = event.target

    if (!clickedRoom.classList.contains(style.activeRoom)) {
      clickedRoom.classList.add(style.activeRoom);

      if(this.activeRoomRef) {
        this.activeRoomRef.classList.remove(style.activeRoom);
      }

      this.activeRoomRef = clickedRoom;
      this.props.setActiveRoom(clickedRoom.innerHTML);
    }
  }

  render() {

    const currentRooms = this.props.rooms.map((room, i) => {
      return (
        <li onClick={this.onClick} class="list-group-item" key={i}>{room.name}</li>
      )
    });

    return (
      	<aside class={style.container}>
            <div class={style.head}>
              <h2>Rooms ({this.props.rooms.length})</h2>
            </div>

            <div class={style.listCont}>
              <ul class={style.list} ref={(ref) => {this.ulRef = ref}}>
        	       {currentRooms}
      	    	</ul>
            </div>

            <div class={style.btnCont}>
              <Link class={style.btn + ' ' + style.link} to="/newroom">New room</Link>
            </div>
      	</aside>
    );
  }
}

SidebarRooms.propTypes = {
    setActiveRoom: PropTypes.func.isRequired,
    rooms: PropTypes.array.isRequired
};
