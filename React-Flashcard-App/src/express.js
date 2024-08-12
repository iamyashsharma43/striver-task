const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'flashcards'
});

db.connect();

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Invalid credentials');
    
    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) return res.status(500).send(err);
      if (!match) return res.status(401).send('Invalid credentials');
      
      const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret');
      res.json({ token });
    });
  });
});

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Access denied');
  
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(403).send('Access denied');
    if (decoded.role !== 'admin') return res.status(403).send('Access denied');
    req.user = decoded;
    next();
  });
};

// Protected admin route
app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome, admin');
});

app.listen(3000, () => {
  console.log('Server running on port 5000');
});
