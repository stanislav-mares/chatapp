"use strict";

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var app = express(); 

var server = http.createServer(app);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.set('port', server_port);



//VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//PASSPORT
var passport = require('passport');

app.use(passport.initialize());

require('./config/passport')(passport);

//MongoDB
var mongoose = require('mongoose');
var config = require('./config/database.js');
var db = undefined;

if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + 'chatapp';
  db = mongoose.connect(mongodb_connection_string);
}else {
  db = mongoose.connect(config.database);
}

//routes
var apiRoutes = require('./routes/apiroutes.js');
app.use('/api', apiRoutes);

//default route
app.get('*', function (req, res){
  res.render(path.resolve(__dirname, 'views', 'index.ejs'))
});

let users = {};

//SOCKET IO
var io = require('socket.io')(server);
io.on('connection', function(socket){
  
  users[socket.id] = {userName: '', login: false};

  io.emit('user connected', users);
  console.log('user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
    
    io.emit('user left', users[socket.id].userName);  
    delete users[socket.id];
  });

  socket.on('send message', function(newMessage) {
    console.log("new message");
    io.emit('new message', newMessage);
  });

  socket.on('send room', function(newRoom) {
    console.log("new room");
    io.emit('new room', newRoom);
  }); 

  socket.on('user login', function(userName) {
    users[socket.id].userName = userName;
    users[socket.id].login = true;
    io.emit('new user', userName);
    console.log('User login: ' + userName);
  });

  socket.on('user logout', function(userName) {
    users[socket.id].login = false;
    console.log('User logout: ' + userName);
    io.emit('user left', userName)
  });
});


server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});

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

module.exports.users = users;