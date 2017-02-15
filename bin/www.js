"use strict";

//module dependencies
var app = require('../app');
//var debug = require('debug')('Megan:server');
var http = require('http');

//get port from environment and store in Express

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

//create http server
var server = http.createServer(app);

//listen on provided port, on all network interfaces

server.listen(port, function() {
	console.log("Server started on port:" + port)	
});

//server.on('error', onError);
//server.on('listening', onListening);

function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}

	if (port >= 0) {
		return port;
	}

	return false;
}