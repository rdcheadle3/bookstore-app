const express = require('express');
const app = express();
const authRoutes = require('./backend/authRoutes');

// Other server configuration and middleware

// Use the authRoutes
app.use('/api/auth', authRoutes);

// Other routes and middleware

// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
