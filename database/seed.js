const mongoose = require('mongoose');
const axios = require('axios');
const { descriptionSchema } = require('./db.js');

const Description = mongoose.model('Description', descriptionSchema);

const getRandomPercent = () => (Math.floor(Math.random() * 100) / 100);

const getFillerText = async () => {
  const text = await axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=4&format=text');
  return text.data;
};

const generateRecords = async () => {
  const records = [];
  for (let i = 1; i < 10; i++) {
    const item = {
      course_id: i, // 1 - 100
      recent_views: Math.floor(Math.random() * 1000000), // Random number between 0 and 1 million
      // eslint-disable-next-line no-await-in-loop
      description: await getFillerText(), // Bacon ipsum - 4 paragraphs
      learner_career_outcomes: [
        {
          icon: 'fa-map-signs',
          pct: getRandomPercent(),
          outcome: 'started a new career after completing these courses',
        },
        {
          icon: 'fa-briefcase',
          pct: getRandomPercent(),
          outcome: 'got a tangible career benefit from this course',
        },
        {
          icon: 'fa-money',
          pct: getRandomPercent(),
          outcome: 'got a pay increase or promotion',
        },
      ],
    };
    records.push(item);
  }
  return records;
};

const seedDatabase = async () => {
  const records = await generateRecords();
  Description.insertMany(records, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
};

// on setTimeout to allow database to fully connect
setTimeout(seedDatabase, 500);
