"use-strict";

var express = require('express');
var apiRoutes = express.Router();
var passport = require('passport');
var config = require('../config/database.js');
var app = require('../app.js');
var jwt = require('jwt-simple');

var User = require('../models/user.js');
var Room = require('../models/room.js');
var Message = require('../models/message.js');


apiRoutes.get('/rooms', function(req, res) {
  Room.find({  
    
  }, function(err, rooms) {
    if (err) {
      throw err;
    } else {
      //mongoose.connection.close();
      //console.log(teams);
      //callback("", teams);
    
      return res.send(rooms);
    }
  });
});

apiRoutes.post('/room-add', function(req, res) {

  if(req.body.name.length == 0) {
    res.json({success: false, msg: "Name of room is required!"});
  }

  let newRoom = new Room({
    name: req.body.name,
    desc: req.body.desc,
    messages: []
  }); 

  newRoom.save(function(err) {
      if(err) {
        throw err;
        res.json({success: false, msg: "Room with name " + newRoom.name + " already exists!"});
      }else{
        res.json({success: true, msg: "Room successfully created!"});
      }
  });

});

apiRoutes.delete('/room-delete/:name', function(req, res) {
  Room.remove({
    name: req.params.name
  }, function(err, result) {
        if(result.result.n == 0) {
          res.json({success: false, msg: 'Room does not exists!'});
        }else {
          if(err) {
            res.json({success: false, msg: "Room not found!"});
          }else {
            res.json({success: true, msg: "Room successfully deleted!"});
          }
        }
    });
});
  
//POST - REGISTRATION

apiRoutes.post('/signup', function(req, res) {

  if(!req.body.name || !req.body.password) {
    res.json({success : false, msg: 'Please enter name and password!'});
  } else {
    
    var newUser = new User({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      online : req.body.online
    });

    newUser.save(function(err) {
      if (err) {
        res.json({success : false, msg: 'Error occured - user already exists!'});  
      } else {
        res.json({success : true, msg: 'User successfully created!'}); 
      }

    });

  }
});

apiRoutes.get('/users', function(req, res) {
  User.find({  
    
  }, function(err, users) {
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

apiRoutes.delete('/user-delete/:name', function(req, res) {
  User.remove({
    name : req.params.name  
  }, function(err, result) {
      
      if(result.result.n == 0) {
        res.json({success: false, msg: 'User does not exists!'});
      } else {

        if(err) {
          throw err;
        } else {
          res.json({success: true, msg: 'User successfully deleted!'});
        }

      }
  });
});

apiRoutes.post('/auth', function(req, res) {

  User.findOne({
    name: req.body.name  
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      return res.status(403).send({sucess: false, msg: 'Wrong username or password!'}); //user not found
    } else {
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {

          var token = jwt.encode(user, config.secret);  
        
          res.json({success: true, user: user.name, token: 'JWT ' + token}); //token string must be in format JWT[space]+ token        
        
        } else {
          return res.status(403).send({sucess: false, msg: 'Wrong username or password!'}); //wrong password  
        }
      });
    }

  });
});

apiRoutes.get('/authtest', passport.authenticate('jwt', {session: false}), function(req, res) {
  var token = getToken(req.headers);

  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
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

var getToken = function(header) {
  if (header && header.authorization) {
    var parted = header.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;  
    }
  } else {
    return null;
  }
};

apiRoutes.delete('/message-delete/:id', function(req, res) {
  Message.remove({
    _id : req.params.id  
  }, function(err, result) {
      
      if(result.result.n == 0) {
        res.json({success: false, msg: 'Message does not exists!'});
      } else {

        if(err) {
          throw err;
        } else {
          res.json({success: true, msg: 'Messsage successfully deleted!'});
        }

      }
  });
});


apiRoutes.get('/messages', function(req, res) {
  Message.find({  
    
  }, function(err, message) {
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


apiRoutes.post('/messages-add', function(req, res) {
  
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

  Message.create(messages, function(err, docs) {
    if (err) {
      throw err;
      res.json({success : false, msg: 'Error during saving messages!'});                                                                                                                   
    }else {

      roomMessagesUpdate(docs, req.body[0].nameRoom, res);

    }
  });

  

});

var roomMessagesUpdate = function(messages, name, res) {

  Room.findOne({
    name : name
  }, function(err, room) {
        if(err) {
          throw err;
          res.json({success : false, msg1: docs.length + ' messages successfully stored!', msg2: 'Room does not exists!'}); 
        }else {
          
          let newMessagesRefs = getMessagesID(messages);

          let messagesRefs = room.messages === null ? [] : room.messages;

          messagesRefs = messagesRefs.concat(newMessagesRefs);

          Room.update({_id : room._id}, {messages : messagesRefs}, function(err) {
            if(err) {
              throw err;
               res.json({success : false, msg1: messages.length + ' messages successfully stored!', 
                                          msg2: 'Error while updating room!'}); 
            }else {
              res.json({success : true, msg1: messages.length + ' messages successfully stored!', 
                                        msg2: 'Room messages successfully updated!'});
            }
        
          });  
        
        }
  });
}

var getMessagesID = function(messages) {
  let messagesID = messages.map((message) => {
    return (
      message._id
    ) 
  })

  return messagesID;
};

//Messages of specific room
apiRoutes.get('/room-messages/:roomName', function(req, res) {
  
  Room.findOne({
    name : req.params.roomName
  })
  .populate('messages')
  .exec(function(err, roomMessages) {
    if(err){
      throw err;
    } else {
      return res.send(roomMessages);
    }
  });
});


apiRoutes.get('/users-online', function(req, res) {
  
  var usersOnline = [];

    for (var key in app.users) {
        if(app.users[key].login) {
          usersOnline.push(app.users[key].userName);           
        }
    }

  return res.json(usersOnline);
});

module.exports = apiRoutes;