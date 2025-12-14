// ==================
// SOCKET
// ==================
const socket = io();
let room = "";
let role = "viewer";

// ==================
// ROOM FROM URL
// ==================
const params = new URLSearchParams(window.location.search);
const roomFromUrl = params.get("room");
if (roomFromUrl) {
  room = roomFromUrl;
  socket.emit("join-room", room);
}

// ==================
// ROLE
// ==================
socket.on("role", r => {
  role = r;
  alert("Вы " + r);
});

// ==================
// JOIN ROOM
// ==================
function join() {
  const input = document.getElementById("room");
  if (!input.value) {
    alert("Введите комнату");
    return;
  }
  room = input.value;
  history.pushState({}, "", "?room=" + room);
  socket.emit("join-room", room);
}

// ==================
// VIDEO
// ==================
let player = null;

function loadVideo() {
  if (role !== "host") {
    alert("Только ведущий может загружать видео");
    return;
  }

  socket.emit("video-load", {
    room,
    service: service.value,
    url: videoUrl.value,
    time: 0
  });
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "100%",
    videoId: "dQw4w9WgXcQ",
    events: { onStateChange }
  });
}

function onStateChange(e) {
  if (role !== "host") return;

  socket.emit("video-event", {
    room,
    state: e.data,
    time: player.getCurrentTime()
  });
}

socket.on("video-event", d => {
  if (!player) return;

  player.seekTo(d.time, true);

  if (d.state === 1) player.playVideo();
  if (d.state === 2) player.pauseVideo();
});

function vkEmbed(url) {
  const m = url.match(/video(-?\d+)_(\d+)/);
  return m
    ? `https://vk.com/video_ext.php?oid=${m[1]}&id=${m[2]}&autoplay=1`
    : null;
}

function rutubeEmbed(url) {
  const id = url.split("/video/")[1];
  return id
    ? `https://rutube.ru/play/embed/${id}?autoplay=1`
    : null;
}

function loadIframe(src) {
  document.getElementById("player").innerHTML =
    `<iframe src="${src}" width="100%" height="360"
      allow="autoplay; fullscreen" allowfullscreen></iframe>`;
}

socket.on("video-load", d => {
  if (d.service === "yt") {
    const id = d.url.includes("v=")
      ? d.url.split("v=")[1].split("&")[0]
      : d.url.split("/").pop();
    player.loadVideoById(id);
  }

  if (d.service === "vk") loadIframe(vkEmbed(d.url));
  if (d.service === "rutube") loadIframe(rutubeEmbed(d.url));
});

// ==================
// CHAT
// ==================
function send() {
  if (!msg.value) return;
  socket.emit("chat", { room, msg: msg.value });
  msg.value = "";
}

socket.on("chat", d => {
  const li = document.createElement("li");
  li.textContent = d.msg;
  chat.appendChild(li);
});

// ==================
// VOICE CHAT (ON / OFF)
// ==================
let voiceEnabled = false;
let pc = null;
let stream = null;

async function toggleVoice() {
  const btn = document.getElementById("voiceBtn");

  if (!voiceEnabled) {
    // ===== ENABLE =====
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      pc.onicecandidate = e => {
        if (e.candidate) {
          socket.emit("ice", { room, candidate: e.candidate });
        }
      };

      pc.ontrack = e => {
        let audio = document.getElementById("remoteAudio");
        if (!audio) {
          audio = document.createElement("audio");
          audio.id = "remoteAudio";
          audio.autoplay = true;
          document.body.appendChild(audio);
        }
        audio.srcObject = e.streams[0];
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { room, offer });

      btn.textContent = "🔇 Выключить мяу";
      voiceEnabled = true;
    } catch (err) {
      alert("Не удалось включить микрофон");
      console.error(err);
    }

  } else {
    // ===== DISABLE =====
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      stream = null;
    }

    if (pc) {
      pc.close();
      pc = null;
    }

    btn.textContent = "🔊 Включить мяу";
    voiceEnabled = false;
  }
}

// ==================
// WEBRTC SIGNALING
// ==================
socket.on("offer", async d => {
  if (!pc) {
    pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });
  }

  await pc.setRemoteDescription(d.offer);
  const ans = await pc.createAnswer();
  await pc.setLocalDescription(ans);
  socket.emit("answer", { room, answer: ans });
});

socket.on("answer", d => {
  if (pc) pc.setRemoteDescription(d.answer);
});

socket.on("ice", d => {
  if (pc) pc.addIceCandidate(d.candidate);
});
