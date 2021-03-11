const express = require('express');
const db = require('../database/model');

const app = express();
const PORT = 3002;

app.use(express.static('./public'));

app.get('/api/about/:id', (req, res) => {
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

app.listen(PORT, () => {
  // console.log(`Listening on port ${PORT}`);
});

module.exports = app;
