const http = require('http');
const fs = require('fs');
const url = require('url');

const mainPage = fs.readFileSync(`${__dirname}/templates/main.html`, 'utf-8');

const server = http.createServer((req, res) => {
  pathName = req.url;

  if(pathName === '/' || pathName === '/main') {
    res.end(mainPage);
  } else if(pathName === '/product') {
    res.end('/index.html');
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!<h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('port 8000');
});