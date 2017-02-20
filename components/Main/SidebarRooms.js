"use strict";
import React from "react";
import { Link } from 'react-router';
import styles from "../../public/css/style.css"

export default class SidebarRooms extends React.Component {
  
  constructor(props) {
    super(props);

    this.state={selected: false,
                activated : false}

    this.handleClick = this.handleClick.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    
    let children = this.ulRef.children;

    for(let i = 0; i < children.length; i++){
      if (children[i].classList.contains('selectRoom')) {
        
        if (children[i] !== event.target) {
          children[i].classList.remove('selectRoom');  
          event.target.classList.add('selectRoom');
          this.setState({selected : true});
        }else {
          event.target.classList.toggle('selectRoom');  
          this.setState({selected : false});
        }
        break;
      }
    };
  
    if (!this.state.selected) {
      event.target.classList.toggle('selectRoom');
      this.setState({selected : true});  
    }
  }

  onClick(event) {
    event.preventDefault();

     if (this.state.selected) {

       let children = this.ulRef.children;

       for(let i = 0; i < children.length; i++){
        
        if (children[i].classList.contains('activeRoom')) {
         
          children[i].classList.remove('activeRoom');
    
        }

        if (children[i].classList.contains('selectRoom')) {
          children[i].classList.remove('selectRoom');
          children[i].classList.add('activeRoom');
          this.setState({selected : false, activated : true});
        

          this.props.setActiveRoom(children[i].innerHTML);
        }
      };
    }
  }

  render() {
    
    const currentRooms = this.props.rooms.map((room, i) => {
      return (
        <li onClick={this.handleClick} class="list-group-item" key={i}>{room.name}</li>
      )
    });

    return (
      	<div class="text-center">
        		<h2 class="title">Rooms ({this.props.rooms.length})</h2>
        		<ul id="test" class="list-group mainAsideulist listItemHighlight" ref={(ref) => {this.ulRef = ref}}>
      	       {currentRooms}    		
    	    	</ul>
            <div class="roomBtnCont">
              <button class="btn btn-default roomBtn" onClick={this.onClick}>Switch room</button>
              <Link to="/newroom" class="btn btn-default roomBtn">New room</Link>
            </div>
      	</div>
    );
  }

}