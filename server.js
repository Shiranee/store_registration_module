const express = require('express');
const path = require('path');  // Import path module
const fs = require('fs');
const { Client } = require('pg');

const app = express();

const client = new Client({
  user: 'postgres',
  host: 'viaduct.proxy.rlwy.net',
  database: 'railway',
  password: 'VvphRVaIHGzWXhEwcnPWUbYxfnkbJSaO',
  port: 51094,
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database!');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

function asyncQuery(connection, sqlQuery) {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'main.html'));
});

// Serve API
app.get('/api/stores', async (req, res) => {
  const query = `
    SELECT
            id,
            status,
            cnpj,
            state_inscription,
            "name",
            name_company,
            delivery_point,
            inaugurated_at::date::text,
            closured_at::date::text,
            created_at::date::text,
            updated_at::date::text
    FROM stores;
  `;

  try {
    const queryResult = await asyncQuery(client, query);
    res.status(200).json(queryResult.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>Page not found!<h1>');
});

// Start the server
app.listen(80, () => {
  console.log('Listening on port 80');
});
