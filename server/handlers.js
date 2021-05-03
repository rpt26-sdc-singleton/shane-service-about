const db = require('../database/model');
// const seed = require('../database/seedFunctions');

module.exports = {
  createListing: async (req, res) => {
    // let item = {
    //   course_id: 0,
    //   recent_views: Math.floor(Math.random() * 10000000),
    // Random number between 0 and 10 million
    //   description: await seed.generateFillerText({ paras: 4 }), // Bacon ipsum - 4 paragraphs
    //   learner_career_outcomes: await seed.generateLearnerCareerOutcomes(),
    //   metadata: await seed.generateMetadata(),
    //   what_you_will_learn: await seed.generateWhatYouWillLearn(),
    //   skills_you_will_gain: await seed.generateSkillsYouWillGain(),
    // };
    console.log(req.body);
    let listing = req.body;
    const { id } = req.params;

    // const isValidListing = await db.isValidListing(listing);

    // console.log(`is a valid listing: ${isValidListing}`);

    if (!listing || !id) {
      res.sendStatus(400);
      return;
    }

    if (!id || Number.isNaN(Number(id))) {
      res.sendStatus(400);
      return;
    }

    listing.course_id = id;

    console.log(listing);

    try {
      listing = await db.createListing(listing);
    } catch (err) {
      console.log(`create listing failed: ${err}`);
      res.sendStatus(500);

      return;
    }

    console.log(`created listing with id of ${listing.course_id}`);
    res.sendStatus(201);
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
