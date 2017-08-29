"use strict";

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const port = process.env.PORT || 8080,
      ip   = process.env.IP   || '127.0.0.1';

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(passport.initialize());

require('./src/config/passport')(passport);

//routes
const apiRoutes = require('./src/routes/apiroutes.js');
app.use('/api', apiRoutes);

//default route
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.sendFile(path.resolve(__dirname, 'src/views', 'index.html'));
});

let dbConn = null;

const initDb = () => {

  if (mongoose == null) return;

  const { user, pwd, dataBaseLabel, host, port, db } = require("./src/config/database");

  const mongoURL = `${dataBaseLabel}://${user}:${pwd}@${host}:${port}/${db}`;

  mongoose.connect(mongoURL, (err, conn) => {
    if (err) {
      console.log(err);
      return;
    }

    dbConn = conn;

    console.log(`Connected to MongoDB`);
  });
};

if (!dbConn) {
  initDb();
}

let users = {};

//SOCKET IO
io.on('connection', (socket) => {

  users[socket.id] = {userName: '', login: false};

  io.emit('user connected', users);
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');

    io.emit('user left', users[socket.id].userName);
    delete users[socket.id];
  });

  socket.on('send message', (newMessage) => {
    console.log("new message");
    io.emit('new message', newMessage);
  });

  socket.on('send room', (newRoom) => {
    console.log("new room");
    io.emit('new room', newRoom);
  });

  socket.on('user login', (userName) => {
    users[socket.id].userName = userName;
    users[socket.id].login = true;
    io.emit('new user', userName);
    console.log(`User login: ${userName}`);
  });


  socket.on('user logout', (userName) => {
    users[socket.id].login = false;
    console.log(`User logout: ${userName}`);
    io.emit('user left', userName);
  });

});

server.listen(port, ip, () => {
  console.log( `Listening on ${ip}, port ${port}`)
});

module.exports = users;
