const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {};
app.use(express.static("public"));

io.on("connection", socket => {
  socket.on("join-room", room => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = { host: socket.id };
      socket.emit("role", "host");
    } else socket.emit("role", "viewer");
  });

  socket.on("video-load", d => {
    if (rooms[d.room]?.host === socket.id)
      socket.to(d.room).emit("video-load", d);
  });

  socket.on("video-event", d => {
    if (rooms[d.room]?.host === socket.id)
      socket.to(d.room).emit("video-event", d);
  });

  socket.on("chat", d => socket.to(d.room).emit("chat", d));

  socket.on("offer", d => socket.to(d.room).emit("offer", d));
  socket.on("answer", d => socket.to(d.room).emit("answer", d));
  socket.on("ice", d => socket.to(d.room).emit("ice", d));

  socket.on("disconnect", () => {
    for (const r in rooms)
      if (rooms[r].host === socket.id) delete rooms[r];
  });
});

server.listen(3000, () => console.log("http://localhost:3000"));
