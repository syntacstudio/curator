'use rstrict'
const express = require('express');  
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const app  = express();
const port = 8080;
const date  = new Date();

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/', router);  // path must route to lambda

console.log("curator is live ");
module.exports = app;
module.exports.handler = serverless(app);
