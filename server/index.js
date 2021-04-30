const express = require('express');
const cors = require('cors');
const path = require('path');
const handlers = require('./handlers');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.static('./public'));

app.get('/api/about/:id', handlers.getListing);

app.post('/api/about', handlers.createListing);

app.delete('/api/about/:id', handlers.removeListing);

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
