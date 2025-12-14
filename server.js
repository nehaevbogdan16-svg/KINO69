const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", socket => {

  socket.on("join", room => {
    socket.join(room);
    socket.room = room;

    if (!rooms[room]) {
      rooms[room] = {
        video: null
      };
    }

    if (rooms[room].video) {
      socket.emit("video", rooms[room].video);
    }
  });

  socket.on("video", url => {
    if (!socket.room) return;
    rooms[socket.room].video = url;
    socket.to(socket.room).emit("video", url);
  });

});

server.listen(process.env.PORT || 3000, () => {
  console.log("КИНО69 запущен");
});
