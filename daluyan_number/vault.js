// This is a utility script to directly query the remote vault.
// It fetches and displays all saved numbers.

const { Client } = require('pg');

// First, we need to load our secret connection string
// just like our main server does.
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

// This is the SQL command to get all our data, sorted nicely.
const queryText = 'SELECT * FROM random_numbers ORDER BY id ASC;';

const checkVault = async () => {
  // Check if we even have the coordinates
  if (!connectionString) {
    console.error('Mission Aborted: DATABASE_URL not found.');
    console.error('Make sure you have a .env file with your Render connection string.');
    return; // Stop the script
  }
  
  console.log('Connecting to remote vault for intel extraction...');
  
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connection successful. Fetching records...');
    
    const res = await client.query(queryText);
    
    // res.rows is an array of objects, where each object is a row from the table.
    const records = res.rows;

    if (records.length === 0) {
      console.log('\n--- VAULT INTEL ---');
      console.log('Vault is empty. No records found.');
      console.log('-------------------\n');
    } else {
      console.log('\n--- VAULT INTEL ---');
      console.table(records); // console.table() gives a nice, clean table format!
      console.log(`Total records found: ${records.length}`);
      console.log('-------------------\n');
    }

  } catch (err) {
    console.error('Intel Extraction Failed:', err);
  } finally {
    await client.end();
    console.log('Connection terminated.');
  }
};

// Run the intel check.
checkVault();