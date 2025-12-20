
const id = new URLSearchParams(location.search).get("id");

fetch("/movies/" + id).then(r=>r.json()).then(m=>{
  title.innerText = m.title;
  description.innerText = m.description;
  if (m.video.endsWith(".mp4")) {
    player.outerHTML = `<video controls src="${m.video}" width="100%"></video>`;
  } else {
    player.src = m.video;
  }
});

fetch("/movies").then(r=>r.json()).then(all=>{
  const genre = all[id].genre;
  all.forEach((m,i)=>{
    if (i!=id && m.genre===genre) {
      related.innerHTML += `
        <div class="movie">
          <img src="${m.poster}">
          <a href="movie.html?id=${i}">${m.title}</a>
        </div>`;
    }
  });
});
