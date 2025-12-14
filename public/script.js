const socket = io();

const input = document.getElementById("videoUrl");
const button = document.getElementById("loadVideo");
const iframe = document.getElementById("videoFrame");

// преобразование любой ссылки в embed
function toEmbed(url) {
  // YouTube
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  // VK
  if (url.includes("vk.com/video")) {
    const m = url.match(/video(-?\d+)_(\d+)/);
    if (m) {
      return `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&hd=2`;
    }
  }

  // RuTube
  if (url.includes("rutube.ru/video")) {
    const id = url.split("/video/")[1]?.split("/")[0];
    if (id) {
      return `https://rutube.ru/play/embed/${id}`;
    }
  }

  return null;
}

button.onclick = () => {
  const url = input.value.trim();
  const embed = toEmbed(url);

  if (!embed) {
    alert("Ссылка не поддерживается");
    return;
  }

  socket.emit("video", embed);
};

socket.on("video", (url) => {
  iframe.src = url;
});

