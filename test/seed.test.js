/* eslint-disable no-undef */
const { generateRandomPercentage } = require('../database/seed.js');

describe('Should seed database with realistic data', () => {
  test('Creates a random percentage between 0 and 100', (done) => {
    expect(generateRandomPercentage()).toBeLessThanOrEqual(1);
    expect(generateRandomPercentage()).toBeGreaterThanOrEqual(0);
    done();
  });
  test('adding another test', () => {
    expect(true).toBe(true);
  });
});
