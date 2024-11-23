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

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log('No email provided');
    return res.status(400).json({ message: 'Email is required' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const query = 'UPDATE users SET reset_token = ? WHERE email = ?';

  db.query(query, [token, email], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Error deleting product' });
    }

    if (result.affectedRows === 0) {
      console.log('Email not found in the database');
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetUrl = `http://localhost:5173/set-password?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Please click the following link to set your new password:</p><a href="${resetUrl}">${resetUrl}</a>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      console.log('Reset email sent:', info.response); // Log for successful email sending
      res.status(200).json({ message: 'Password reset link sent' });
    });
  });
});

// Add Customer API
app.post('/add-customer', (req, res) => {
  console.log('Received add-customer request:', req.body); // Add this log
  const {
    name, type, email, phone, paymentStatus, paymentReference,
    currentAddress, newAddress
  } = req.body;

  const query = `
    INSERT INTO customers (name, type, email, phone, payment_status, payment_reference,
      current_street, current_city, current_province, current_zip, current_landmark,
      new_street, new_city, new_province, new_zip, new_landmark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    name, type, email, phone, paymentStatus, paymentReference,
    currentAddress.street, currentAddress.city, currentAddress.province, currentAddress.zipCode, currentAddress.landmark,
    newAddress.street, newAddress.city, newAddress.province, newAddress.zipCode, newAddress.landmark
  ], (err, result) => {
    if (err) {
      console.error('Error adding customer:', err);
      return res.status(500).json({ message: 'Error adding customer' });
    }
    res.status(200).json({ message: 'Customer added successfully', id: result.insertId });
  });
});
 
// Get Customers API
app.get('/customers', (req, res) => {
  const query = 'SELECT * FROM customers';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err);
      return res.status(500).json({ message: 'Error fetching customers' });
    }
    res.status(200).json(results);
  });
});

// Update Customer API
app.put('/update-customer/:id', (req, res) => {
  const customerId = req.params.id;
  const {
    name, type, email, phone, paymentStatus, paymentReference,
    currentAddress, newAddress
  } = req.body;

  const query = `
    UPDATE customers 
    SET name = ?, type = ?, email = ?, phone = ?, payment_status = ?, payment_reference = ?,
        current_street = ?, current_city = ?, current_province = ?, current_zip = ?, current_landmark = ?,
        new_street = ?, new_city = ?, new_province = ?, new_zip = ?, new_landmark = ?
    WHERE id = ?
  `;

  db.query(query, [
    name, type, email, phone, paymentStatus, paymentReference,
    currentAddress.street, currentAddress.city, currentAddress.province, currentAddress.zipCode, currentAddress.landmark,
    newAddress.street, newAddress.city, newAddress.province, newAddress.zipCode, newAddress.landmark,
    customerId
  ], (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).json({ message: 'Error updating customer' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully' });
  });
});

// Archive (soft delete) Customer API
app.put('/archive-customer/:id', (req, res) => {
  const customerId = req.params.id;

  const query = 'UPDATE customers SET archived = true WHERE id = ?';

  db.query(query, [customerId], (err, result) => {
    if (err) {
      console.error('Error archiving customer:', err);
      return res.status(500).json({ message: 'Error archiving customer' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer archived successfully' });
  });
});


// Password Set API
// Password Set API
// Password Set API
app.post('/set-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    console.log('Missing token or newPassword');
    return res.status(400).json({ message: 'Token and new password are required' });
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

    if (result.length === 0) {
      console.log('Invalid or expired reset token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    console.log('User found with reset token');

    // Ensure this function is asynchronous
async function hashPassword(newPassword) {
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log('New password hashed');
  return hashedPassword; // You might want to return or use the hashed password
}

    // Update user's password, set password_verified to 1, and clear reset token
    const updateQuery = 'UPDATE users SET password = ?, reset_token = NULL, password_verified = 1 WHERE reset_token = ?';
    db.query(updateQuery, [hashedPassword, token], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.status(500).json({ message: 'Server error' });
      }

      if (updateResult.affectedRows === 0) {
        console.log('No rows affected - password not updated');
        return res.status(400).json({ message: 'Failed to update password' });
      }

      console.log('Password updated successfully');
      res.status(200).json({ message: 'Password updated successfully. You can now log in with your new password.' });
    });
  });
});



// Update Password API after reset
// Backend - Update Password API after reset
app.post('/update-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
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

// Update Password API
// Update Password from Password Tab API
app.post('/update-password-tab', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result[0];
    
    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(updateQuery, [hashedPassword, email], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
});


app.get('/user-details', (req, res) => {
  const email = req.query.email;

  const query = `
    SELECT 
  first_name AS firstName, 
  last_name AS lastName, 
  email, 
  contact_number AS contactNumber,
  street,
  barangay,
  city,
  region,
  province,
  zip_code AS zipCode
FROM users
WHERE email = ?;

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

// Define routes
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products WHERE status = 1', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity } = req.body;
  const sql = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
  db.query(sql, [userId, productId, quantity], (error, results) => {
    if (error) return res.status(500).send('Error adding to cart');
    res.send('Product added to cart successfully');
  });
});

// This assumes you have session middleware set up, like express-session
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      req.session.user = results[0]; // Store user info in session
      res.json({ message: 'Logged in successfully' });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  });
});

app.get('/api/current-user', (req, res) => {
  if (req.session.user) {
    res.json({ userId: req.session.user.id, name: req.session.user.name });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
