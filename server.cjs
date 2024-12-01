const fs = require('fs');
const express = require('express');
const router = express.Router();
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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Ensure the uploads directory exists
const dir = './public/uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Set up storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');  // Directory to save files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});


// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .png, and .gif formats are allowed!'), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});


// Middleware to handle 1 to 4 image uploads
const uploadImages = upload.array('images', 4);


// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: 'Something went wrong with the file upload!' });
  }
  next();
});


// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Your MySQL root password
  // password: 'pass', // Your MySQL root password
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

    // Prepare the email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: 'rhea.ceo.flacko1990@gmail.com', // Owner's email address
      subject: 'New Inquiry Alert',
      html: `
        <p><strong>Dear Flacko Team,</p>
        <p>I am writing to inform you that a new inquiry has been submitted and requires your attention. Below are the details for your reference:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>What’s next?</strong></p>
        <ol>
          <li>Conduct a thorough review of the inquiry to ensure a complete understanding of ${name.split(' ')[0]}'s request.</li>
          <li>Provide a timely and comprehensive response, addressing all aspects of the inquiry to the best of your ability.</li>
          <li>Should you require any additional information, resources, or clarification to proceed, do not hesitate to inform the team promptly.</li>
        </ol>
        <p>Your responsiveness is appreciated, as it reflects our dedication to excellent service. Thank you for taking care of this!</p>
        <hr />
        <p>This is an automated message from the Flacko Auto Parts Contact Us Form.</p>
      `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Failed to send email, but the message was saved to the database.' });
      }

      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Contact form submitted successfully.' });
    });
  } catch (err) {
    console.error('Error handling contact submission:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Check if email exists and is verified
// Route to check if email exists and is verified
app.get('/check-email', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Replace `users` with your actual table name
    const query = 'SELECT email, verified FROM users WHERE email = ?';
    const [results] = await db.promise().query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (results[0].verified !== 1) {
      return res.status(403).json({ message: 'Email is not verified' });
    }

    res.status(200).json({ message: 'Email is verified' });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ message: 'Server error' });
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
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Hello,</p>
          <p>We received a request to reset the password for your <strong>Flacko Auto Parts and Accessories</strong> account associated with this email address.</p>
          <p>Click the link below to reset your password:</p>
          <p>
            <a href="${resetUrl}"
               style="display: inline-block; background: linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%);
                      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9); color: #ffffff;
                      padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              🔗 Reset Your Password
            </a>
          </p>
          <p>This link will expire in <strong>24 hours</strong> for your security. If you didn’t request a password reset, please ignore this email or contact our support team if you have any concerns.</p>
          <h3>For your security:</h3>
          <ul>
            <li>Never share your password with anyone.</li>
            <li>Use a strong, unique password for your account.</li>
          </ul>
          <p>If you need further assistance, feel free to reach out to our support team at <a href="mailto:flackoauto1990@gmail.com">flackoauto1990@gmail.com</a>.</p>
          <p>Thank you,</p>
          <p>The Flacko Auto Parts and Accessories Team</p>
          <hr>
          <p style="font-size: 12px; color: #777777;">
            Privacy Notice: This email and any attachments are confidential and intended solely for the use of the individual or entity to whom they are addressed. If you have received this email in error, please notify the sender immediately and delete it from your system.
          </p>
        </div>
      `,
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
  const verificationUrl = `http://localhost:5000/verify-email?token=${token}`; // Replace with your actual verification URL
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: email,                    // Recipient's email address
    subject: 'Sign-up Verification',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear,</p>
        <p>We are pleased to welcome you to <strong>Flacko Auto Parts and Accessories. </strong> As part of our commitment to ensuring the security and integrity of your account, we kindly request that you confirm your email address.</p>
        <p>To verify your email, please click on the link below:</p>
        <p>
          <a href="${verificationUrl}"
             style="display: inline-block; background: linear-gradient(45deg, #4B88A3, #040405);
             color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Verify My Email Address
          </a>
        </p>
        <p>Alternatively, you may copy and paste the following URL into your browser:</p>
        <p>${verificationUrl}</p>
        <p>
          <strong>Please note:</strong> This link will expire in <strong>24 hours</strong> for your security. For security purposes, we encourage you to complete the verification process promptly.
        </p>
        <h3>Why is this necessary?</h3>
        <ul>
          <li>To confirm the authenticity of the email address provided during registration.</li>
          <li>To activate your account and grant you full access to Flacko Auto Part and Accessories' features.</li>
          <li>To safeguard your personal information and ensure secure communication.</li>
        </ul>
        <p>If you did not initiate this request or believe this email has reached you in error, no further action is required. Rest assured, your account will remain inactive without verification.</p>
        <p>For assistance or inquiries, please feel free to contact our support team at flackoauto1990@gmail.com. We are available to assist you with any questions or concerns.</p>
        <p>We appreciate your prompt attention to this matter and look forward to serving you.</p>
        <p>Kind regards,</p>
        <p>Flacko Auto Parts and Accessories</p>
        <p>https://www.facebook.com/franvillecaraccessoriesqc</p>
        <hr>
        <p style="font-size: 12px; color: #777777;">
          Privacy Notice: This message and any attachments are intended solely for the individual or entity to whom they are addressed. If you have received this message in error, please notify the sender immediately and delete this email.
        </p>
      </div>
    `,
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
    .isLength({ min: 8, max: 20 }).withMessage('Password must be between 8 and 20 characters long')
    .withMessage('Password must be between 8 and 20 characters long')
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


      res.status(200).send(`
        <div style="
          max-width: 600px;
          margin: 50px auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
          font-family: Arial, sans-serif;
          background: linear-gradient(45deg, #4B88A3 0%, #040405 0%, #4B88A3 180%);
          text-align: center;
          color: white;
        ">
         <h3 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">You Did It! Email Verified!</h3>
 
        <p style="color: #f0f0f0; line-height: 1.5; margin-bottom: 15px; font-size:12px">
          Success! Your email is verified, and your account is officially activated.<br>
          You now have full access to everything <strong>FLACKO AUTO PARTS AND ACCESSORIES</strong> has to offer—tailored just for you.
          We're so glad to have you here!<br> Dive in, and let's make something awesome together.
        </p>
        <p style="color: #f0f0f0; margin-bottom: 20px; font-size:12px">
          You can now go back to the login page and start <br> exploring all the amazing features.
        </p>


      </div>


      <div style="
        background-color: white;
        width: 100%;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;">
      </div>


      `);

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


        res.status(200).json({
          message: 'Login successful',
          userData: {
            id: user.id, // Ensure id is included
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
          },
          role: user.email.includes('flacko1990') ? 'admin' : 'customer',
        });

      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    });
  });
});


// Fetch User Details API
app.get('/user-details', (req, res) => {
  const email = req.query.email;


  if (!email) {
    console.error('Email query parameter is missing');
    return res.status(400).json({ message: 'Email query parameter is required' });
  }


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


// Product creation API with image upload
app.post('/add-product', (req, res) => {
  uploadImages(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors
      return res.status(400).json({ message: 'Multer error', error: err.message });
    } else if (err) {
      // Handle other errors
      return res.status(500).json({ message: 'Server error', error: err.message });
    }


    const {
      name,
      type,
      brand,
      category,
      description,
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


    const imagePaths = req.files.map((file) =>
      file.path.replace(/\\/g, '/') // Normalize path for cross-platform compatibility
    );


    if (!name || !price || !category || imagePaths.length === 0) {
      return res.status(400).json({ message: 'Missing required fields or images' });
    }


    const query = `INSERT INTO products
      (name, type, brand, category, description, image, price, discount, totalPrice, dimensions, color, finish, material, model, quantity, totalQuantity, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    db.query(
      query,
      [
        name,
        type,
        brand,
        category,
        description,
        imagePaths.join(','), // Save image paths as a comma-separated string
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
      ],
      (err, result) => {
        if (err) {
          console.error('Error adding product:', err);
          return res.status(500).json({ message: 'Error adding product' });
        }
        res.status(200).json({ message: 'Product added successfully' });
      }
    );
  });
});


// Upload Route
app.post('/upload', uploadImages, (req, res) => {
  console.log('Uploaded files:', req.files); // Logs file details
  res.status(200).json({ message: 'Files uploaded successfully!', files: req.files });
});


app.put('/update-product/:id', upload.array('images', 4), (req, res) => {
  const productId = req.params.id;
  const {
    name, type, brand, category, description, price, discount,
    totalPrice, dimensions, color, finish, material, model,
    quantity, totalQuantity, status
  } = req.body;


  let imagePaths = req.files.map(file => file.path.replace(/^public/, ''));  // Process new uploaded files

  if (!name || !price || !category) {
    console.error('Validation error: Missing required fields or no images uploaded');
    return res.status(400).json({ message: 'Product name, price, category, and images are required' });
  }

  if (imagePaths.length === 0) {

    const query = `
    UPDATE products
    SET name = ?, type = ?, brand = ?, category = ?, description = ?, price = ?, discount = ?, totalPrice = ?,
        dimensions = ?, color = ?, finish = ?, material = ?,
        model = ?, quantity = ?, totalQuantity = ?, status = ?
    WHERE id = ?
  `;

    db.query(query, [
      name, type, brand, category, description, price, discount,
      totalPrice, dimensions, color, finish, material, model, quantity, totalQuantity,
      status, productId
    ], (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ message: 'Error updating product' });
      }
      res.status(200).json({ message: 'Product updated successfully' });
    });

  } else {

    const query = `
  UPDATE products
  SET name = ?, type = ?, brand = ?, category = ?, description = ?,
      image = ?, price = ?, discount = ?, totalPrice = ?,
      dimensions = ?, color = ?, finish = ?, material = ?,
      model = ?, quantity = ?, totalQuantity = ?, status = ?
  WHERE id = ?
`;

    db.query(query, [
      name, type, brand, category, description, imagePaths.join(','), price, discount,
      totalPrice, dimensions, color, finish, material, model, quantity, totalQuantity,
      status, productId
    ], (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ message: 'Error updating product' });
      }
      res.status(200).json({ message: 'Product updated successfully' });
    });
  }


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


// Add item to cart
app.post('/api/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid input. Ensure all fields are provided and valid.' });
  }

  try {
    // Check if product exists and validate stock availability
    const [productRows] = await db.promise().query('SELECT id, price, quantity FROM products WHERE id = ?', [product_id]);
    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = productRows[0];
    if (quantity > product.quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.quantity} items available.` });
    }

    // Insert or update cart
    const query = `
      INSERT INTO cart (user_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
    `;
    await db.promise().query(query, [user_id, product_id, quantity, product.price]);

    // Update product stock
    const stockUpdateQuery = `UPDATE products SET quantity = quantity - ? WHERE id = ?`;
    await db.promise().query(stockUpdateQuery, [quantity, product_id]);

    res.status(200).json({ message: 'Product added to cart successfully.' });
  } catch (error) {
    console.error('Error updating cart:', error.message);
    res.status(500).json({ message: 'Server error. Could not add product to cart.' });
  }
});







app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;


  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }


  try {
    // Validate if user ID exists in the database
    const userQuery = `SELECT id FROM users WHERE id = ?`;
    const [userRows] = await db.promise().query(userQuery, [userId]);


    if (userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }


    // Fetch cart items
    const query = `
      SELECT
  c.id AS cartId,
  p.id AS productId,
  p.name,
  p.price,
  c.quantity,
  p.image
  FROM cart c
  JOIN products p ON c.product_id = p.id
  WHERE c.user_id = ?
    `;
    const [rows] = await db.promise().query(query, [userId]);


    res.status(200).json({
      success: true,
      cartItems: rows, // Ensure this matches what the frontend expects
    });
  } catch (err) {
    console.error('Error fetching cart items:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.delete('/api/cart/:cartId', async (req, res) => {
  const { cartId } = req.params;


  if (!cartId) {
    return res.status(400).json({ message: 'Cart ID is required.' });
  }


  try {
    // Check if cart item exists
    const checkQuery = `SELECT * FROM cart WHERE id = ?`;
    const [rows] = await db.promise().query(checkQuery, [cartId]);


    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }


    // Delete the cart item
    const deleteQuery = `DELETE FROM cart WHERE id = ?`;
    await db.promise().query(deleteQuery, [cartId]);


    res.status(200).json({
      message: 'Product removed from cart successfully.',
      deletedItem: rows[0], // Return the deleted item
    });
  } catch (err) {
    console.error('Error removing product from cart:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Fetches all cart items for a given user_id
app.get('/api/cart', (req, res) => {
  const userId = req.query.user_id; // Retrieve the user_id from query params


  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  // Replace with your actual query to fetch cart items for the user
  const query = `SELECT * FROM cart WHERE user_id = ?`;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching cart items' });
    }
    res.status(200).json(results); // Send cart items back to the client
  });
});


router.get('/cart', async (req, res) => {
  const { user_id } = req.query; // Extract user_id from query parameters
  if (!user_id) return res.status(400).send('User ID is required');

  // Fetch cart items from the database
  const cartItems = await db.query('SELECT * FROM cart WHERE user_id = ?', [user_id]);
  res.json(cartItems);
});


router.post('/cart', async (req, res) => {
  const { user_id, product_id, quantity } = req.body; // Extract payload
  if (!user_id || !product_id || !quantity) return res.status(400).send('Missing required fields');

  // Insert into cart database
  await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [user_id, product_id, quantity]);
  res.json({ message: 'Item added to cart successfully' });
});

module.exports = router;

app.put('/api/cart/:cartId', async (req, res) => {
  const { cartId } = req.params; // Extract cartId from the request parameters
  const { quantity } = req.body; // Extract quantity from the request body

  // Validate input
  if (!cartId || typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid cart ID or quantity.' });
  }

  try {
    // Check if the cart item exists
    const [cartItemRows] = await db.promise().query(
      'SELECT product_id, quantity FROM cart WHERE id = ?',
      [cartId]
    );

    if (cartItemRows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    const cartItem = cartItemRows[0];

    // Fetch the product to ensure stock validation
    const [productRows] = await db.promise().query(
      'SELECT quantity AS available_quantity FROM products WHERE id = ?',
      [cartItem.product_id]
    );

    if (productRows.length === 0) {
      return res.status(404).json({ message: 'Product associated with cart item not found.' });
    }

    const availableQuantity = productRows[0].available_quantity;

    // Ensure the updated quantity doesn't exceed the available stock
    if (quantity > availableQuantity + cartItem.quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${availableQuantity + cartItem.quantity} items are available.`,
      });
    }

    // Update the cart quantity
    await db.promise().query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, cartId]
    );

    // Update the product's stock
    const quantityDifference = quantity - cartItem.quantity; // Calculate how much the quantity has changed
    await db.promise().query(
      'UPDATE products SET quantity = quantity - ? WHERE id = ?',
      [quantityDifference, cartItem.product_id]
    );

    res.status(200).json({ message: 'Cart updated successfully.' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});



app.post('/api/cart', async (req, res) => {
  console.log('Payload received:', req.body);
  const { user_id, product_id, quantity } = req.body;

  // Validation block for user_id, product_id, and quantity
  if (!user_id || !product_id || typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ message: 'Invalid input: Ensure all fields are provided and valid.' });
  }

  try {
    // Further logic to check if user and product exist in the database
    const [userRows] = await db.promise().query('SELECT id FROM users WHERE id = ?', [user_id]);
    const [productRows] = await db.promise().query('SELECT id, price, quantity AS available_quantity FROM products WHERE id = ?', [product_id]);

    if (userRows.length === 0 || productRows.length === 0) {
      return res.status(400).json({ message: 'Invalid user or product ID.' });
    }

    const price = productRows[0].price;
    const availableQuantity = productRows[0].available_quantity;

    // Check if the quantity exceeds available stock
    if (quantity > availableQuantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${availableQuantity} items available.` });
    }

    // If quantity is 0, delete the item from the cart
    if (quantity === 0) {
      const deleteQuery = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
      await db.promise().query(deleteQuery, [user_id, product_id]);
      return res.status(200).json({ message: 'Item removed from cart successfully.' });
    }

    // Insert or update the cart item
    const query = `
          INSERT INTO cart (user_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
              quantity = VALUES(quantity),
              price = VALUES(price)
      `;
    await db.promise().query(query, [user_id, product_id, quantity, price]);

    // Update product stock in the products table
    const stockUpdateQuery = `
          UPDATE products
          SET quantity = quantity - ?
          WHERE id = ? AND quantity >= ?
      `;
    await db.promise().query(stockUpdateQuery, [quantity, product_id, quantity]);

    res.status(200).json({ message: 'Cart updated successfully.' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});


// API to save orders
app.post("/api/save-order", (req, res) => {
  const { user, order, orderItems } = req.body;
  // Insert into `orders` table
  const orderQuery = `
    INSERT INTO orders (
      firstName, lastName, email, contactNumber, streetName, barangay, city, region, province, zipCode, 
      deliveryOption, courier, paymentOption, pickUpTime, pickUpDate, products, price, status, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURDATE())
  `;
  db.query(
    orderQuery,
    [
      user.firstName,
      user.lastName,
      user.email,
      user.contactNumber,
      order.address.streetName,
      order.address.barangay,
      order.address.city,
      order.address.region,
      order.address.province,
      order.address.zipCode,
      order.deliveryOption,
      order.courier,
      order.paymentOption,
      order.pickUpTime || null,
      order.pickUpDate || null,
      JSON.stringify(order.products),
      order.total,
    ],
    (err, orderResult) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to save order" });
      }
      const orderId = orderResult.insertId;
      // Insert into `order_items` table
      const orderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?
      `;
      const orderItemsData = orderItems.map((item) => [
        orderId,
        item.productId,
        item.quantity,
        item.unitPrice,
      ]);
      db.query(orderItemsQuery, [orderItemsData], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to save order items" });
        }
        res.json({ success: true, orderId });
      });
    }
  );
});

app.post('/api/buy-now', async (req, res) => {
  const { user, product, quantity, deliveryDetails, paymentOption } = req.body;

  if (!user || !product || !quantity || !deliveryDetails || !paymentOption) {
    return res.status(400).json({ message: 'Invalid input: All fields are required.' });
  }

  try {
    // Begin transaction
    await db.promise().query('START TRANSACTION');

    // Insert into `orders` table
    const orderQuery = `
          INSERT INTO orders (
              firstName, lastName, email, contactNumber, streetName, barangay, city,
              region, province, zipCode, deliveryOption, paymentOption, products, price, status, date
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', CURDATE())
      `;
    const [orderResult] = await db.promise().query(orderQuery, [
      user.firstName, user.lastName, user.email, user.contactNumber,
      deliveryDetails.streetName, deliveryDetails.barangay, deliveryDetails.city,
      deliveryDetails.region, deliveryDetails.province, deliveryDetails.zipCode,
      deliveryDetails.deliveryOption, paymentOption, JSON.stringify([product]), product.price * quantity,
    ]);

    const orderId = orderResult.insertId;

    // Insert into `order_items` table
    const orderItemQuery = `
          INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)
      `;
    await db.promise().query(orderItemQuery, [
      orderId, product.id, quantity, product.price
    ]);

    // Update product stock in `products` table
    const updateStockQuery = `
          UPDATE products SET quantity = quantity - ? WHERE id = ? AND quantity >= ?
      `;
    const [stockResult] = await db.promise().query(updateStockQuery, [
      quantity, product.id, quantity
    ]);

    if (stockResult.affectedRows === 0) {
      throw new Error('Insufficient stock available.');
    }

    // Commit transaction
    await db.promise().query('COMMIT');

    res.status(201).json({ message: 'Order placed successfully.', orderId });
  } catch (error) {
    // Rollback transaction in case of error
    await db.promise().query('ROLLBACK');
    console.error('Error processing Buy Now order:', error.message);
    res.status(500).json({ message: 'Server error. Could not place the order.' });
  }
});


// Fetch orders specific to the user_id with associated order items
app.get('/orders', (req, res) => {
  const userId = parseInt(req.query.user_id, 10); // Parse user_id as an integer
  // Check if userId is valid
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid User ID provided.' });
  }
  // Step 1: Validate if the user exists in the database
  const userValidationQuery = `SELECT id FROM users WHERE id = ? LIMIT 1;`;
  db.query(userValidationQuery, [userId], (userErr, userResults) => {
    if (userErr) {
      console.error('Error validating user:', userErr);
      return res.status(500).json({ message: 'Internal server error while validating user.' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Step 2: Fetch the orders and associated items for the valid user
    const query = `
      SELECT 
        o.id AS order_id,
        o.firstName,
        o.lastName,
        o.email,
        o.contactNumber,
        o.streetName,
        o.barangay,
        o.city,
        o.region,
        o.province,
        o.zipCode,
        o.deliveryOption,
        o.courier,
        o.paymentOption,
        o.pickUpTime,
        o.pickUpDate,
        o.price AS total_price,
        o.status,
        o.date AS order_date,
        oi.id AS order_item_id,
        oi.product_id,
        p.name AS product_name,
        oi.quantity AS item_quantity,
        oi.unit_price AS item_unit_price,
        oi.total_price AS item_total_price
      FROM 
        orders o
      LEFT JOIN 
        order_items oi ON o.id = oi.order_id
      LEFT JOIN 
        products p ON oi.product_id = p.id
      WHERE 
        o.user_id = ? AND o.archived = 0
      ORDER BY 
        o.date DESC, o.id;
    `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user-specific orders:', err);
        return res.status(500).json({ message: 'Internal server error while fetching orders.' });
      }
      // Step 3: Group orders by `order_id` for structured response
      const orders = results.reduce((acc, row) => {
        const {
          order_id,
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
          total_price,
          status,
          order_date,
          order_item_id,
          product_id,
          product_name,
          item_quantity,
          item_unit_price,
          item_total_price,
        } = row;
        // If the order ID is not in the accumulator, add it
        if (!acc[order_id]) {
          acc[order_id] = {
            order_id,
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
            total_price,
            status,
            order_date,
            items: [], // Initialize items array
          };
        }
        // If the current row has order item details, add to the items array
        if (order_item_id) {
          acc[order_id].items.push({
            order_item_id,
            product_id,
            product_name,
            item_quantity,
            item_unit_price,
            item_total_price,
          });
        }
        return acc;
      }, {});
      // Step 4: Respond with grouped orders as an array
      res.status(200).json(Object.values(orders));
    });
  });
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
