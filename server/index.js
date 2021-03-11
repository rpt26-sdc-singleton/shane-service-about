const express = require('express');
const db = require('../database/model');

const app = express();
const PORT = 3002;

app.use(express.static('./public'));

app.get('/api/about/:id', async (req, res) => {
  const data = await db.getOne(req.params.id);
  if (!data) {
    res.sendStatus(404);
  } else {
    res.send(data).status(200);
  }
});

app.post('/api/about/:id', (req, res) => {
  console.log('post');
  res.sendStatus(405);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  // console.log(`Listening on port ${PORT}`);
});

module.exports = app;
