const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'employeems'
};

let pool;

try {
  pool = mysql.createPool(dbConfig);
  console.log('Connected to MySQL database');
} catch (error) {
  console.error('Error connecting to MySQL database:', error);
  process.exit(1);
}

// Admin Registration
app.post('/api/admin/register', async (req, res, next) => {
  const { name, username, password, email, phoneNumber } = req.body;

  if (!name || !username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO admin (name, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?)';
    await pool.query(query, [name, username, hashedPassword, email, phoneNumber]);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error during admin registration:', error);
    if (error.errno === 1062) { // Handle duplicate entry error (ER_DUP_ENTRY)
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});
// Admin Login
app.post('/api/admin/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {

    const query = 'SELECT * FROM admin WHERE username = ?';
    const [results] = await pool.query(query, [username]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = results[0];
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', isAdmin: true });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//Hr Login
app.post('/api/hr/login', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM hr WHERE username = ?';
    const [results] = await pool.query(query, [username]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const hr = results[0];
    const isValidPassword = await bcrypt.compare(password, hr.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', isAdmin: false });
  } catch (error) {
    console.error('Error during hr login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Hr Registration
app.post('/api/hr/register', async (req, res, next) => {
  const { name, username, password, email, phoneNumber } = req.body;

  if (!name || !username || !password || !email || !phoneNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO hr (name, username, password, email, phone_number) VALUES (?, ?, ?, ?, ?)';
    await pool.query(query, [name, username, hashedPassword, email, phoneNumber]);
    res.status(201).json({ message: 'Hr registered successfully' });
  } catch (error) {
    console.error('Error during HR registration:', error);
    if (error.errno === 1062) { // Handle duplicate entry error (ER_DUP_ENTRY)
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});
// Add new employee
app.post('/api/employee/add', async (req, res, next) => {
  const { employeeData } = req.body;

  // Validate employee data (implement validation logic here)
  if (!isValidEmployeeData(employeeData)) {
    return res.status(400).json({ error: 'Invalid employee data' });
  }

  try {
    const query = `
      INSERT INTO employee (
        name, age, gender, employee_id, photo, dob, blood_group, aadhaar_address, marital_status,
        current_address, phone, email, languages_known, 
        emergency_contact1_name, emergency_contact1_relationship, emergency_contact1_number,
        emergency_contact2_name, emergency_contact2_relationship, emergency_contact2_number,
        previous_experience_description, previous_experience_certificates,
        current_salary, department, store_location, aadhaar_front, aadhaar_back, pan_card,
        original_documents_submitted, date_of_joining, kit_issued
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const certificates = employeeData.previousExperience.certificates.map(cert => cert.filename); // Assuming filename property for certificates
    const values = [
      employeeData.name,
      employeeData.age,
      employeeData.gender,
      employeeData.employeeId,
      // Handle photo storage and reference path (replace with your logic)
      employeeData.photo,
      employeeData.dob,
      employeeData.bloodGroup,
      employeeData.aadhaarAddress,
      employeeData.maritalStatus,
      employeeData.currentAddress,
      employeeData.phone,
      employeeData.email,
      employeeData.languagesKnown.join(','), // Join languages into a comma-separated string

      employeeData.emergencyContacts[0].name,
      employeeData.emergencyContacts[0].relationship,
      employeeData.emergencyContacts[0].number,
      employeeData.emergencyContacts[1].name,
      employeeData.emergencyContacts[1].relationship,
      employeeData.emergencyContacts[1].number,

      employeeData.previousExperience.description,
      JSON.stringify(certificates), // Store certificate filenames as JSON string
      employeeData.currentSalary,
      employeeData.department,
      employeeData.storeLocation,
      // Handle Aadhaar, PAN card storage and reference paths (replace with your logic)
      employeeData.aadhaarFront,
      employeeData.aadhaarBack,
      employeeData.panCard,
      employeeData.originalDocumentsSubmitted,
      employeeData.dateOfJoining,
      employeeData.kitIssued,
    ];

    await pool.query(query, values);
    res.status(201).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all employees
app.get('/api/employees', async (req, res, next) => {
  try {
    const query = 'SELECT * FROM employee';
    const [results] = await pool.query(query);
    res.status(200).json({ employees: results });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific employee
app.get('/api/employee/:employeeId', async (req, res, next) => {
  const { employeeId } = req.params;

  try {
    const query = 'SELECT * FROM employee WHERE employee_id = ?';
    const [results] = await pool.query(query, [employeeId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ employee: results[0] });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update employee details
app.put('/api/employee/:employeeId', async (req, res, next) => {
  const { employeeId } = req.params;
  const { employeeData } = req.body;

  // Validate employee data (implement validation logic here)
  if (!isValidEmployeeData(employeeData)) {
    return res.status(400).json({ error: 'Invalid employee data' });
  }

  try {
    const query = `
      UPDATE employee
      SET name = ?, age = ?, gender = ?, employee_id = ?, photo = ?, dob = ?, 
        blood_group = ?, aadhaar_address = ?, marital_status = ?, current_address = ?,
        phone = ?, email = ?, languages_known = ?, 
        emergency_contact1_name = ?, emergency_contact1_relationship = ?, emergency_contact1_number = ?,
        emergency_contact2_name = ?, emergency_contact2_relationship = ?, emergency_contact2_number = ?,
        previous_experience_description = ?, previous_experience_certificates = ?,
        current_salary = ?, department = ?, store_location = ?, aadhaar_front = ?, aadhaar_back = ?, pan_card = ?,
        original_documents_submitted = ?, date_of_joining = ?, kit_issued = ?
      WHERE employee_id = ?
    `;

    const certificates = employeeData.previousExperience.certificates.map(cert => cert.filename); // Assuming filename property for certificates
    const values = [
      employeeData.name,
      employeeData.age,
      employeeData.gender,
      employeeData.employeeId,
      // Handle photo storage and reference path (replace with your logic)
      employeeData.photo,
      employeeData.dob,
      employeeData.bloodGroup,
      employeeData.aadhaarAddress,
      employeeData.maritalStatus,
      employeeData.currentAddress,
      employeeData.phone,
      employeeData.email,
      employeeData.languagesKnown.join(','), // Join languages into a comma-separated string

      employeeData.emergencyContacts[0].name,
      employeeData.emergencyContacts[0].relationship,
      employeeData.emergencyContacts[0].number,
      employeeData.emergencyContacts[1].name,
      employeeData.emergencyContacts[1].relationship,
      employeeData.emergencyContacts[1].number,

      employeeData.previousExperience.description,
      JSON.stringify(certificates), // Store certificate filenames as JSON string
      employeeData.currentSalary,
      employeeData.department,
      employeeData.storeLocation,
      // Handle Aadhaar, PAN card storage and reference paths (replace with your logic)
      employeeData.aadhaarFront,
      employeeData.aadhaarBack,
      employeeData.panCard,
      employeeData.originalDocumentsSubmitted,
      employeeData.dateOfJoining,
      employeeData.kitIssued,
      employeeId,
    ];

    await pool.query(query, values);
    res.status(200).json({ message: 'Employee details updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete employee
app.delete('/api/employee/:employeeId', async (req, res, next) => {
  const { employeeId } = req.params;

  try {
    const query = 'DELETE FROM employee WHERE employee_id = ?';
    await pool.query(query, [employeeId]);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Implement a function to validate employee data (replace with your specific validation logic)
function isValidEmployeeData(employeeData) {
  // Add checks for required fields, data types, and other validation rules
  return true; // Replace with actual validation logic
}

//Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
