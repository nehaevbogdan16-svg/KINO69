
const moviesBox = document.getElementById("movies");
const search = document.getElementById("search");
let all = [];

fetch("/movies").then(r=>r.json()).then(d=>{
  all = d;
  render(d);
});

function render(list){
  moviesBox.innerHTML = "";
  if (!list.length) {
    moviesBox.innerHTML = "<p>Фильмы не найдены</p>";
    return;
  }
  list.forEach((m,i)=>{
    moviesBox.innerHTML += `
      <div class="movie">
        <img src="${m.poster}">
        <h3>${m.title}</h3>
        <a href="movie.html?id=${i}">Смотреть</a>
      </div>`;
  });
}

search.oninput = () => {
  const q = search.value.toLowerCase();
  render(all.filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.genre||"").toLowerCase().includes(q)
  ));
};
