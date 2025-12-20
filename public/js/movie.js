const id=new URLSearchParams(location.search).get("id");
fetch('/movies/'+id).then(r=>r.json()).then(m=>{
title.innerText=m.title;description.innerText=m.description;
if(m.video.endsWith('.mp4'))playerContainer.innerHTML=`<video controls src=${m.video}></video>`;
else player.src=m.video;
});
fetch('/movies').then(r=>r.json()).then(a=>{
a.forEach((m,i)=>{if(i!=id&&m.genre==a[id].genre)related.innerHTML+=`<div class=movie><img src=${m.poster}><a href=movie.html?id=${i}>${m.title}</a></div>`})
});