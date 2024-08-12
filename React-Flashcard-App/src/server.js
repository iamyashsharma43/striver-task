const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const config = require('./config');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection(config.db);

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Database connected.');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM admins WHERE email = ?', [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (results.length > 0) {
            const admin = results[0];

            // Direct password comparison
            if (password === admin.password) {
                const token = jwt.sign({ id: admin.id }, config.jwtSecret, { expiresIn: '1h' });
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
