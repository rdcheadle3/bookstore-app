const express = require('express');
const router = express.Router();
const yup = require('yup');
const bcrypt = require('bcrypt');
const db = require('./database/db.js'); 

// Registration route handler
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Define the validation schema using Yup
  const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  try {
    // Validate the request body against the schema
    await schema.validate(req.body);

    // Check if the username is already taken
    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if the email is already registered
    const existingEmail = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await db.none('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

    return res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});


// Login route handler
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from the database by username
  const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare the provided password with the hashed password stored in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Password is correct, user is authenticated
  return res.status(200).json({ message: 'Login successful' });
});

module.exports = router;
