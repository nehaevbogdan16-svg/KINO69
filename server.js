const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", socket => {
  console.log("Пользователь подключился");

  socket.on("join-room", room => {
    socket.join(room);
    console.log("Вход в комнату:", room);
  });

  socket.on("set-video", data => {
    io.to(data.room).emit("set-video", data);
  });

  socket.on("chat", data => {
    io.to(data.room).emit("chat", data);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь вышел");
  });
  socket.on("sync", data => {
    socket.to(data.room).emit("sync", data);
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Сервер запущен на порту", PORT);
});
