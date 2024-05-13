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
    process.exit(1); // Exit process if connection fails
  }
  console.log('Connected to MySQL database');
});

// Admin Login (unchanged)
app.post('/api/admin/login', async (req, res, next) => {
  // ... (existing code for Admin Login)
});

// Admin Registration (unchanged)
app.post('/api/admin/register', async (req, res, next) => {
  // ... (existing code for Admin Registration)
});

// Admin Login (same structure as Admin Login)
app.post('/api/hr/login', async (req, res, next) => {
  // ... (similar code as Admin Login)
});

// HR Registration (minor changes)
app.post('/api/hr/register', async (req, res, next) => {
  const { name, username, password, email, phoneNumber } = req.body;

  if (!name || !username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO hr (name, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?)';
    await db.query(query, [name, username, hashedPassword, email, phoneNumber]);
    res.status(201).json({ message: 'Hr registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate entry error with specific message
      const sqlState = error.sqlState;
      let errorMessage;
      if (sqlState === '23000') {
        errorMessage = 'Username already exists.';
      } else {
        errorMessage = 'Duplicate entry error occurred.';  // Generic message for other cases
      }
      return res.status(400).json({ error: errorMessage });
    } else {
      console.error('Error inserting hr credentials:', error);
      res.status(500).json({ error: 'Internal Server Error' }); // Specific for unexpected DB issues
    }
  }
});

// New endpoint for username availability check
app.get('/api/hr/check-username', async (req, res, next) => {
  const { username } = req.query; // Get username from query parameter

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const query = 'SELECT * FROM hr WHERE username = ?';
    const results = await db.query(query, [username]);

    res.status(200).json({ available: results.length === 0 }); // Respond with availability based on query result
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});

// Global error handler (optional, but recommended)
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  // If error status code is not set, set it to 500 (Internal Server Error)
  res.status(err.status || 500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
