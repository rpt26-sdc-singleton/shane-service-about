const path = require('path');
const heapdump = require('heapdump');
const { /* generateRecords, */ generateAndSave } = require('../database/seedFunctions');

const tempFilepath = path.join(process.cwd(), 'temp-seed.csv');

const benchmarkGenerateAndSave = async (n = 0) => {
  const timerName = `generateAndSaveRecords-${n}`;
  console.time(timerName);
  await generateAndSave(n, tempFilepath);

  console.timeEnd(timerName);

  heapdump.writeSnapshot((err, filename) => {
    if (err) {
      console.log(`could not write heap dump: ${err}`);
      return;
    }

    console.log(`wrote heap dump to: ${filename}`);
  });
};

// 10 million
// benchmark(1e7);

// 500,000 x 20 = 10 million
// benchmark(5e5);
benchmarkGenerateAndSave(1e3);
