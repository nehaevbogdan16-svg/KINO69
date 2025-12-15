const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const voiceRooms = {};

io.on("connection", socket => {
  socket.on("join-room", room => {
    socket.join(room);
  });

  socket.on("set-video", data => {
    io.to(data.room).emit("set-video", data);
  });

  socket.on("chat", data => {
    io.to(data.room).emit("chat", data);
  });

  /* ===== YouTube SYNC ===== */
  socket.on("sync", data => {
    io.to(data.room).emit("sync", data);
  });

  /* ===== Voice ===== */
  socket.on("voice-join", room => {
    socket.join(room);
    socket.room = room;

    if (!voiceRooms[room]) voiceRooms[room] = [];
    voiceRooms[room].push(socket.id);

    socket.emit("voice-users", voiceRooms[room].filter(id => id !== socket.id));
  });

  socket.on("offer", d => io.to(d.to).emit("offer", { from: socket.id, offer: d.offer }));
  socket.on("answer", d => io.to(d.to).emit("answer", { from: socket.id, answer: d.answer }));
  socket.on("ice", d => io.to(d.to).emit("ice", { from: socket.id, candidate: d.candidate }));

  socket.on("voice-leave", room => {
    if (!voiceRooms[room]) return;
    voiceRooms[room] = voiceRooms[room].filter(id => id !== socket.id);
    socket.to(room).emit("voice-leave", socket.id);
  });

  socket.on("disconnect", () => {
    for (const r in voiceRooms) {
      voiceRooms[r] = voiceRooms[r].filter(id => id !== socket.id);
      socket.to(r).emit("voice-leave", socket.id);
    }
  });
});

http.listen(3000, () => console.log("✅ Сервер запущен"));
