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
    let outcomes;

    beforeAll(async () => {
      outcomes = await seedFunctions.generateLearnerCareerOutcomes();
    });
    test('Should return an array of 3 items', () => {
      expect(outcomes.length).toBe(3);
    });
    test('Should be an array of objects', async () => {
      expect(Array.isArray(outcomes)).toBe(true);
      expect(typeof outcomes[0]).toBe('object');
      expect(Array.isArray(outcomes[0])).toBe(false);
    });
    test('Should contain an icon, pct, and outcome param', () => {
      const expectedParams = [
        'icon',
        'pct',
        'outcome',
      ];
      expect(Object.keys(outcomes[0])).toEqual(
        expect.arrayContaining(expectedParams),
      );
    });
  });
  describe('What You Will Learn', () => {
    let whatYouWillLearn;

    beforeAll(async () => {
      whatYouWillLearn = await seedFunctions.generateWhatYouWillLearn();
    });

    test('Should return an array with 4 elements', () => {
      expect(whatYouWillLearn.length).toBe(4);
      expect(Array.isArray(whatYouWillLearn)).toBe(true);
    });
    test('Should return an array of strings', () => {
      for (let i = 0; i < whatYouWillLearn.length; i++) {
        expect(typeof whatYouWillLearn[i]).toBe('string');
      }
    });
  });
  describe('Skills You Will Gain', () => {
    let skills;
    let spyGenerateSkills;

    beforeAll(async () => {
      spyGenerateSkills = jest.spyOn(seedFunctions, 'generateSkillsYouWillGain');
      skills = await seedFunctions.generateSkillsYouWillGain();
    });

    test('Should call generateSkillsYouWillGain', () => {
      expect(spyGenerateSkills).toHaveBeenCalled();
    });
    test('Should return an array with between 0 and 10 elements', () => {
      expect(Array.isArray(skills)).toBe(true);
      expect(skills.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Should create complete records', () => {
    let createdRecords;
    beforeAll(async () => {
      createdRecords = await seedFunctions.generateRecords(1);
    });
    test('Should return an array of objects', () => {
      expect(Array.isArray(createdRecords)).toBe(true);
      expect(Array.isArray(createdRecords[0])).toBe(false);
    });
    test('Should have the correct shape', () => {
      const params = [
        'course_id',
        'recent_views',
        'description',
        'learner_career_outcomes',
        'metadata',
        'what_you_will_learn',
        'skills_you_will_gain',
      ];
      expect(Object.keys(createdRecords[0])).toEqual(expect.arrayContaining(params));
    });
  });
});
