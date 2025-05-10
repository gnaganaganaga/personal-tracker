require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Authentication routes (login/signup)
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username=$1 AND password=$2", [username, password]);
  if (result.rows.length > 0) {
    res.send("Login successful!");
  } else {
    res.send("Invalid username or password.");
  }
});

app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("INSERT INTO users(username, password) VALUES($1, $2)", [username, password]);
  res.send("Signup successful!");
});

// Expense route
app.post("/expenses", async (req, res) => {
  const { amount, description, date } = req.body;
  await pool.query("INSERT INTO expenses(amount, description, date) VALUES($1, $2, $3)", [amount, description, date]);
  res.send("Expense added!");
});

// Work hours route
app.post("/workhours", async (req, res) => {
  const { hours, date } = req.body;
  await pool.query("INSERT INTO work_hours(hours, date) VALUES($1, $2)", [hours, date]);
  res.send("Work hours logged!");
});

// Task route
app.post("/tasks", async (req, res) => {
  const { description, date } = req.body;
  await pool.query("INSERT INTO tasks(description, date) VALUES($1, $2)", [description, date]);
  res.send("Task added!");
});

// Workout route
app.post("/workouts", async (req, res) => {
  const { type, duration, date } = req.body;
  await pool.query("INSERT INTO workouts(type, duration, date) VALUES($1, $2, $3)", [type, duration, date]);
  res.send("Workout logged!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
