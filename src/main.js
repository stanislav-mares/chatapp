"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import MessageWindow from "components/Main/MessageWindow";
import NewRoom from "components/Main/NewRoom";
import Login from "components/Login";
import Home from "components/Home";
import Chat from "components/Chat";
import NotFoundPage from "components/NotFoundPage";
import App from "components/App";


const root = window.document.getElementById("root");
root.style.width = "100%";
root.style.height = "100%";

document.documentElement.style.width = "100%";
document.documentElement.style.height = "100%";
document.documentElement.style.margin = "0";
document.documentElement.style.padding = "0";

document.body.style.width = "100%";
document.body.style.height = "100%";
document.body.style.margin = "0";
document.body.style.padding = "0";


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

	root
);
