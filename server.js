const http = require('http');
const fs = require('fs');
const url = require('url');
const { Client } = require('pg');

// Read HTML and CSS files
const mainPage = fs.readFileSync(`${__dirname}/templates/main.html`, 'utf-8');
const styles = fs.readFileSync(`${__dirname}/templates/style.css`, 'utf-8');
const script = fs.readFileSync(`${__dirname}/templates/script.js`, 'utf-8');

const client = new Client({
  user: 'postgres',
  host: 'viaduct.proxy.rlwy.net',
  database: 'railway',
  password: 'VvphRVaIHGzWXhEwcnPWUbYxfnkbJSaO',
  port: 51094,
});

client.connect().then(() => {
  console.log('Connected to PostgreSQL database!');
}).catch((err) => {
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

const app = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;

  if (pathName === '/' || pathName === '/main') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(mainPage);
  } else if (pathName === '/style.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(styles);
  } else if (pathName === '/script.js') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    res.end(script);
  } else if (pathName === '/api/stores') {
    let query = `
      SELECT
              id
            , status
            , cnpj
            , state_inscription
            , "name"
            , name_company
            , delivery_point
            , inaugurated_at::date::text
            , closured_at::date::text
            , created_at::date::text
            , updated_at::date::text

      FROM stores
    `
    try {
      const queryResult = await asyncQuery(client, query);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(queryResult.rows));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!<h1>');
  }
});

app.listen(8000, '127.0.0.1', () => {
  console.log('Listening on port 8000');
});
