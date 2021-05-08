const path = require('path');
const { /* generateRecords, */ generateAndSave } = require('../database/seedFunctions');

const tempFilepath = path.join(process.cwd(), 'temp-seed.csv');

// const benchmark = async (n = 0) => {
//   const timerName = `generateRecords-${n}`;
//   console.time(timerName);
//   await generateRecords(n, (records) => {
//     records.forEach((record) => console.log(record.course_id));
//   });

//   console.timeEnd(timerName);
// };

const benchmarkGenerateAndSave = async (n = 0) => {
  const timerName = `generateAndSaveRecords-${n}`;
  console.time(timerName);
  await generateAndSave(n, tempFilepath);

  console.timeEnd(timerName);
};

// 10 million
// benchmark(1e7);

// 500,000 x 20 = 10 million
// benchmark(5e5);
benchmarkGenerateAndSave(1);
