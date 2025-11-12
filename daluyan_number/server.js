// 1. Import our tools
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// 2. Initialize Express app
const app = express();
const port = 4000; // We'll run our engine on this port

// 3. Set up the database connection
//    IMPORTANT: Change these details to match your own Postgres setup!

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'https://daluyan-frontend.onrender.com'
];

// 4. Set up Middleware
app.use(cors()); // Use CORS to allow cross-origin requests
app.use(express.json()); // Allow the server to understand JSON data

// 5. Define our main communication link (API Endpoint)
app.post('/save-number', async (req, res) => {
  const { number } = req.body; // Get the number from the incoming request

  // A quick check to make sure we actually got a number
  if (number === undefined || number < 0 || number > 999) {
    return res.status(400).json({ message: 'Invalid number provided.' });
  }

  const queryText = 'INSERT INTO random_numbers(value) VALUES($1)';
  
  try {
    // Try to run the query
    await pool.query(queryText, [number]);
    res.status(201).json({ message: `Success! Number ${number} saved.` });
  } catch (err) {
    // If the database throws an error...
    if (err.code === '23505') { // '23505' is the specific error code for a UNIQUE constraint violation
      // This is our "duplicate number" case
      res.status(409).json({ message: `Duplicate: ${number} is already in the vault.` });
    } else {
      // For any other kind of error
      console.error(err);
      res.status(500).json({ message: 'Server error. Could not save number.' });
    }
  }
});

// 6. Turn the engine on
app.listen(port, () => {
  console.log(`Engine room is operational on port ${port}`);
});