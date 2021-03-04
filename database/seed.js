const mongoose = require('mongoose');
const axios = require('axios');
const { descriptionSchema } = require('./db.js');

const Description = mongoose.model('Description', descriptionSchema);

const generateRecords = async () => {
  const records = [];
  for (let i = 1; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const description = await axios.get('https://baconipsum.com/api/?type=meat-and-filler&paras=4&format=text');
    const item = {
      course_id: i,
      recent_views: Math.floor(Math.random() * 1000000),
      description: description.data,
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
