if (!process.env.CI) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
// eslint-disable-next-line global-require
require('newrelic');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const handlers = require('./handlers');

function getLoaderIOFile() {
  const loaderFiles = fs.readdirSync(path.resolve(__dirname)).filter((filename) => filename.endsWith('.txt'));

  return loaderFiles[0];
}

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function getRandomID() {
  const max = 10000000;
  const min = 8999999;

  return Math.floor(Math.random() * (max - min) + min);
}

app.get('/api/loader-io', (req, res) => {
  // hit a random record in the last 10% of the database
  req.params.id = getRandomID();

  handlers.getListing(req, res);
});

app.get('/api/about/:id', handlers.getListing);

app.post('/api/about/new', handlers.createListing);

app.put('/api/about/:id', handlers.updateListing);

app.delete('/api/about/:id', handlers.removeListing);

app.get('/loaderio-:id', (req, res) => {
  const filename = getLoaderIOFile();

  res.sendFile(path.resolve(__dirname, filename));
});

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Allows the server to listen if it's in dev or prod, but not while testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

module.exports = app;
