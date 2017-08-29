"use-strict";

const express = require('express');
const apiRoutes = express.Router();
const passport = require('passport');
const config = require('../config/database.js');
const jwt = require('jwt-simple');

const User = require('../models/user.js');
const Room = require('../models/room.js');
const Message = require('../models/message.js');

apiRoutes.get('/rooms', (req, res) => {
  Room.find({

  }, (err, rooms) => {
    if (err) {
      throw err;
    } else {
      return res.send(rooms);
    }
  });
});

apiRoutes.post('/room-add', (req, res) => {

  if(req.body.name.length == 0) {
    res.json({success: false, msg: "Name of room is required!"});
  }

  var newRoom = new Room({
    name: req.body.name,
    desc: req.body.desc,
    messages: []
  });

  newRoom.save((err) => {
      if(err) {
        throw err;
        res.status(400).json({success: false, msg: `Room with name ${newRoom.name} already exists!`});
      }else{
        res.json({success: true, msg: "Room successfully created!"});
      }
  });

});

apiRoutes.delete('/room-delete/:name', (req, res) => {
  Room.remove({
    name: req.params.name
  }, (err, result) => {
        if(result.result.n == 0) {
          res.status(400).json({success: false, msg: 'Room does not exists!'});
        }else {
          if(err) {
            res.status(400).json({success: false, msg: "Room not found!"});
          }else {
            res.json({success: true, msg: "Room successfully deleted!"});
          }
        }
    });
});

//POST - REGISTRATION

apiRoutes.post('/signup', (req, res) => {

  if(!req.body.name || !req.body.password) {
    res.status(400).json({success : false, msg: 'Please enter name and password!'});
  } else {

    let newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email
    });

    newUser.save((err) => {
      if (err) {
        res.status(400).json({success : false, msg: 'Error occured - user already exists!'});
      } else {
        res.json({success : true, msg: 'User successfully created!'});
      }

    });

  }
});

apiRoutes.get('/users', (req, res) => {
  User.find({

  }, (err, users) => {
    if (err) {
      throw err;
    } else {
      //mongoose.connection.close();
      //console.log(teams);
      //callback("", teams);

      return res.send(users);
    }
  });
});

apiRoutes.delete('/user-delete/:name', (req, res) => {
  User.remove({
    name : req.params.name
  }, (err, result) => {

      if(result.result.n == 0) {
        res.status(400).json({success: false, msg: 'User does not exists!'});
      } else {

        if(err) {
          throw err;
        } else {
          res.json({success: true, msg: 'User successfully deleted!'});
        }

      }
  });
});

apiRoutes.post('/auth', (req, res) => {

  User.findOne({
    name: req.body.name
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      return res.status(403).send({sucess: false, msg: 'Wrong username or password!'}); //user not found
    } else {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {

          let token = jwt.encode(user, config.secret);

          res.json({success: true, user: user.name, token: `JWT ${token}`,
                  msg: 'User successfully logged in!'}); //token string must be in format JWT[space]+ token

        } else {
          return res.status(403).send({sucess: false, msg: 'Wrong username or password!'}); //wrong password
        }
      });
    }

  });
});

apiRoutes.get('/authtest', passport.authenticate('jwt', {session: false}), (req, res) => {
  let token = getToken(req.headers);

  if (token) {
    let decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, (err, user) => {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({sucess: false, msg: 'User not found!'});
      } else {
        return res.json({success: true, name : user.name});
      }

    });
  } else {
    return res.status(403).send({sucess: false, msg: 'No token provided'});
  }

});

let getToken = (header) => {
  if (header && header.authorization) {
    let parted = header.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

apiRoutes.delete('/message-delete/:id', (req, res) => {
  Message.remove({
    _id : req.params.id
  }, (err, result) => {

      if(result.result.n == 0) {
        res.status(400).json({success: false, msg: 'Message does not exists!'});
      } else {

        if(err) {
          throw err;
        } else {
          res.json({success: true, msg: 'Messsage successfully deleted!'});
        }

      }
  });
});


apiRoutes.get('/messages', (req, res) => {
  Message.find({

  }, (err, message) => {
    if (err) {
      throw err;
    } else {
      //mongoose.connection.close();
      //console.log(teams);
      //callback("", teams);
      //nameRoom : req.body.nameRoom
      return res.send(message);
    }
  });
});


apiRoutes.post('/messages-add', (req, res) => {

  let messages = [];

  //console.log(req.body);

  messages = req.body.map((newMessage) => {
    return (
      new Message({
      id : newMessage.id,
      text : newMessage.text,
      nameRoom : newMessage.nameRoom,
      nameUser : newMessage.nameUser,
      time : newMessage.time
    }))
  });

  //console.log(messages);

  Message.create(messages, (err, docs)  => {
    if (err) {
      throw err;
      res.status(400).json({success : false, msg: 'Error during saving messages!'});
    }else {

      roomMessagesUpdate(docs, req.body[0].nameRoom, res);

    }
  });



});

const roomMessagesUpdate = (messages, name, res) => {

  Room.findOne({
    name : name
  }, (err, room) => {
        if(err) {
          throw err;
          res.status(400).json({
            success : false,
            msg1: `${docs.length} messages successfully stored!`,
            msg2: 'Room does not exists!'
          });
        }else {

          let newMessagesRefs = getMessagesID(messages);

          let messagesRefs = room.messages === null ? [] : room.messages;

          messagesRefs = messagesRefs.concat(newMessagesRefs);

          Room.update({_id : room._id}, {messages : messagesRefs}, (err) => {
            if(err) {
              throw err;
               res.status(400).json({success : false, msg1: `${messages.length} messages successfully stored!`,
                                      msg2: 'Error while updating room!'});
            }else {
              res.json({success : true, msg1: `${messages.length} messages successfully stored!`,
                                        msg2: 'Room messages successfully updated!'});
            }

          });

        }
  });
}

const getMessagesID = (messages) => {
  let messagesID = messages.map((message) => {
    return (
      message._id
    )
  })

  return messagesID;
};

//Messages of specific room
apiRoutes.get('/room-messages/:roomName', (req, res) => {

  Room.findOne({
    name : req.params.roomName
  })
  .populate('messages')
  .exec((err, roomMessages) => {
    if(err){
      throw err;
    } else {
      return res.send(roomMessages);
    }
  });
});

apiRoutes.get('/users-online', (req, res) => {

  let users = require('../../server.js');

  //console.log(users);

  let usersOnline = [];

    for (let key in users) {
        if(users[key].login) {
          usersOnline.push(users[key].userName);
        }
    }

  return res.json(usersOnline);
});

module.exports = apiRoutes;
