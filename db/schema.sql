-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE
);

-- Work hours table
CREATE TABLE IF NOT EXISTS work_hours (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  hours NUMERIC(4, 2) NOT NULL,
  date DATE DEFAULT CURRENT_DATE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date DATE DEFAULT CURRENT_DATE
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  date DATE DEFAULT CURRENT_DATE
);
