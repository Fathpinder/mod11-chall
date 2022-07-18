const fs = require('fs');
const path = require('path');
const express = require('express');
const generateUniqueId = require('generate-unique-id');
const notes = require('./db/db.json');
const PORT = process.env.PORT || 3002;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    // res.json(notes);
    try {
        const data = fs.readFileSync('./db/db.json', 'utf8');
        console.log(JSON.parse(data));
        res.json(JSON.parse(data));
    } catch (err) {
        console.error(err);
    }
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    let data = {
        id: generateUniqueId(),
        title: req.body.title,
        text: req.body.text
    }

    try {
        const currentNotes = fs.readFileSync('./db/db.json', 'utf8');
        const parsedNotes = JSON.parse(currentNotes);
        const updatedNotesArray = [...parsedNotes, data]
        fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotesArray));
    } catch (err) {
        console.error(err);
    }
});

app.delete('/api/notes/:id', (req, res) => {
    remainingNotes = notes.filter(data => data.id != req.params.id);
    fs.writeFile('./db/db.json', JSON.stringify(remainingNotes), () => {
        res.json(remainingNotes);
    })
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
