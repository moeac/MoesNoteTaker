// express.Router() function creates new router objects
// nanoID is an npm uuid
const notes = require('express').Router();
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');


// GET - Transfers the file to db.json
notes.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, '../db/db.json'))
});

// POST - add note
notes.post("/api/notes", (req, res) => {
    // create a new note object assigning a title, text and id
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: nanoid()
    };
    // reads db.json file and appends newnote to it
    const noteList = JSON.stringify(getDb().concat([newNote]));
    
    fs.writeFile(path.join(__dirname, "../db/db.json"), noteList, function(err) {
        if(err) {
            return console.log(err); 
        }
        console.log(chalk.yellowBright((`SUCCESS! ${req.body.title} HAS BEEN ADDED!`)));
        res.json(newNote);
    });

});

// DELETE note
notes.delete("/api/notes/:id", (req, res) => {
    // gets current note database
    const notesDB = JSON.parse(fs.readFileSync('../db/db.json', 'utf8'));
    // gets id of selected note that you wish to delete
    const noteID = req.params.id;
    // filters through current database and displays notes not matching id of note selected
    const updatedNotesDB = notesDB.filter((deletedNote) => deletedNote.id !== noteID);

    fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(updatedNotesDB), function(err) {
        if (err) {
            return console.log(err);
        } else {
            console.log("that's it, it's gone, you're never getting this back, kind of like my father's approval... not that i had it to begin with");
            res.json(updatedNotesDB);
        }
    });
})

module.exports = notes;