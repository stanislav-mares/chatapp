"use strict";

import React from "react";
import PropTypes from "prop-types";
import SidebarOnUsers from "components/Main/SidebarOnUsers";
import SidebarRooms from "components/Main/SidebarRooms";
import axios from 'axios';

import style from "styles/chat.scss";

export default class Chat extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
        onlineUsers: [],
        messages : [],
        rooms : [],
        activeRoom : {name: '', desc: '', messages: []}
    }

    this.initialize = this.initialize.bind(this);
    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.recieveMessage = this.recieveMessage.bind(this);
    this.sendRoom = this.sendRoom.bind(this);
    this.recieveRoom = this.recieveRoom.bind(this);
    this.saveToDatabase = this.saveToDatabase.bind(this);
    this.getOnlineUsers = this.getOnlineUsers.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);
}

  getOnlineUsers() {
    axios.get('/api/users-online')

    .then((resp) => {
      if(resp.data) {
        let index = resp.data.indexOf(this.props.userName);
        if (index > -1){
          resp.data.splice(index, 1);
        }
        this.setState({onlineUsers : resp.data});
      }
    })

    .catch((err) => {
      console.log(err);
    });
  }

  getRooms() {
    axios.get('/api/rooms')

    .then((resp) => {
      if(resp.data) {

        this.setState({rooms : resp.data});
      }
    })

    .catch((err) => {
      console.log(err);
    });
  }

  initialize() {
    this.getOnlineUsers();
    this.getRooms();
  }

  componentDidMount() {

    this.initialize();

    this.props.socket.on('new message', this.recieveMessage);
    this.props.socket.on('new room', this.recieveRoom);
    this.props.socket.on('new user', this.userLogin);
    this.props.socket.on('user left', this.userLogout);
    this.timer = setInterval(this.saveToDatabase, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.props.socket.removeListener('new message', this.recieveMessage);
    this.props.socket.removeListener('new room', this.recieveRoom);
    this.props.socket.removeListener('new user', this.userLogin);
    this.props.socket.removeListener('user left', this.userLogout);
  }

  userLogin(user) {

    let onlineUsers = Object.assign([], this.state.onlineUsers);
    onlineUsers.push(user);

    this.setState({onlineUsers: onlineUsers});
  }

  userLogout(user) {
      let onlineUsers = Object.assign([], this.state.onlineUsers);

      let index = onlineUsers.indexOf(user);

      if (index > -1) {
        onlineUsers.splice(index, 1);
      }

      this.setState({onlineUsers: onlineUsers});
  }

  setActiveRoom(activeRoom) {

    axios.get(`/api/room-messages/${activeRoom}`)

    .then((resp) => {
      if(resp.data) {
        this.setState({
          activeRoom : {
            name: resp.data.name,
            desc: resp.data.desc,
            messages: resp.data.messages
          }
        });
      }
    })

    .catch((err) => {
      console.log(err);
    });
  }

sendMessage(message) {
  if(!(this.state.activeRoom.name === '')) {

    message.nameUser = this.props.userName;
    message.nameRoom = this.state.activeRoom.name;
    message.id = message.nameUser + ';' + message.time;

    let messages = Object.assign([], this.state.messages);
    messages.push(message);

    this.setState({messages : messages});

    this.props.socket.emit('send message', message);
  }
}

recieveMessage(message) {

  if(message.nameRoom === this.state.activeRoom.name) {

    this.setState({
      activeRoom: {
        name: this.state.activeRoom.name,
        desc: this.state.activeRoom.desc,
        messages: this.state.activeRoom.messages.concat(message)
      }
    });
  }
}

saveToDatabase() {

  if(this.state.messages.length > 0) {

    console.log("Storing into database...");

    axios.post('/api/messages-add', this.state.messages)
      .then((resp) => {
        console.log(resp.data.msg1 + ', ' + resp.data.msg1);
      })

      .catch((err) => {

        console.log(err);

      });

      this.state.messages = [];
    }

}

sendRoom(room) {
  axios.post('/api/room-add',
    {
     name: room.name,
     desc: room.desc,
    })

  .then((resp) => {
    console.log(resp.data.msg);
  })

  .catch((err) => {
    console.log(err);
  });
  this.props.socket.emit('send room', room);
}

recieveRoom(room) {

  let rooms = Object.assign([], this.state.rooms);
  rooms.push(room);

  this.setState({rooms : rooms});

}

  renderChildren() {
    return React.Children.map(this.props.children, (child) => {
      if(child.type.name === "MessageWindow") {
        return React.cloneElement(child, {
          activeRoom : this.state.activeRoom,
          sendMessage : this.sendMessage
        });
      }

      if(child.type.name === "NewRoom") {
        return React.cloneElement(child, {
          sendRoom : this.sendRoom
        });
      }
    })
  }

  render() {

    return (
      <main class={style.container}>
        <SidebarOnUsers users={this.state.onlineUsers}/>
        {this.renderChildren()}
        <SidebarRooms
            rooms={this.state.rooms}
            setActiveRoom={this.setActiveRoom}
        />
      </main>
    );
  }
}

Chat.propTypes = {
  userName: PropTypes.string,
  socket: PropTypes.object
};
