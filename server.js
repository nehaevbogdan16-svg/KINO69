const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};
/*
rooms = {
  roomName: {
    code: "1234",
    video: null
  }
}
*/

io.on("connection", socket => {

  socket.on("join", ({ room, code }) => {

    // если комнаты нет — создаём
    if (!rooms[room]) {
      rooms[room] = {
        code: code || null,
        video: null
      };
    }

    // если в комнате есть код — проверяем
    if (rooms[room].code && rooms[room].code !== code) {
      socket.emit("denied");
      return;
    }

    socket.join(room);
    socket.room = room;

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
  console.log("КИНО69 запущен (приватные комнаты)");
});
socket.on("sync", data => {
  if (!socket.room) return;
  socket.to(socket.room).emit("sync", data);
});
