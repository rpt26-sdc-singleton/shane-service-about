// Combined into a single file here to make testing more consistent
// Allows testing the seed functions without the database

const path = require('path');
const { generateAndSave } = require('./seedFunctions');

if (process.argv.length > 2) {
  const seedingType = process.argv[2];

  if (seedingType === 'save') {
    // create csv file
    generateAndSave(1000, path.join(process.cwd(), 'seed.csv'));
    console.log('saving data to disk');
  } else if (seedingType === 'load') {
    // check if generated data file exists
    //   - load data into database
    // save to disk
    // console.log(generateRecords(1e7));
    console.log('loading data from disk into db');
  }

  process.exit(0);
}

// generate data and do something in memory
console.log('working with data in-memory');
