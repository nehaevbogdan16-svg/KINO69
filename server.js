const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();

const ADMIN_PASSWORD = "10072024";
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({ secret: "kino69", resave: false, saveUninitialized: false }));
app.use(express.static("public"));

function readMovies(){ return JSON.parse(fs.readFileSync("movies.json")); }
function saveMovies(m){ fs.writeFileSync("movies.json", JSON.stringify(m,null,2)); }

app.post("/login",(r,s)=>r.body.password===ADMIN_PASSWORD?(r.session.admin=true,s.sendStatus(200)):s.sendStatus(401));
app.get("/movies",(r,s)=>s.json(readMovies()));
app.get("/movies/:id",(r,s)=>s.json(readMovies()[r.params.id]));
app.post("/movies",(r,s)=>{ if(!r.session.admin)return s.sendStatus(403); const m=readMovies(); m.push(r.body); saveMovies(m); s.sendStatus(200); });

app.listen(PORT,()=>console.log("KINO69 running"));