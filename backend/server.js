const express = require('express');
const app = express();
const { Pool } = require('pg');

// Create a new pool for connecting to the PostgreSQL database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bookstore_database',
  password: '#Bobc0151#',
  port: 5432, // Replace with your database port if necessary
});

// Enable CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Set up middleware to parse JSON request bodies
app.use(express.json());

// Define a route to fetch all books
app.get('/api/books', async (req, res) => {
  try {
    // Query the database to fetch all books
    const { rows } = await pool.query('SELECT * FROM catalog');

    // Return the books as a JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Start the server
const port = 8000; // Choose a port number
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
