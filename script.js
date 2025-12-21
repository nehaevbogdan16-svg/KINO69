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
        <button class="watch">Смотреть</button>
      `;

      card.querySelector(".watch").onclick = () => {
        sessionStorage.setItem("title", movie.title);
        sessionStorage.setItem("iframe", movie.iframe);
        location.href = "watch.html";
      };

      container.appendChild(card);
    });
  });
