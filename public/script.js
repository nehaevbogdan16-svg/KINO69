const socket = io();

// название комнаты = часть ссылки
// /room1  /friends  /private123
const room = location.pathname.replace("/", "") || "main";
socket.emit("join", room);

const input = document.getElementById("videoUrl");
const btn = document.getElementById("load");
const player = document.getElementById("player");

// преобразование ссылки в embed
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
btn.onclick = () => {
  const embed = toEmbed(input.value.trim());

  if (!embed) {
    alert("Пока поддерживается только YouTube");
    return;
  }

  socket.emit("video", embed);
  player.src = embed;
};

// получение видео от других
socket.on("video", url => {
  player.src = url;
});
