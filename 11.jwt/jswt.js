const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(cors()); // Enable CORS for all origins (adjust as needed)
app.use(
  helmet({
    contentSecurityPolicy: false, // Set to true and configure CSP in production
    crossOriginResourcePolicy: { policy: "cross-origin" },
    hsts: true,
    xssFilter: true,
    ieNoOpen: true,
    hidePoweredBy: true,
    noSniff: true,
    frameguard: { action: "deny" },
  })
); // Basic security headers
app.use(bodyParser.json());

const PORT = 3000;
// In production, SECRET_KEY should be stored in an environment variable.
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Mock user data for demonstration purposes
const users = {
  user1: 'password1',
  user2: 'password2',
};

let students = [];

/**
 * Middleware to verify JWT tokens.
 * Expects header 'Authorization: Bearer <token>'
 */
function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Avoid exposing specifics about token verification failure
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
}

/**
 * POST /login
 * Authenticate user and issue a JWT token
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    const token = jwt.sign({ id: username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ auth: true, token: token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

/**
 * Validate student object structure
 * @param {object} student
 * @returns {boolean}
 */
function isValidStudent(student) {
  if (!student || typeof student !== 'object') return false;
  if (!student.id || typeof student.id !== 'string') return false;
  if (!student.name || typeof student.name !== 'string') return false;
  if (!student.email || typeof student.email !== 'string') return false;
  return true;
}

/**
 * POST /students
 * Add a new student (protected)
 */
app.post('/students', verifyToken, (req, res) => {
  const student = req.body;
  if (!isValidStudent(student)) {
    return res.status(400).json({ error: 'Invalid student data. Required: id (string), name (string), email (string).' });
  }
  if (students.some(s => s.id === student.id)) {
    return res.status(409).json({ error: 'Student ID already exists.' });
  }
  students.push(student);
  res.status(201).json({ message: 'Student added successfully' });
});

/**
 * GET /students
 * Retrieve all students (protected)
 */
app.get('/students', verifyToken, (req, res) => {
  res.json(students);
});

/**
 * GET /students/:id
 * Retrieve a specific student by ID (protected)
 */
app.get('/students/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const student = students.find(s => s.id === id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

/**
 * PUT /students/:id
 * Update a student's data (protected)
 */
app.put('/students/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  const updatedStudent = req.body;
  if (!isValidStudent(updatedStudent)) {
    return res.status(400).json({ error: 'Invalid student data. Required: id (string), name (string), email (string).' });
  }
  let studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex !== -1) {
    if (updatedStudent.id !== id && students.some(s => s.id === updatedStudent.id)) {
      return res.status(409).json({ error: 'Student ID already exists.' });
    }
    students[studentIndex] = updatedStudent;
    res.json({ message: 'Student updated successfully' });
  } else {
    res.status(404).json({ error: 'Student not found' });
  }
});

/**
 * DELETE /students/:id
 * Remove a student (protected)
 */
app.delete('/students/:id', verifyToken, (req, res) => {
  const id = req.params.id;
  let studentIndex = students.findIndex(s => s.id === id);
  if (studentIndex !== -1) {
    students.splice(studentIndex, 1);
    res.json({ message: 'Student deleted successfully' });
  } else {
    res.status(404).json({ error: 'Student not found' });
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
// npm install express body-parser jsonwebtoken cors helmet
// Set SECRET_KEY env variable in production.
