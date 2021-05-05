const benchmark = require('benchmark');
const { generateRecords } = require('../database/seedFunctions');

const suite = new benchmark.Suite();

suite
  .add('generate 100 records', {
    defer: true,
    fn: (deferred) => {
      generateRecords(10);
      deferred.resolve();
    },
  })
  .on('complete', () => {
    console.log(`bench time ${suite.times.elapsed}`);
  })
  .run({ async: true });
