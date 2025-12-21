fetch("movies.json")
  .then(res => res.json())
  .then(movies => {
    const container = document.getElementById("movies");

    movies.forEach(movie => {
      const card = document.createElement("div");
      card.className = "movie";

      card.innerHTML = `
        <img src="${movie.poster}">
        <h2>${movie.title}</h2>
        <p>${movie.description}</p>
        <a class="watch"
           href="watch.html?title=${encodeURIComponent(movie.title)}&video=${encodeURIComponent(movie.video)}">
           Смотреть
        </a>
      `;

      container.appendChild(card);
    });
  });
