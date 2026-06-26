const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
const SECRET_KEY = 'your-secret-key';

// Mock user data
const users = {
  user1: 'password1',
  user2: 'password2',
};

let students = [];

// Middleware to verify JWT
function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  // Support 'Bearer <token>' pattern
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  if (!token) {
    return res.status(403).send('No token provided');
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Failed to authenticate token');
    }
    req.userId = decoded.id;
    next();
  });
}

// Login endpoint to get token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    const token = jwt.sign({ id: username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ auth: true, token: token });
  }
  res.status(401).send('Invalid credentials');
});

// Helper function to validate student object
function isValidStudent(student) {
  // Check if student has id, name, and email as string fields (add more checks as needed)
  if (!student || typeof student !== 'object') return false;
  if (!student.id || typeof student.id !== 'string') return false;
  if (!student.name || typeof student.name !== 'string') return false;
  if (!student.email || typeof student.email !== 'string') return false;
  return true;
}

// Create (Add a new student) - Protected
app.post('/students', verifyToken, (req, res) => {
  const student = req.body;
  if (!isValidStudent(student)) {
    return res.status(400).send('Invalid student data. Required: id (string), name (string), email (string).');
  }
  // Check for duplicate id
  if (students.some(s => s.id === student.id)) {
    return res.status(409).send('Student ID already exists.');
  }
  students.push(student);
  res.status(201).send('Student added successfully');
});

// Read (Get all students) - Protected
app.get('/students', verifyToken, (req, res) => {
  res.json(students);
});

// Read (Get a specific student) - Protected
app.get('/students/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const student = students.find(s => s.id === id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).send('Student not found');
  }
});

// Update (Modify a student's data) - Protected
app.put('/students/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const updatedStudent = req.body;
  if (!isValidStudent(updatedStudent)) {
    return res.status(400).send('Invalid student data. Required: id (string), name (string), email (string).');
  }
  let studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex !== -1) {
    // Prevent changing to an existing ID (if different)
    if (updatedStudent.id !== id && students.some(s => s.id === updatedStudent.id)) {
      return res.status(409).send('Student ID already exists.');
    }
    students[studentIndex] = updatedStudent;
    res.send('Student updated successfully');
  } else {
    res.status(404).send('Student not found');
  }
});

// Delete (Remove a student) - Protected
app.delete('/students/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  let studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
    res.send('Student deleted successfully');
  } else {
    res.status(404).send('Student not found');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Usage instructions (for devs):
// mkdir student-api
// cd student-api
// npm init -y
// npm install express body-parser jsonwebtoken
