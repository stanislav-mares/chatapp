"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import MessageWindow from "./components/Main/MessageWindow";
import NewRoom from "./components/Main/NewRoom";
import Login from "./components/Login";
import Home from "./components/Home";
import Chat from "./components/Chat";
import NotFoundPage from "./components/NotFoundPage";
import App from "./components/App";

import Style from "./public/css/style.css"

const app = document.getElementById('app');
app.classList.add('root');

ReactDOM.render(
	
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home}></IndexRoute>
			<Route path="/login" component={Login}></Route>
			<Route component={Chat}>
				<Route path="chat"    component={MessageWindow}></Route>
				<Route path="newroom" component={NewRoom}></Route>
			</Route>
			<Route path="/*" component={NotFoundPage}></Route>
		</Route>
	</Router>,
	
	app
);