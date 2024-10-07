const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Flackoautoinc1990', // Your MySQL root password
  database: 'FlackoDB'          // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Login API
// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email contains 'flacko1990'
  if (!email.includes('flacko1990')) {
    return res.status(403).json({ message: 'Unauthorized: Only Flacko users can log in' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error querying database during login:', err); // Log any errors
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err); // Log any errors
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (isMatch) {
        res.status(200).json({ message: 'Login successful', user });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    });
  });
});


// Register API
app.post('/register', (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Input validation
  if (!first_name || !last_name || !email || !password) {
    console.error('Validation error: Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [first_name, last_name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error('Error registering user:', err); // Log the specific error
      // Check if email is already registered
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already registered' });
      }
      return res.status(500).json({ message: 'Error registering user' });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

