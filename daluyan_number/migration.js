// This is a one-time setup script.
// It connects to our database and creates the necessary table.

const { Client } = require('pg');
require('dotenv').config();

// IMPORTANT: Replace this with your ACTUAL connection string from Render.
const connectionString = process.env.DATABASE_URL;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS random_numbers (
    id SERIAL PRIMARY KEY,
    value INT NOT NULL UNIQUE
  );
`;

const migration = async () => {
  console.log('Connecting to the remote vault...');
  
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connection successful. Sending blueprint...');
    
    await client.query(createTableQuery);
    console.log('Blueprint received. "random_numbers" table is ready.');

  } catch (err) {
    console.error('Mission failed. Could not set up the database:', err);
  } finally {
    await client.end();
    console.log('Connection to vault terminated.');
  }
};

// Execute the mission.
migration();