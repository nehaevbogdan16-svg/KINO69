const socket = io();
const params = new URLSearchParams(location.search);
const room = params.get("room");

let player;
let isSync = false;

socket.emit("join-room", room);

// ---------- YOUTUBE ----------
function onYouTubeIframeAPIReady() {
    window.YTReady = true;
}

document.getElementById("setBtn").onclick = () => {
    const url = document.getElementById("videoUrl").value;
    const id = extractId(url);
    if (!id) return alert("Только YouTube для синхронизации");

    socket.emit("set-video", { room, id });
};

socket.on("set-video", data => {
    if (player) player.destroy();

    player = new YT.Player("player", {
        videoId: data.id,
        events: {
            onStateChange: onStateChange,
            onReady: e => e.target.playVideo()
        }
    });
});

function onStateChange(event) {
    if (isSync) return;

    const time = player.getCurrentTime();
    const state = event.data;

    socket.emit("sync", {
        room,
        state,
        time
    });
}

socket.on("sync", data => {
    if (!player) return;

    isSync = true;

    if (data.state === YT.PlayerState.PLAYING) {
        player.seekTo(data.time, true);
        player.playVideo();
    }

    if (data.state === YT.PlayerState.PAUSED) {
        player.pauseVideo();
    }

    setTimeout(() => (isSync = false), 300);
});

function extractId(url) {
    if (!url.includes("youtu")) return null;
    return url.includes("v=")
        ? url.split("v=")[1].split("&")[0]
        : url.split("/").pop();
}

// ---------- ЧАТ ----------
function sendChat() {
    const input = document.getElementById("msg");
    socket.emit("chat", { room, text: input.value });
    input.value = "";
}

socket.on("chat", d => {
    document.getElementById("messages").innerHTML += `<p>${d.text}</p>`;
});
