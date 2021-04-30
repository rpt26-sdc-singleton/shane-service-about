const db = require('../database/model');
const seed = require('../database/seedFunctions');

module.exports = {
  createListing: async (req, res) => {
    let item = {
      course_id: 0,
      recent_views: Math.floor(Math.random() * 10000000), // Random number between 0 and 10 million
      description: await seed.generateFillerText({ paras: 4 }), // Bacon ipsum - 4 paragraphs
      learner_career_outcomes: await seed.generateLearnerCareerOutcomes(),
      metadata: await seed.generateMetadata(),
      what_you_will_learn: await seed.generateWhatYouWillLearn(),
      skills_you_will_gain: await seed.generateSkillsYouWillGain(),
    };

    try {
      item = await db.createListing(item);
    } catch (err) {
      console.log(`create listing failed: ${err}`);
      res.sendStatus(500);

      return;
    }

    console.log(`created listing with id of ${item.course_id}`);
    res.sendStatus(201);
  },
  // modifyListing: (req, res) => {},
  // deleteListing: (req, res) => {},
  getListing: async (req, res) => {
    const { id } = req.params;
    console.log('New request for', id);

    if (!id || Number.isNaN(Number(id))) {
      res.sendStatus(404);
      return;
    }

    let data = null;

    try {
      data = await db.getOne(req.params.id);
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
};
