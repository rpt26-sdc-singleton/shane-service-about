const { generateRecords } = require('../database/seedFunctions');

const benchmark = async (n = 0) => {
  const timerName = `generateRecords-${n}`;
  console.time(timerName);
  await generateRecords(n, (records) => {
    records.forEach(record => console.log(record.course_id));
  });
  console.timeEnd(timerName);

};

// 10 million
// benchmark(1e7);

// 500,000 x 20 = 10 million
benchmark(5e5);