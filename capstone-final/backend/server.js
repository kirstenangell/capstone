const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const crypto = require('crypto'); // For generating verification token
const nodemailer = require('nodemailer'); // For sending emails
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',  // Allow all origins (this is not recommended in production)
}));
app.use('/public', express.static('public'));

// Ensure the uploads directory exists
const dir = './public/uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Set up storage options for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');  // Directory to save files
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));  // Prefix the filename with a timestamp
  }
});

// Initialize multer with settings for file upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg and .png formats are allowed!"), false);
    }
  }
});

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Your MySQL root password
  database: 'FlackoDB' // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Contact Form Submission with Email Validation and Verified Check
app.post('/submit-contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the email exists in the database and is verified
    const emailCheckQuery = 'SELECT email, verified FROM users WHERE email = ?';
    const [results] = await db.promise().query(emailCheckQuery, [email]);

    if (results.length === 0 || results[0].verified !== 1) {
      // Return error if email does not exist or is not verified
      return res.status(404).json({ message: 'The email is not verified. Please create an account.' });
    }

    // Insert contact submission into the database
    const insertQuery = 'INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)';
    await db.promise().query(insertQuery, [name, email, message]);

    // Respond with success message
    res.status(200).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error('Error handling contact submission:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
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

// FORGOT PASSWORD LOGIC
// ====================
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log('No email provided');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if the email exists
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    const [user] = await db.promise().query(userQuery, [email]);

    if (user.length === 0) {
      console.log('Email not found in the database');
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');

    // Update the reset token in the database
    const updateTokenQuery = 'UPDATE users SET reset_token = ? WHERE email = ?';
    await db.promise().query(updateTokenQuery, [token, email]);

    // Send reset email
    const resetUrl = `http://localhost:5173/set-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }

      console.log('Reset email sent:', info.response);
      res.status(200).json({ message: 'Password reset link sent to your email.' });
    });
  } catch (err) {
    console.error('Error in forgot password process:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SET PASSWORD LOGIC
// ====================
app.post('/set-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    console.log('Missing token or newPassword');
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Validate the token
    const tokenQuery = 'SELECT * FROM users WHERE reset_token = ?';
    const [user] = await db.promise().query(tokenQuery, [token]);

    if (user.length === 0) {
      console.log('Invalid or expired reset token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    const updatePasswordQuery = 'UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?';
    await db.promise().query(updatePasswordQuery, [hashedPassword, token]);

    console.log('Password updated successfully');
    res.status(200).json({ message: 'Password updated successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error('Error in set password process:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Backend - Update Password API after reset
app.post('/update-password', async (req, res) => {
  const { token, newPassword } = req.body;

  // Validate input
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  // Find the user with the provided reset token
  const query = 'SELECT * FROM users WHERE reset_token = ?';
  db.query(query, [token], async (err, result) => {
    if (err) {
      console.error('Error querying database for reset token:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear reset token
    const updateQuery = 'UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?';
    db.query(updateQuery, [hashedPassword, token], (updateErr) => {
      if (updateErr) {
        console.error('Error updating password:', updateErr);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json({ message: 'Password updated successfully. You can now log in with your new password.' });
    });
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

// Register API with Email Verification
const { body, validationResult } = require('express-validator');

const sendVerificationEmail = (email, token) => {
  const verificationUrl = `http://localhost:5000/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email address
    to: email,                     // Recipient's email address
    subject: 'Verify your email address',
    html: `<p>Please click on the following link to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending verification email:', err);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

// Register API
app.post('/register', [
  // Validation rules
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isLength({ min: 10, max: 12 }).withMessage('Password must be between 10 and 12 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
    .not().matches(/(\d)\1{2,}|([a-zA-Z])\2{2,}/).withMessage('Password should not have repeated or sequential characters')
    .custom((value, { req }) => {
      if (value.includes(req.body.first_name) || value.includes(req.body.last_name) || value.includes(req.body.email.split('@')[0])) {
        throw new Error('Password should not contain personal information like your name or email.');
      }
      return true;
    }),
], async (req, res) => {
  // Validation result check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { first_name, last_name, email, password } = req.body;
  
  // Hash the password and generate a verification token
  const hashedPassword = bcrypt.hashSync(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    // Database query wrapped in try-catch
    const query = 'INSERT INTO users (first_name, last_name, email, password, verification_token) VALUES (?, ?, ?, ?, ?)';
    
    // Execute the query
    db.query(query, [first_name, last_name, email, hashedPassword, verificationToken], (err, result) => {
      if (err) {
        console.error("Database Error:", err); // Log the actual error
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      // Send verification email after successful registration
      sendVerificationEmail(email, verificationToken);

      // Send success response if the registration was successful
      res.status(200).json({ message: 'User registered successfully. Please verify your email.' });
    });
  } catch (err) {
    // Catch any unexpected errors
    console.error("Error during registration:", err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
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

    if (!user.verified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }

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

app.put('/update-product/:id', upload.array('images', 4), (req, res) => {
  const productId = req.params.id;
  const {
    name, type, brand, category, description, price, discount,
    totalPrice, dimensions, color, finish, material, model,
    quantity, totalQuantity, status
  } = req.body;

  let imagePaths = req.files.map(file => file.path);  // Process new uploaded files

  if (!name || !price || !category || imagePaths.length === 0) {
    console.error('Validation error: Missing required fields or no images uploaded');
    return res.status(400).json({ message: 'Product name, price, category, and images are required' });
  }

  const query = `
    UPDATE products 
    SET name = ?, type = ?, brand = ?, category = ?, description = ?, 
        image = ?, price = ?, discount = ?, totalPrice = ?, 
        dimensions = ?, color = ?, finish = ?, material = ?, 
        model = ?, quantity = ?, totalQuantity = ?, status = ? 
    WHERE id = ?
  `;

  db.query(query, [
    name, type, brand, category, description, JSON.stringify(imagePaths), price, discount,
    totalPrice, dimensions, color, finish, material, model, quantity, totalQuantity,
    status, productId
  ], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Update Product API
app.put('/update-product/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.category) {
    console.error('Validation error: Missing required fields for update');
    return res.status(400).json({ message: 'Product name, price, and category are required' });
  }

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
    updatedProduct.description, updatedProduct.image, updatedProduct.price, updatedProduct.discount,
    updatedProduct.totalPrice, updatedProduct.dimensions, updatedProduct.color, updatedProduct.finish,
    updatedProduct.material, updatedProduct.model, updatedProduct.quantity, updatedProduct.totalQuantity,
    updatedProduct.status, productId
  ], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Archive (soft delete) Product API
app.put('/archive-product/:id', (req, res) => {
  const productId = req.params.id;

  const query = `UPDATE products SET archived = true WHERE id = ?`;

  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Error archiving product:', err);
      return res.status(500).json({ message: 'Error archiving product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product archived successfully' });
  });
});

// Get Products API
app.get('/products', (req, res) => {
  const query = 'SELECT * FROM products WHERE archived IS NULL OR archived = false';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error fetching products' });
    }
    res.status(200).json(results);
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
      current_street, current_barangay, current_city, current_province, current_region, current_zip, current_landmark,
      new_street, new_barangay, new_city, new_province, new_region, new_zip, new_landmark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    name, type, email, phone, paymentStatus, paymentReference,
    currentAddress.street, currentAddress.barangay, currentAddress.city, currentAddress.province, currentAddress.region, currentAddress.zipCode, currentAddress.landmark,
    newAddress.street, newAddress.barangay, newAddress.city, newAddress.province, newAddress.region, newAddress.zipCode, newAddress.landmark
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
  const query = `
    SELECT 
      id, name, type, email, phone, payment_status AS paymentStatus, payment_reference AS paymentReference,
      current_street AS currentStreet, current_barangay AS currentBarangay, current_city AS currentCity,
      current_province AS currentProvince, current_region AS currentRegion, current_zip AS currentZip,
      current_landmark AS currentLandmark,
      new_street AS newStreet, new_barangay AS newBarangay, new_city AS newCity,
      new_province AS newProvince, new_region AS newRegion, new_zip AS newZip, new_landmark AS newLandmark,
      archived
    FROM customers
    WHERE archived = 0
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching customers:', err); // Log the exact error
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
        current_street = ?, current_barangay = ?, current_city = ?, current_province = ?, current_region = ?, current_zip = ?, current_landmark = ?,
        new_street = ?, new_barangay = ?, new_city = ?, new_province = ?, new_region = ?, new_zip = ?, new_landmark = ?
    WHERE id = ?
  `;

  db.query(query, [
    name, type, email, phone, paymentStatus, paymentReference,
    currentAddress.street, currentAddress.barangay, currentAddress.city, currentAddress.province, currentAddress.region, currentAddress.zipCode, currentAddress.landmark,
    newAddress.street, newAddress.barangay, newAddress.city, newAddress.province, newAddress.region, newAddress.zipCode, newAddress.landmark,
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

  const query = `UPDATE customers SET archived = true WHERE id = ?`;

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

// Auto-populate product details by productId
app.get('/products/:productId', (req, res) => {
  const { productId } = req.params;

  const query = `SELECT id, name AS productName, category, description AS productDescription, quantity AS quantityAvailable, price AS unitPrice 
                 FROM products 
                 WHERE id = ?`;

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Error fetching product details:', err.sqlMessage || err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(results[0]);
  });
});

  // Add supplier with associated products
  app.post('/add-supplier', (req, res) => {
    const {
      name,
      contactName,
      type,
      email,
      phone,
      status,
      additionalNotes,
      currentAddressType,
      currentStreet,
      currentCity,
      currentProvince,
      currentZipCode,
      currentLandmark,
      newAddressType,
      newStreet,
      newCity,
      newProvince,
      newZipCode,
      newLandmark,
      productLists, // Step 3 products
    } = req.body;
  
    const supplierQuery = `
      INSERT INTO suppliers 
      (name, contact_name, type, email, phone, status, additional_notes, 
      current_address_type, current_address_street, current_address_city, 
      current_address_province, current_address_zip, current_address_landmark, 
      new_address_type, new_address_street, new_address_city, 
      new_address_province, new_address_zip, new_address_landmark, supply_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const supplyId = `SID-${Date.now()}`;
  
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ message: 'Error starting transaction' });
      }
  
      db.query(
        supplierQuery,
        [
          name,
          contactName,
          type,
          email,
          phone,
          status,
          additionalNotes,
          currentAddressType,
          currentStreet,
          currentCity,
          currentProvince,
          currentZipCode,
          currentLandmark,
          newAddressType,
          newStreet,
          newCity,
          newProvince,
          newZipCode,
          newLandmark,
          supplyId,
        ],
        (err, result) => {
          if (err) {
            console.error('Error adding supplier:', err);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error adding supplier', error: err.message });
            });
          }
  
          const supplierId = result.insertId;
  
          // Insert Products
          if (productLists && productLists.length > 0) {
            const productQuery = `
              INSERT INTO supplier_products 
              (supplier_id, product_name, category, product_description, quantity_available, unit_price)
              VALUES (?, ?, ?, ?, ?, ?)
            `;
  
            let completed = 0;
            let hasError = false;
  
            productLists.forEach((product) => {
              const { productName, category, productDescription, quantityAvailable, unitPrice } = product;
  
              db.query(
                productQuery,
                [supplierId, productName, category, productDescription, quantityAvailable, unitPrice],
                (err) => {
                  if (err) {
                    hasError = true;
                    console.error('Error adding product:', err);
                    return db.rollback(() => {
                      res.status(500).json({ message: 'Error adding product', error: err.message });
                    });
                  }
  
                  completed += 1;
  
                  // Commit if all products are inserted
                  if (completed === productLists.length && !hasError) {
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error('Error committing transaction:', err);
                          res.status(500).json({ message: 'Transaction commit failed' });
                        });
                      }
                      res.status(200).json({ message: 'Supplier and products added successfully' });
                    });
                  }
                }
              );
            });
          } else {
            // No products to insert
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ message: 'Transaction commit failed' });
                });
              }
              res.status(200).json({ message: 'Supplier added successfully (no products)' });
            });
          }
        }
      );
    });
  });
  

// Get suppliers and associated products
app.get('/suppliers', (req, res) => {
  const query = `
    SELECT s.*, sp.product_name, sp.category, sp.product_description, sp.quantity_available, sp.unit_price
    FROM suppliers s
    LEFT JOIN supplier_products sp ON s.id = sp.supplier_id
    WHERE s.archived IS NULL OR s.archived = false
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching suppliers:', err);
      return res.status(500).json({ message: 'Error fetching suppliers' });
    }
    res.status(200).json(results);
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

// Fetch all orders from the database
app.get('/orders', (req, res) => {
  const query = `
    SELECT 
      id, 
      firstName, 
      lastName, 
      email, 
      contactNumber, 
      streetName, 
      barangay, 
      city, 
      region, 
      province,
      zipCode, 
      deliveryOption, 
      courier, 
      paymentOption, 
      pickUpTime, 
      pickUpDate, 
      JSON_EXTRACT(products, '$') AS products, 
      price, 
      status, 
      date 
    FROM orders 
    WHERE archived = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    res.status(200).json(results);
  });
});

// Add New Order with Duplicate Check
app.post('/add-order', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    streetName,
    barangay,
    city,
    region,
    province,
    zipCode,
    deliveryOption,
    courier,
    paymentOption,
    pickUpTime,
    pickUpDate,
    products,
    price,
    status,
    date,
    archived,
    newStreet,
    newBarangay,
    newCity,
    newRegion,
    newProvince,
    newZipCode,
    newLandmark,
  } = req.body;
  // Check for duplicate order
  const duplicateCheckQuery = `
    SELECT COUNT(*) AS count FROM orders
    WHERE firstName = ? AND lastName = ? AND email = ? AND contactNumber = ?
      AND streetName = ? AND barangay = ? AND city = ? AND region = ? AND province = ? AND zipCode = ?
      AND deliveryOption = ? AND courier = ? AND paymentOption = ? AND pickUpTime = ? AND pickUpDate = ?
      AND JSON_LENGTH(products) = ? AND archived = 0
  `;

  const checkValues = [
    firstName, lastName, email, contactNumber, streetName, barangay, city, region, province, zipCode,
    deliveryOption, courier, paymentOption, pickUpTime, pickUpDate, products.length,
  ];
  db.query(duplicateCheckQuery, checkValues, (err, results) => {
    if (err) {
      console.error('Error checking for duplicate order:', err);
      res.status(500).json({ message: 'Failed to check for duplicate order.' });
      return;
    }
    if (results[0].count > 0) {
      res.status(400).json({ message: 'Duplicate order detected. Please review your order details.' });
      return;
    }
    // Insert new order if no duplicate is found
    const query = `
      INSERT INTO orders (
        firstName, lastName, email, contactNumber, streetName, barangay, city, region, province, zipCode,
        deliveryOption, courier, paymentOption, pickUpTime, pickUpDate, products, price, status, date, archived,
        newStreet, newBarangay, newCity, newRegion, newProvince, newZipCode, newLandmark
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      firstName, lastName, email, contactNumber, streetName, barangay, city, region, province, zipCode,
      deliveryOption, courier, paymentOption, pickUpTime, pickUpDate, JSON.stringify(products), price,
      status, date, archived, newStreet, newBarangay, newCity, newRegion, newProvince, newZipCode, newLandmark,
    ];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error adding order:', err);
        res.status(500).json({ message: 'Failed to add order.' });
      } else {
        res.status(201).json({ id: result.insertId, message: 'Order added successfully.' });
      }
    });
  });
});

// Update Existing Order with Duplicate Check
app.put('/update-order/:id', (req, res) => {
  const orderId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    contactNumber,
    streetName,
    barangay,
    city,
    region,
    province,
    zipCode,
    deliveryOption,
    courier,
    paymentOption,
    pickUpTime,
    pickUpDate,
    products,
    price,
    status,
    archived,
    newStreet,
    newBarangay,
    newCity,
    newRegion,
    newProvince,
    newZipCode,
    newLandmark,
  } = req.body;
  // Check for duplicate order
  const duplicateCheckQuery = `
    SELECT COUNT(*) AS count FROM orders
    WHERE firstName = ? AND lastName = ? AND email = ? AND contactNumber = ?
      AND streetName = ? AND barangay = ? AND city = ? AND region = ? AND province = ? AND zipCode = ?
      AND deliveryOption = ? AND courier = ? AND paymentOption = ? AND pickUpTime = ? AND pickUpDate = ?
      AND JSON_LENGTH(products) = ? AND archived = 0 AND id != ?
  `;
  const checkValues = [
    firstName, lastName, email, contactNumber, streetName, barangay, city, region, province, zipCode,
    deliveryOption, courier, paymentOption, pickUpTime, pickUpDate, products.length, orderId,
  ];
  db.query(duplicateCheckQuery, checkValues, (err, results) => {
    if (err) {
      console.error('Error checking for duplicate order:', err);
      res.status(500).json({ message: 'Failed to check for duplicate order.' });
      return;
    }
    if (results[0].count > 0) {
      res.status(400).json({ message: 'Duplicate order detected. Please review your order details.' });
      return;
    }
    // Update the order if no duplicate is found
    const query = `
      UPDATE orders SET
        firstName = ?, lastName = ?, email = ?, contactNumber = ?, streetName = ?, barangay = ?, city = ?, 
        region = ?, province = ?, zipCode = ?, deliveryOption = ?, courier = ?, paymentOption = ?, 
        pickUpTime = ?, pickUpDate = ?, products = ?, price = ?, status = ?, archived = ?, 
        newStreet = ?, newBarangay = ?, newCity = ?, newRegion = ?, newProvince = ?, newZipCode = ?, newLandmark = ?
      WHERE id = ?
    `;
    const values = [
      firstName, lastName, email, contactNumber, streetName, barangay, city, region, province, zipCode,
      deliveryOption, courier, paymentOption, pickUpTime, pickUpDate, JSON.stringify(products), price,
      status, archived, newStreet, newBarangay, newCity, newRegion, newProvince, newZipCode, newLandmark, orderId,
    ];
    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ message: 'Failed to update order.' });
      } else {
        res.status(200).json({ message: 'Order updated successfully.' });
      }
    });
  });
});

// Fetch All Orders API
app.get('/orders', (req, res) => {
  const query = `
    SELECT 
      id, 
      firstName, 
      lastName, 
      email, 
      contactNumber, 
      streetName, 
      barangay, 
      city, 
      region, 
      province,
      zipCode, 
      deliveryOption, 
      courier, 
      paymentOption, 
      pickUpTime, 
      pickUpDate, 
      JSON_EXTRACT(products, '$') AS products, 
      price, 
      status, 
      date 
    FROM orders 
    WHERE archived = 0
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching orders:', err);
      return res.status(500).json({ message: 'Error fetching orders' });
    }

    res.status(200).json(results);
  });
});

// Archive Order API
app.put('/archive-order/:id', (req, res) => {
  const orderId = req.params.id;

  const query = `UPDATE orders SET archived = true WHERE id = ?`;

  db.query(query, [orderId], (err, result) => {
    if (err) {
      console.error('Error archiving order:', err);
      return res.status(500).json({ message: 'Error archiving order' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order archived successfully' });
  });
});

app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'SELECT * FROM cart WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching cart data:', err);
      return res.status(500).json({ message: 'Error fetching cart data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No cart data found for this user' });
    }

    res.status(200).json(results);
  });
});

app.post('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const { cartItems } = req.body; // Expected cartItems to be an array of items

  if (!Array.isArray(cartItems)) {
    return res.status(400).json({ message: 'Invalid cart data format' });
  }

  // Begin a database transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ message: 'Error syncing cart data' });
    }

    // Clear existing cart data for the user
    const deleteQuery = 'DELETE FROM cart WHERE user_id = ?';
    db.query(deleteQuery, [userId], (deleteErr) => {
      if (deleteErr) {
        console.error('Error clearing cart data:', deleteErr);
        return db.rollback(() => {
          res.status(500).json({ message: 'Error syncing cart data' });
        });
      }

      // Insert new cart data
      const insertQuery = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
      let completed = 0;
      let hasError = false;

      cartItems.forEach((item) => {
        const { productId, quantity } = item;
        db.query(insertQuery, [userId, productId, quantity], (insertErr) => {
          if (insertErr) {
            hasError = true;
            console.error('Error inserting cart data:', insertErr);
            return db.rollback(() => {
              res.status(500).json({ message: 'Error syncing cart data' });
            });
          }

          completed += 1;
          if (completed === cartItems.length && !hasError) {
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', commitErr);
                  res.status(500).json({ message: 'Error syncing cart data' });
                });
              }

              res.status(200).json({ message: 'Cart synced successfully' });
            });
          }
        });
      });

      // Handle case where there are no items to insert
      if (cartItems.length === 0) {
        db.commit((commitErr) => {
          if (commitErr) {
            return db.rollback(() => {
              console.error('Error committing transaction:', commitErr);
              res.status(500).json({ message: 'Error syncing cart data' });
            });
          }

          res.status(200).json({ message: 'Cart synced successfully' });
        });
      }
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});