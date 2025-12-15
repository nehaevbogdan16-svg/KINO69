const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

/* ===== ХРАНЕНИЕ ГОЛОСОВЫХ КОМНАТ ===== */
let voiceRooms = {};

io.on("connection", socket => {
  console.log("Пользователь подключился:", socket.id);

  /* ===== ВХОД В КОМНАТУ ===== */
  socket.on("join-room", room => {
    socket.join(room);
    console.log("Вход в комнату:", room);
  });

  /* ===== ВИДЕО ===== */
  socket.on("set-video", data => {
    io.to(data.room).emit("set-video", data);
  });

  /* ===== ЧАТ ===== */
  socket.on("chat", data => {
    io.to(data.room).emit("chat", data);
  });

  /* ===== СИНХРОНИЗАЦИЯ (play / pause) ===== */
  socket.on("sync", data => {
    socket.to(data.room).emit("sync", data);
  });

  /* =====================================================
     🎤 ГОЛОСОВОЙ ЧАТ (WebRTC Signaling)
     ===================================================== */

  socket.on("voice-join", room => {
    socket.join(room);

    if (!voiceRooms[room]) voiceRooms[room] = [];
    voiceRooms[room].push(socket.id);

    // отправляем новому пользователю список остальных
    socket.emit(
      "voice-users",
      voiceRooms[room].filter(id => id !== socket.id)
    );

    console.log("🎤 Вошёл в голос:", room, socket.id);
  });

  socket.on("voice-leave", room => {
    socket.leave(room);

    if (voiceRooms[room]) {
      voiceRooms[room] = voiceRooms[room].filter(id => id !== socket.id);
      socket.to(room).emit("voice-leave", socket.id);
    }

    console.log("🔇 Вышел из голоса:", room, socket.id);
  });

  socket.on("offer", data => {
    io.to(data.to).emit("offer", {
      from: socket.id,
      offer: data.offer
    });
  });

  socket.on("answer", data => {
    io.to(data.to).emit("answer", {
      from: socket.id,
      answer: data.answer
    });
  });

  socket.on("ice", data => {
    io.to(data.to).emit("ice", {
      from: socket.id,
      candidate: data.candidate
    });
  });

  /* ===== ОТКЛЮЧЕНИЕ ===== */
  socket.on("disconnect", () => {
    console.log("Пользователь вышел:", socket.id);

    for (const room in voiceRooms) {
      voiceRooms[room] = voiceRooms[room].filter(id => id !== socket.id);
      socket.to(room).emit("voice-leave", socket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log("Сервер запущен на порту", PORT);
});
