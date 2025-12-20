
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

app.use(express.json());
app.use(session({
  secret: "kino69_secret",
  resave: false,
  saveUninitialized: false
}));

app.use(express.static("public"));

const MOVIES_FILE = path.join(__dirname, "movies.json");

function readMovies() {
  if (!fs.existsSync(MOVIES_FILE)) return [];
  return JSON.parse(fs.readFileSync(MOVIES_FILE));
}

function saveMovies(movies) {
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
}

app.post("/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.admin = true;
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get("/movies", (req, res) => {
  res.json(readMovies());
});

app.get("/movies/:id", (req, res) => {
  const movies = readMovies();
  const movie = movies[req.params.id];
  if (!movie) return res.sendStatus(404);
  res.json(movie);
});

app.post("/movies", (req, res) => {
  if (!req.session.admin) return res.sendStatus(403);
  const movies = readMovies();
  movies.push(req.body);
  saveMovies(movies);
  res.sendStatus(200);
});

app.listen(PORT, () => console.log("KINO69 running on port " + PORT));
