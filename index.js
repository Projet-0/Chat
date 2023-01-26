const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


var url = require('url');
var querystring = require('querystring'); // Permet de parser et formater (adapter au bon format) les URL 

// USER JSON
const fs = require("fs");
const data = 0 ;
// READ 


var user_list = [] ;
var list_user = [] ;

var chat_user ;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


io.on('connection', (socket) => {

    // Récupération de la list user
    socket.on('new_user', (user) => {
      chat_user = user;
      if(!list_user.includes(chat_user)) {
        list_user.push(user);
      }
      io.emit('new_user', list_user);
      console.log("Je contient  ")

      //console.log('list des utilisateur: ' + list_user);
    });


    // Récupération du msg, ajout du user avec
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg,chat_user);
      console.log('message: ' + msg + 'Ce message été écrit par ' + chat_user);
    });

});


io.on('connection', (socket) => {
  socket.on('private-message', (current_user,receiver,content) => {

    if (list_user.includes(receiver)) { // 
      console.log( 'user qui envoie :' + current_user, ',user qui recoit : ' + receiver , ', contenu ' + content)
      io.emit('private-message-send',current_user,receiver,content)
    }
  })
})

// IS TYPING

io.on('connection', (socket) => {
  socket.on('typing', (user) => {
    io.emit('typing', user);
  });
});




server.listen(3000, () => {
  console.log('listening on *:3000');

})
