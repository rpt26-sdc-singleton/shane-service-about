// Combined into a single file here to make testing more consistent
// Allows testing the seed functions without the database

const path = require('path');
const { generateAndSave } = require('./seedFunctions');

const seedFilePath = path.join(process.cwd(), 'seed.csv');

if (process.argv.length > 2) {
  const seedingType = process.argv[2];

  if (seedingType === 'save') {
    // create csv file
    generateAndSave(1e7, seedFilePath);
    // generateAndSave(1e5, seedFilePath);

    console.log('saving data to disk');
  } else if (seedingType === 'load') {
    // check if generated data file exists
    //   - load data into database

    console.log('loading data from disk into db');
  }
}

// generate data and do something in memory
// console.log('working with data in-memory');
