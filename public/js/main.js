let all=[];const c=document.getElementById("movies");
fetch("/movies").then(r=>r.json()).then(d=>{all=d;render(d)});
function render(l){c.innerHTML="";l.forEach((m,i)=>c.innerHTML+=`<div class=movie><img src=${m.poster}><h3>${m.title}</h3><a href=movie.html?id=${i}>Смотреть</a></div>`);}
search.oninput=()=>{const q=search.value.toLowerCase();render(all.filter(m=>m.title.toLowerCase().includes(q)||(m.genre||"").toLowerCase().includes(q)))};