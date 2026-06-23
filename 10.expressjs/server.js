const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory database: Note that this data will be lost when the server restarts.
let students = []; // This will act as our in-memory database

// Create a new student (POST)
app.post('/students', (req, res) => {
    const student = req.body;
    students.push(student);
    res.status(201).send(student);
});

// Read all students (GET)
app.get('/students', (req, res) => {
    res.send(students);
});

// Read a single student (GET)
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Student not found');
    res.send(student);
});

// Update a student (PUT)
app.put('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Student not found');

    // Update student details
    Object.assign(student, req.body);
    res.send(student);
});

// Delete a student (DELETE)
app.delete('/students/:id', (req, res) => {
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    if (studentIndex === -1) return res.status(404).send('Student not found');

    students.splice(studentIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});