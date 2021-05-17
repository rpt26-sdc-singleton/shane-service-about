// Combined into a single file here to make testing more consistent
// Allows testing the seed functions without the database

const path = require('path');
const { generateAndSave, generateRecords } = require('./seedFunctions');

const seedFilePath = path.join(process.cwd(), 'seed.csv');

(async () => {
  if (process.argv.length > 2) {
    const seedingType = process.argv[2];

    if (seedingType === 'save') {
      // create csv file
      const startingID = process.argv[3];
      const endID = process.argv[4];

      if (startingID !== undefined) {
        await generateAndSave(Number(startingID), Number(endID), seedFilePath);
      } else {
        await generateAndSave(1, 1e7, seedFilePath);
      }

      console.log('saving data to disk');
    } else if (seedingType === 'load') {
      // check if generated data file exists
      //   - load data into database

      console.log('loading data from disk into db');
    }

    return;
  }

  // generate data and do something in memory
  console.log('working with data in-memory');
  generateRecords(1, 1e6, (record) => {
    console.log(record.course_id);
  });
})();
