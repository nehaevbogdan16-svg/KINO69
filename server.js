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

  /* ===== ЗАГРУЗКА ВИДЕО (iframe) ===== */
  socket.on("set-video", data => {
    io.to(data.room).emit("set-video", data);
  });

  /* ===== ЧАТ ===== */
  socket.on("chat", data => {
    io.to(data.room).emit("chat", data);
  });

  /* ===== YOUTUBE IFRAME API SYNC ===== */
  socket.on("load-yt", data => {
    // загрузить видео всем
    io.to(data.room).emit("load-yt", data);
  });

  socket.on("yt-play", data => {
    // play у всех, кроме отправителя
    socket.to(data.room).emit("yt-play", data);
  });

  socket.on("yt-pause", data => {
    // pause у всех, кроме отправителя
    socket.to(data.room).emit("yt-pause", data);
  });

  /* ===== ОСТАВИЛ ТВОЙ SYNC (если понадобится) ===== */
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
