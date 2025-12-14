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

  /* ========= ОБЫЧНОЕ IFRAME ВИДЕО ========= */
  socket.on("set-video", data => {
    io.to(data.room).emit("set-video", data);
  });

  /* ========= ЧАТ ========= */
  socket.on("chat", data => {
    io.to(data.room).emit("chat", data);
  });

  /* ========= YOUTUBE SYNC ========= */
  socket.on("load-yt", data => {
    io.to(data.room).emit("load-yt", data);
  });

  socket.on("yt-play", data => {
    socket.to(data.room).emit("yt-play", data);
  });

  socket.on("yt-pause", data => {
    socket.to(data.room).emit("yt-pause", data);
  });

  /* ========= WEBRTC SCREEN SHARE ========= */
  ["offer", "answer", "ice"].forEach(event => {
    socket.on(event, data => {
      socket.to(data.room).emit(event, data);
    });
  });

  /* ========= СТАРОЕ / МОЖНО УБРАТЬ ========= */
  socket.on("sync", data => {
    socket.to(data.room).emit("sync", data);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь вышел");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Сервер запущен на порту", PORT);
});
