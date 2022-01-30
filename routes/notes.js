// express.Router() function creates new router objects
// nanoID is an npm uuid
const notes = require('express').Router();
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');


// GET - Transfers the file to db.json
notes.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../db/db.json'))
});

// POST - add note
notes.post("/", (req, res) => {
    
    // assigns parsed db into noteList variable
    const noteList = JSON.parse(fs.readFileSync("./db/db.json"))
    // create a new note object assigning a title, text and id
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: nanoid()
    };
    // append new note to exisiting db
    noteList.push(newNote);
    // 
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);

});

// DELETE note
notes.delete("/:id", (req, res) => {
    // gets current note database
    const notesDB = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    // gets id of selected note that you wish to delete
    const noteID = req.params.id;
    // filters through current database and displays notes not matching id of note selected
    const updatedNotesDB = notesDB.filter((deletedNote) => deletedNote.id !== noteID);

    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotesDB));
    res.json(updatedNotesDB);

});


module.exports = notes;