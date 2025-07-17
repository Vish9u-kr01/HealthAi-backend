const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '17147714Vi@',
  database: 'healthai'
});

// Signup: Insert into 'user' table
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ message: 'Signup successful' });
  });
});

// Login: Fetch from 'user' table and verify
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    // const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid password' });
    // }
    
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email
      }
    });
  });
});

app.listen(8081, () => {
  console.log("✅ Server running on http://localhost:8081");
});

