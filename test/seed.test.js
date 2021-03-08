/* eslint-disable no-undef */
const seedFunctions = require('../database/seedFunctions.js');

describe('Should seed database with realistic data', () => {
  test('Creates a random percentage between 0 and 100', (done) => {
    expect(seedFunctions.generateRandomPercentage()).toBeLessThanOrEqual(1);
    expect(seedFunctions.generateRandomPercentage()).toBeGreaterThanOrEqual(0);
    done();
  });

  test('Should generate random metadata', async (done) => {
    const metadata = await seedFunctions.generateMetadata();
    expect(metadata.length).toBe(5);
    expect(metadata[0].icon).toBe('certificate');
    expect(Array.isArray(metadata)).toBeTruthy();
    done();
  });

  test('Should generate a random number within a given range', (done) => {
    const randomNumber = seedFunctions.generateNumberWithinRange(0, 100);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(100);
    done();
  });

  describe('Should generate random filler text', () => {
    test('Should generate paragraphs by passing in an object with a paras parameter', () => {
      const paras = seedFunctions.generateFillerText({ paras: 2 });
      expect(paras).toBeTruthy();
    });
    test('Should generate sentences by passing in an object with a sentences parameter', () => {
      const sentences = seedFunctions.generateFillerText({ sentences: 3 });
      expect(sentences).toBeTruthy();
    });
  });
  describe('Languages', () => {
    test('Should return an array of languages', async (done) => {
      const languages = seedFunctions.generateLanguageList();
      expect(languages).toBeTruthy();
      expect(languages).toEqual(
        expect.arrayContaining([]),
      );
      done();
    });
  });
  describe('Learner Career Outcomes', () => {
    // TODO: test
  });
  describe('What You Will Learn', () => {
    // TODO: test
  });
  describe('Skills You Will Gain', () => {
    // TODO: test
  });
});
