const socket = io();

const room = location.pathname.replace("/", "") || "main";

const codeInput = document.getElementById("roomCode");
const joinBtn = document.getElementById("join");

const input = document.getElementById("videoUrl");
const loadBtn = document.getElementById("load");
const player = document.getElementById("player");

let joined = false;

joinBtn.onclick = () => {
  socket.emit("join", {
    room,
    code: codeInput.value.trim() || null
  });
};

socket.on("denied", () => {
  alert("Неверный код комнаты");
});

// преобразование ссылки
function toEmbed(url) {
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    if (id) return "https://www.youtube.com/embed/" + id;
  }
  if (url.includes("youtu.be/")) {
    return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1];
  }
  return null;
}

// загрузка видео
loadBtn.onclick = () => {
  const embed = toEmbed(input.value.trim());
  if (!embed) {
    alert("Пока поддерживается только YouTube");
    return;
  }
  socket.emit("video", embed);
  player.src = embed;
};

// получение видео
socket.on("video", url => {
  player.src = url;
});
