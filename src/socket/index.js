import express from 'express'

const app = express();
const PORT = 3000;

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});



io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('start play', function(msg){
    console.log(msg);
    io.emit('start play',msg);
  });
});