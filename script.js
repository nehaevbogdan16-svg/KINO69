fetch("movies.json")
  .then(res => res.json())
  .then(movies => {
    const container = document.getElementById("movies");

    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${movie.poster}">
        <div class="card-content">
          <h3>${movie.title}</h3>
          <p>${movie.description}</p>
          <a href="watch.html?id=${movie.id}">Смотреть</a>
        </div>
      `;

      container.appendChild(card);
    });
  });
