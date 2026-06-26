const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory database: Note that this data will be lost when the server restarts.
let students = []; // This will act as our in-memory database

// Helper function to validate student object
function isValidStudent(student) {
    // Require id (number), name (string), and email (string)
    if (!student || typeof student !== 'object') return false;
    if (typeof student.id !== 'number') return false;
    if (!student.name || typeof student.name !== 'string') return false;
    if (!student.email || typeof student.email !== 'string') return false;
    return true;
}

// Create a new student (POST)
app.post('/students', (req, res) => {
    const student = req.body;
    if (!isValidStudent(student)) {
        return res.status(400).send('Invalid student data. Required: id (number), name (string), email (string).');
    }
    // Check for duplicate id
    if (students.some(s => s.id === student.id)) {
        return res.status(409).send('Student ID already exists.');
    }
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

    // Validate update
    const updated = req.body;
    if (!isValidStudent(updated)) {
        return res.status(400).send('Invalid student data. Required: id (number), name (string), email (string).');
    }
    // Prevent changing to an existing ID (if different)
    if (updated.id !== student.id && students.some(s => s.id === updated.id)) {
        return res.status(409).send('Student ID already exists.');
    }
    // Update student details
    Object.assign(student, updated);
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
