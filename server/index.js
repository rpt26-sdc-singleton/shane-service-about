const express = require('express');
const db = require('../database/model');

const app = express();
const PORT = 3002;

app.use(express.static('./public'));

app.get('/api/about/:id', async (req, res) => {
  const data = await db.getOne(req.params.id);
  res.send(data).status(200);
});

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
