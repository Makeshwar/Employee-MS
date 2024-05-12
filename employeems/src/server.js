const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'employeems'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Admin Login
app.post('/api/admin/login', async (req, res, next) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM admins WHERE username = ?';
  db.query(query, [username], async (error, results) => {
    if (error) {
      return next(error);
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = results[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', isAdmin: true });
  });
});

// Admin Registration
app.post('/api/admin/register', async (req, res, next) => {
  const { name, username, password, email, phoneNumber } = req.body;

  if (!name || !username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO admins (name, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?)';
    await db.query(query, [name, username, hashedPassword, email, phoneNumber]);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate entry error
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.error('Error inserting admin credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// HR Login
app.post('/api/hr/login', async (req, res, next) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM hr WHERE username = ?';
  db.query(query, [username], async (error, results) => {
    if (error) {
      return next(error);
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hr = results[0];
    try {
      const isValidPassword = await bcrypt.compare(password, hr.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'Login successful', isAdmin: false });
    } catch (bcryptError) {
      return next(bcryptError);
    }
  });
});

// HR Registration
app.post('/api/hr/register', async (req, res, next) => {
  const { name, username, password, confirmPassword, email, phoneNumber } = req.body;

  if (!name || !username || !password || !confirmPassword || !email || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO hr (name, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?)';
    await db.query(query, [name, username, hashedPassword, email, phoneNumber]);
    res.status(201).json({ message: 'HR registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate entry error
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.error('Error inserting HR credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
