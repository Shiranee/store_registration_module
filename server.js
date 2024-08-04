const express = require('express');
const path = require('path');
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

function asyncQuery(connection, sqlQuery, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sqlQuery, params, (err, result) => {
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
app.get('/stores', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'main.html'));
});

// API endpoint to get all stores
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
    FROM stores
    ORDER BY id;
  `;

  try {
    const queryResult = await asyncQuery(client, query);
    res.status(200).json(queryResult.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get a store by ID
app.get('/api/stores/:id', async (req, res) => {
  console.log('Received request for store ID:', req.params.id); // Debugging line
  const storeId = req.params.id;
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
    FROM stores
    WHERE id = $1;
  `;

  try {
    const queryResult = await asyncQuery(client, query, [storeId]);
    if (queryResult.rows.length > 0) {
      res.status(200).json(queryResult.rows[0]);
    } else {
      res.status(404).json({ error: 'Store not found' });
    }
  } catch (err) {
    console.error('Error fetching store:', err); // Debugging line
    res.status(500).json({ error: err.message });
  }
});


// Serve the main page for specific store IDs
app.get('/stores/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'templates', 'form.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>Page not found!<h1>');
});

// Start the server
app.listen(80, () => {
  console.log('Listening on port 80');
});
