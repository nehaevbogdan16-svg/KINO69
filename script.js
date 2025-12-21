fetch("movies.json")
  .then(r => r.json())
  .then(movies => {
    const box = document.getElementById("movies");

    movies.forEach(m => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${m.poster}">
        <div class="card-body">
          <h3>${m.title}</h3>
          <p>${m.description}</p>
          <a href="watch.html?id=${m.id}">Смотреть</a>
        </div>
      `;

      box.appendChild(card);
    });
  });
