if (!process.env.CI) {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}
// eslint-disable-next-line global-require
require('newrelic');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const handlers = require('./handlers');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/about/:id', handlers.getListing);

app.post('/api/about/new', handlers.createListing);

app.put('/api/about/:id', handlers.updateListing);

app.delete('/api/about/:id', handlers.removeListing);

app.get('/loaderio-0b44c64b2b2de9b1a921c6d2845827b0.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'loaderio-0b44c64b2b2de9b1a921c6d2845827b0.txt'));
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
