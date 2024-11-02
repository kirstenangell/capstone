const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto'); // For generating verification token
const nodemailer = require('nodemailer'); // For sending emails
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON in requests
app.use(cors({
  origin: '*',  // Allow all origins (in production, restrict to specific domains)
}));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: !true } // Set secure to true if you are using https
}));

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Your MySQL root password
  database: 'FlackoDB' // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Contact Form Submission API
app.post('/submit-contact', (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Insert contact submission into the database
  const query = 'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting contact submission:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.status(200).json({ message: 'Contact form submitted successfully' });
  });
});

// Nodemailer Setup for Sending Emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS   // Your App Password from Google
  },
  secure: false,
  tls: {
    rejectUnauthorized: false
  }
});

// Register API with Email Verification
app.post('/register', (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Input validation
  if (!first_name || !last_name || !email || !password) {
    console.error('Validation error: Missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Generate a verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert user into database
  const query = 'INSERT INTO users (first_name, last_name, email, password, verification_token) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [first_name, last_name, email, hashedPassword, verificationToken], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already registered' });
      }
      return res.status(500).json({ message: 'Error registering user' });
    }

    // Send verification email
    const verificationLink = `http://localhost:5000/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify your email address',
      html: `<p>Please verify your email by clicking on the following link:</p><a href="${verificationLink}">Verify Email</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ message: 'Error sending verification email' });
      }
      res.status(200).json({ message: 'User registered successfully. Please verify your email.' });
    });
  });
});

// Email Verification API
app.get('/verify-email', (req, res) => {
  const { token } = req.query;

  const query = 'SELECT * FROM users WHERE verification_token = ?';
  db.query(query, [token], (err, result) => {
    if (err) {
      console.error('Error querying database for email verification:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update verification status
    const updateQuery = 'UPDATE users SET verified = true, verification_token = NULL WHERE verification_token = ?';
    db.query(updateQuery, [token], (updateErr) => {
      if (updateErr) {
        console.error('Error updating verification status:', updateErr);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).send('<h2>Email successfully verified! You can now log in.</h2>');
    });
  });
});

// Login API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error querying database during login:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];

    // Check if the user is verified
    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

    // Compare entered password with stored hash
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (isMatch) {
        const userData = {
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
        };

        // Send response back with user data
        res.status(200).json({ message: 'Login successful', userData, role: user.email.includes('flacko1990') ? 'admin' : 'customer' });
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    });
  });
});

// Fetch User Details API
app.get('/user-details', (req, res) => {
  const email = req.query.email;

  const query = `
    SELECT first_name AS firstName, last_name AS lastName, email, contact_number AS contactNumber, street, barangay, city, region, province, zip_code AS zipCode 
    FROM users 
    WHERE email = ?
  `;
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result[0]);
  });
});

// Update User Details API
app.put('/update-user-details', (req, res) => {
  const {
    email,
    contactNumber,
    street,
    barangay,
    city,
    region,
    province,
    zipCode
  } = req.body;

  const query = `
    UPDATE users 
    SET contact_number = ?, street = ?, barangay = ?, city = ?, region = ?, province = ?, zip_code = ?
    WHERE email = ?
  `;
  db.query(query, [contactNumber, street, barangay, city, region, province, zipCode, email], (err, result) => {
    if (err) {
      console.error('Error updating user details:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User details updated successfully' });
  });
});

// *** NEW CODE: Add Product API ***
app.post('/add-product', (req, res) => {
  const {
    name,
    type,
    brand,
    category,
    description,
    image,
    price,
    discount,
    totalPrice,
    dimensions,
    color,
    finish,
    material,
    model,
    quantity,
    totalQuantity,
    status
  } = req.body;

  console.log(req.body); // Log the incoming request to check if the data is being sent properly

  const query = `INSERT INTO products 
    (name, type, brand, category, description, image, price, discount, totalPrice, dimensions, color, finish, material, model, quantity, totalQuantity, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [
    name,
    type,
    brand,
    category,
    description,
    image,
    price,
    discount,
    totalPrice,
    dimensions,
    color,
    finish,
    material,
    model,
    quantity,
    totalQuantity,
    status
  ], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ message: 'Error adding product' });
    }
    res.status(200).json({ message: 'Product added successfully' });
  });
});

// *** NEW CODE: Update Product API ***
app.put('/update-product/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  const query = `
    UPDATE products 
    SET name = ?, type = ?, brand = ?, category = ?, description = ?, 
        image = ?, price = ?, discount = ?, totalPrice = ?, 
        dimensions = ?, color = ?, finish = ?, material = ?, 
        model = ?, quantity = ?, totalQuantity = ?, status = ? 
    WHERE id = ?
  `;

  db.query(query, [
    updatedProduct.name, updatedProduct.type, updatedProduct.brand, updatedProduct.category, 
    updatedProduct.description, updatedProduct.image, updatedProduct.price, 
    updatedProduct.discount, updatedProduct.totalPrice, updatedProduct.dimensions, 
    updatedProduct.color, updatedProduct.finish, updatedProduct.material, 
    updatedProduct.model, updatedProduct.quantity, updatedProduct.totalQuantity, 
    updatedProduct.status, productId
  ], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// *** NEW CODE: Get Products API ***
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.status(200).json(results);
  });
});

// *** NEW CODE: Delete Product API ***
app.delete('/delete-product/:id', (req, res) => {
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});

// *** NEW CODE: Add to Cart API ***
app.post('/add-to-cart', (req, res) => {
  console.log("Session User:", req.session.user);  // Log the session data
  if (!req.session.user) {
    return res.status(401).json({ message: "You must be logged in to perform this action." });
  }

  const { productId, quantity } = req.body;
  const userId = req.session.user.id; // assuming your session holds user info

  // SQL to insert the product into the cart
  const sqlInsert = `
    INSERT INTO carts (user_id, product_id, quantity)
    VALUES (?, ?, ?)
  `;
  
  db.query(sqlInsert, [userId, productId, quantity], (err, result) => {
    if (err) {
      console.error('Error adding item to cart:', err);
      return res.status(500).json({ message: 'Failed to add item to cart' });
    }
    res.json({ message: "Product added to cart successfully", cartId: result.insertId });
  });
});

// *** NEW CODE: Buy Now API ***
app.post('/buy-now', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "You must be logged in to perform this action." });
  }

  const { productId, quantity } = req.body;
  const userId = req.session.user.id;

  // Insert to cart and then redirect to the checkout page
  const query = 'INSERT INTO carts (user_id, product_id, quantity, added_on) VALUES (?, ?, ?, NOW())';
  db.query(query, [userId, productId, quantity], (err, result) => {
    if (err) {
      console.error('Error processing buy now:', err);
      return res.status(500).json({ message: 'Error processing buy now' });
    }
    // Redirect or handle logic to proceed to checkout
    res.json({ message: "Proceeding to checkout", cartId: result.insertId });
  });
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
