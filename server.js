"use strict";

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var app = express(); 

var server = http.createServer(app);

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


//DB CONFIG
Object.assign=require('object-assign')

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

app.set('port', port);

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}

var db = null;
var dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongoose = require('mongoose');
  if (mongoose == null) return;

  mongoose.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

if (!db) {
  initDb(function(err){});
}

//routes
var apiRoutes = require('./routes/apiroutes.js');
app.use('/api', apiRoutes);

//default route
app.get('*', function (req, res){
  res.render(path.resolve(__dirname, 'views', 'index.ejs'))
});

var users = {};

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


server.listen(port, ip, function () {
  console.log( "Listening on " + ip + ", port " + port )
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