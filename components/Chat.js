"use strict";
import React from "react";
import SidebarOnUsers from "./Main/SidebarOnUsers";
import SidebarRooms from "./Main/SidebarRooms";
import styles from "../public/css/style.css";
import axios from 'axios';

export default class Chat extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.state = {
        onlineUsers : [],
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

    this.userLogin = this.userLogin.bind(this);
    this.userLogout = this.userLogout.bind(this);
  }

  componentWillMount() {
    
  }

  componentDidMount() {
    
    this.initialize('/api/users-online', 'onlineUsers', this.state.onlineUsers);
    this.initialize('/api/rooms', 'rooms', this.state.rooms);

    this.props.socket.on('new message', this.recieveMessage);
    this.props.socket.on('new room', this.recieveRoom);
    this.props.socket.on('new user', this.userLogin);
    this.props.socket.on('user left', this.userLogout);
    this.timer = setInterval(this.saveToDatabase, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  initialize(apiPath, stateType, ref) {
    axios.get('http://localhost:3000' + apiPath)
      .then((resp) => {
        
        let list = null;

        if (resp.data) {
          
          switch(stateType) {
            
            case 'onlineUsers' :
              
              list = Object.assign([], resp.data);
              //console.log(list);
              this.setState({onlineUsers : list});
              //console.log(this.state.onlineUsers);
              break;
            case 'messages' :
              list = Object.assign(resp.data, ref);
              this.setState({messages : list});
              break;
            case 'rooms' :
              list = Object.assign(resp.data, ref);
              this.setState({rooms : list});    
              break;
            case 'activeRoom' :
              this.setState({activeRoom : {name: resp.data.name, 
                                           desc: resp.data.desc,
                                           messages: resp.data.messages
                                          }});
              break;
          }
            
        }
      })
      .catch((err) => {
        throw err;
      });  
  }

  userLogin(user) {
    
    let onlineUsers = this.state.onlineUsers;

    onlineUsers.push(user);       
    
    this.setState({onlineUsers: onlineUsers});
  }

  userLogout(user) {
     let onlineUsers = this.state.onlineUsers;  
  
     let index = onlineUsers.indexOf(user);

     if (index > -1) {
        onlineUsers.splice(index, 1);
     }

     this.setState({onlineUsers: onlineUsers});
  }

  setActiveRoom(activeRoom) {
    let rooms = this.state.rooms;
    for(var i = 0; i < rooms.length; i++) {
      if(rooms[i].name == activeRoom) {
        this.initialize('/api/room-messages/' + activeRoom, 'activeRoom', this.state.activeRoom);
        break;
      }
    }
  }

  sendMessage(message) {
    if(!(this.state.activeRoom.name === '')) {
        
      message.nameUser = this.props.userName;
      message.nameRoom = this.state.activeRoom.name;
      message.id = message.nameUser + ';' + message.time;  

      let messages = Object.assign([], this.state.messages);
      messages.push(message);

      this.setState({messages : messages});

      //console.log(this.state.messages)

      this.props.socket.emit('send message', message);
    }
  }

  recieveMessage(message) {
    
    //console.log('recieving message');

    if(message.nameRoom === this.state.activeRoom.name) {
      
      this.setState({activeRoom: {name: this.state.activeRoom.name,
                                  desc: this.state.activeRoom.desc,
                                  messages: this.state.activeRoom.messages.concat(message
                                  )}});
    }
  }

  saveToDatabase() {
    
    if(this.state.messages.length > 0) {
      
      console.log("Storing into database...");

      axios.post('/api/newmessages', this.state.messages)
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
    
    //console.log('recieving room');

    let rooms = Object.assign([], this.state.rooms);
    rooms.push(room);

    this.setState({rooms : rooms});

    //console.log(this.state.rooms)
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
      <main class="mainArea">
      	
      	<aside class="text-center asideBar"><SidebarOnUsers users={this.state.onlineUsers}/>
        </aside>    
        <section class="text-center sectionWindow">{this.renderChildren()}</section>
        <aside class="text-center asideBar"><SidebarRooms rooms={this.state.rooms}
                                                          setActiveRoom={this.setActiveRoom}
                                            />
        </aside>
      	
      </main>
    );
  }
}