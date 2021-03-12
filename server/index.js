const express = require('express');
const cors = require('cors');
const db = require('../database/model');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.static('./public'));

app.get('/api/about/:id', (req, res) => {
  console.log('new request for ', req.params.id);
  db.getOne(req.params.id)
    .then((data) => {
      if (!data) {
        res.sendStatus(404);
      } else {
        res.send(data).status(200);
      }
    })
    .catch(() => {
      res.sendStatus(404);
    });
});

app.post('/api/about/:id', (req, res) => {
  res.sendStatus(405);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

// Allows the server to listen if it's in dev or prod, but not while testing
if (!process.env.HAS_JOSH_K_SEAL_OF_APPROVAL) {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

module.exports = app;
