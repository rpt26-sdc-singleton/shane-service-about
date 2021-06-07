const db = require('../database/model');

module.exports = {
  createListing: async (req, res) => {
    let listing = req.body;

    if (typeof listing !== 'object') {
      res.sendStatus(400);
      return;
    }

    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      try {
        listing = JSON.parse(listing.body);
      } catch (err) {
        console.log(`failed to parse body: ${err}`);

        res.sendStatus(400);
        return;
      }
    }

    if (Object.keys(listing).length < 1) {
      res.sendStatus(400);
      return;
    }

    try {
      const result = await db.createListing(listing);

      if (result.rowCount < 1) {
        throw new Error('did not create listing');
      }
    } catch (err) {
      console.log(`create listing failed: ${err.detail}`);

      if (err.code === '23505') {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    }

    res.sendStatus(201);
  },
  removeListing: async (req, res) => {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      res.sendStatus(404);
      return;
    }

    try {
      await db.removeListing(id);
    } catch (err) {
      console.log(err);

      if (err === 'id must be of type number') {
        res.sendStatus(404);

        return;
      }
    }

    console.log(`removed listing ${id}`);
    res.sendStatus(204);
  },
  getListing: async (req, res) => {
    const { id } = req.params;

    let data = null;

    try {
      data = await db.getOne(id);
    } catch (err) {
      console.log(err);

      if (err === 'Error: not found' || err === 'id must be of type number') {
        res.sendStatus(404);

        return;
      }
    }

    res.send(data).status(200);
  },
  updateListing: async (req, res) => {
    // get updated fields
    const { id } = req.params;
    const listing = req.body;

    if (!id || Number.isNaN(Number(id))) {
      res.sendStatus(404);
      return;
    }

    if (Object.keys(listing).length < 1) {
      res.sendStatus(400);

      return;
    }

    console.log(`updating course ${id} with`);
    console.log(listing);

    // overwrite fields
    try {
      await db.updateListing(id, listing);
    } catch (err) {
      res.status(500).send(err);
      return;
    }

    // report successful update
    res.sendStatus(200);
  },
};
