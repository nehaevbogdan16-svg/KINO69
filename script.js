fetch("movies.json")
  .then(r => r.json())
  .then(movies => {
    const box = document.getElementById("movies");

    movies.forEach(m => {
      const div = document.createElement("div");
      div.innerHTML = `
        <img src="${m.poster}" width="200"><br>
        <b>${m.title}</b><br>
        <p>${m.description}</p>
        <a href="watch.html?id=${m.id}">Смотреть</a>
        <hr>
      `;
      box.appendChild(div);
    });
  });
