const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
// DO NOT hardcode this — Render provides it dynamically
const PORT = process.env.PORT;

app.use(cors({ origin: "https://health-ai-frontend-vaqc.vercel.app" }));
app.use(express.json());

// Hardcoded MySQL credentials (NO .env used)
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '17147714Vi@',
  database: 'healthai'
});

// Health check
app.get('/', (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

// Signup
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
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

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM user WHERE email = ?';

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
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

// Start server using Render-provided port
app.listen(PORT, () => {
  console.log(`✅ Server running on Render-assigned port: ${PORT}`);
});


