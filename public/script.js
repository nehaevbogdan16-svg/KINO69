const socket = io();
const room = location.pathname.replace("/", "") || "main";

let player;
let ignore = false;

// подключение к комнате
socket.emit("join", {
  room,
  code: document.getElementById("roomCode")?.value || null
});

// YouTube API
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("player", {
    height: "450",
    width: "100%",
    playerVars: {
      controls: 1
    },
    events: {
      onStateChange: onPlayerStateChange
    }
  });
};

// обработка play / pause
function onPlayerStateChange(event) {
  if (ignore) return;

  if (event.data === YT.PlayerState.PLAYING) {
    socket.emit("sync", {
      type: "play",
      time: player.getCurrentTime()
    });
  }

  if (event.data === YT.PlayerState.PAUSED) {
    socket.emit("sync", {
      type: "pause",
      time: player.getCurrentTime()
    });
  }
}

// преобразование ссылки
function getVideoId(url) {
  if (url.includes("youtube.com")) {
    return new URL(url).searchParams.get("v");
  }
  if (url.includes("youtu.be")) {
    return url.split("youtu.be/")[1];
  }
  return null;
}

// загрузка видео
document.getElementById("load").onclick = () => {
  const url = document.getElementById("videoUrl").value.trim();
  const id = getVideoId(url);

  if (!id) {
    alert("Только YouTube");
    return;
  }

  socket.emit("video", id);
  player.loadVideoById(id);
};

// при загрузке видео от другого
socket.on("video", id => {
  ignore = true;
  player.loadVideoById(id);
  setTimeout(() => ignore = false, 500);
});

// синхронизация
socket.on("sync", data => {
  ignore = true;

  player.seekTo(data.time, true);

  if (data.type === "play") player.playVideo();
  if (data.type === "pause") player.pauseVideo();

  setTimeout(() => ignore = false, 500);
});


