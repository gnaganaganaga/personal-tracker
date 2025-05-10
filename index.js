const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const pg = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Using the DATABASE_URL from .env file
  ssl: { rejectUnauthorized: false },
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'your_secret_key', // Replace this with a strong random string
  resave: false,
  saveUninitialized: false
}));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashed]);
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Signup failed: ' + err.message);
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user.id;
    res.redirect('/dashboard');
  } else {
    res.status(401).send('Invalid login');
  }
});

// Dashboard route (secured)
app.get('/dashboard', async (req, res) => {
  if (!req.session.userId) return res.redirect('/');
  res.send(`<h1>Welcome!</h1><p>More features coming soon...</p>`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
