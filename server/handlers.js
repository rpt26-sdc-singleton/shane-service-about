const db = require('../database/model');
// const seed = require('../database/seedFunctions');

module.exports = {
  createListing: async (req, res) => {
    const listing = req.body;

    if (!listing) {
      res.sendStatus(400);
      return;
    }

    try {
      const result = await db.createListing(listing);
      console.log(result);

      if (result < 1) {
        // throw new Error(`did not create listing with id of ${id}`);
        throw new Error('did not create listing');
      }

      console.log('created listing with id');
      // console.log(`created listing with id of ${id}`);

      res.sendStatus(201);
    } catch (err) {
      console.log(`create listing failed: ${err.detail}`);

      if (err.code === '23505') {
        res.sendStatus(409);
      } else {
        res.sendStatus(500);
      }
    }
  },
  // modifyListing: (req, res) => {},
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
    console.log('New request for', id);

    if (!id || Number.isNaN(Number(id))) {
      res.sendStatus(404);
      return;
    }

    let data = null;

    try {
      data = await db.getOne(id);
    } catch (err) {
      console.log(err);

      if (err === 'id must be of type number') {
        res.sendStatus(404);

        return;
      }
    }

    if (!data) {
      res.sendStatus(404);
    } else {
      res.send(data).status(200);
    }
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
