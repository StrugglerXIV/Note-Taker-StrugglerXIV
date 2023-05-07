const express = require('express');
const fs = require('fs');
const uuid = require('uuid'); // Importing the uuid package for generating unique IDs for each note

const app = express();
const PORT = process.env.PORT || 3000; // Setting the server's port to 3000 or the environment variable PORT, if it exists

app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(express.json()); // Middleware for parsing JSON data
app.use(express.static('public')); // Middleware for serving static files from the 'public' folder

// Route for serving the notes page
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// Route for getting all notes from the 'db.json' file and returning them as JSON
app.get('/api/notes', (req, res) => {
  fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => { // Reading the 'db.json' file
    if (err) throw err; // Throwing an error if there was an error reading the file
    const notes = JSON.parse(data); // Parsing the file data into an array of note objects
    res.json(notes); // Returning the notes as JSON to the client
  });
});

// Route for creating a new note, saving it to the 'db.json' file, and returning it to the client
app.post('/api/notes', (req, res) => {
  const newNote = req.body; // Getting the new note from the request body
  newNote.id = uuid.v4(); // Generating a unique ID for the note using uuid
  fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => { // Reading the 'db.json' file
    if (err) throw err; // Throwing an error if there was an error reading the file
    const notes = JSON.parse(data); // Parsing the file data into an array of note objects
    notes.push(newNote); // Adding the new note to the notes array
    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), (err) => { // Writing the updated notes array to the 'db.json' file
      if (err) throw err; // Throwing an error if there was an error writing the file
      res.json(newNote); // Returning the new note to the client
    });
  });
});

// Route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(__dirname + '/db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== noteId);
      fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json({ id: noteId });
      });
    });
  });

// Route for serving the index page (catch-all route)
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
