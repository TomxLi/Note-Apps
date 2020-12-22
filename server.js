// DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");

//Here we tell node to creating an express server
const app = express();

//initial port
const port = process.env.PORT || 8887;

//Set up data parsing
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Set variables
const mainDir = path.join(__dirname, "/public");

//Router
app.get("/notes", function(req, res) {
  res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
  res.sendFile(path.join(mainDir, "index.html"));
});

//Post new notes to db.json
app.post("/api/notes", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  let uniqueID = (savedNotes.length).toString();
  newNote.id = uniqueID;
  savedNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  console.log("New note has been saved into database: ", newNote);
  res.json(savedNotes);
})
//Delete note from db.json
app.delete("/api/notes/:id", function(req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Note ID "${noteID}" has been deleted from database.`);
  savedNotes = savedNotes.filter(currNote => {
      return currNote.id != noteID;
  })
  
  for (currNote of savedNotes) {
      currNote.id = newID.toString();
      newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
})

app.listen(port, function() {
  console.log(`App running at "localhost:${port}".`);
})