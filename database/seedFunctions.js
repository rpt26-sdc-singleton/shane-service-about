/* eslint-disable no-await-in-loop */
// const axios = require('axios');
const faker = require('faker');

// const fillerText = {};

const generateRandomPercentage = () => (Math.floor(Math.random() * 100) / 100);

const generateNumberWithinRange = (min, max) => (Math.floor(Math.random() * (max - min) + min));

const generateFillerText = async (options) => {
  let text;
  if (options.paras) {
    text = faker.lorem.paragraphs(options.paras);
  } else if (options.sentences) {
    text = faker.lorem.sentences(options.sentences);
    // text = await axios.get(`https://baconipsum.com/api/?type=meat-and-filler&sentences=${options.sentences}&format=text`);
  }

  return text;
};

const generateLanguageList = () => {
  const languages = [
    'Arabic',
    'French',
    'Portuguese (European)',
    'Chinese (Simplified)',
    'Italian',
    'Vietnamese',
    'German',
    'Russian',
    'English',
    'Hebrew',
    'Spanish',
    'Hindi',
    'Japanese',
    'Turkish',
    'Gujarati',
    'Polish',
    'Persian',
    'Kannada',
    'Romanian',
  ];
  const sliceStart = generateNumberWithinRange(0, languages.length);
  const sliceEnd = generateNumberWithinRange(sliceStart, languages.length);
  const chosenLanguages = languages.slice(sliceStart, sliceEnd);

  return chosenLanguages;
};

const generateLearnerCareerOutcomes = () => {
  const outcomes = [
    {
      icon: 'careerDirectionSVG',
      pct: generateRandomPercentage(),
      outcome: 'started a new career after completing these courses',
    },
    {
      icon: 'careerBenefitSVG',
      pct: generateRandomPercentage(),
      outcome: 'got a tangible career benefit from this course',
    },
    {
      icon: 'careerPromotionSVG',
      pct: generateRandomPercentage(),
      outcome: 'got a pay increase or promotion',
    },
  ];

  return outcomes;
};

const generateMetadata = () => {
  const randomHours = generateNumberWithinRange(20, 200);
  const subtitleLanguages = `Subtitles: ${generateLanguageList().join(', ')}`;
  const icons = [
    {
      icon: 'sharableCertificateSVG',
      title: 'Shareable Certificate',
      subtitle: 'Earn a Certificate upon completion',
    },
    {
      icon: 'onlineSVG',
      title: '100% online',
      subtitle: 'Start instantly and learn at your own schedule',
    },
    {
      icon: 'deadlinesSVG',
      title: 'Flexible Deadlines',
      subtitle: 'Reset deadlines in accordance to your schedule',
    },
    {
      icon: 'hoursSVG',
      title: `Approx. ${randomHours} hours to complete`,
      subtitle: '',
    },
    {
      icon: 'languagesSVG',
      title: 'English',
      subtitle: subtitleLanguages,
    },
  ];
  return icons;
};

const generateWhatYouWillLearn = async () => {
  const whatYouWillLearn = [];
  for (let i = 0; i < 4; i++) {
    const text = await generateFillerText({ sentences: 2 });
    whatYouWillLearn.push(text);
  }
  return whatYouWillLearn;
};

const generateSkillsYouWillGain = async () => {
  const skills = [];
  const numOfSkills = generateNumberWithinRange(0, 10);
  for (let i = 0; i < numOfSkills; i++) {
    let skill = await generateFillerText({ sentences: 1 });
    if (skill.split(' ').length > 4) {
      const numOfWords = generateNumberWithinRange(2, 4);
      skill = skill.split(' ').slice(0, numOfWords).join(' ');
    }
    skills.push(skill);
  }
  return skills;
};

const generateRecords = async (numToGenerate, onDataFill = () => {}) => {
  let records = [];
  const capacity = 1000;

  for (let i = 1; i <= numToGenerate; i++) {
    console.log(`Creating record ${i}`);
    const item = {
      course_id: i, // 1 - n
      recent_views: Math.floor(Math.random() * 10000000), // Random number between 0 and 10 million
      description: await generateFillerText({ paras: 4 }), // Bacon ipsum - 4 paragraphs
      learner_career_outcomes: await generateLearnerCareerOutcomes(),
      metadata: await generateMetadata(),
      what_you_will_learn: await generateWhatYouWillLearn(),
      skills_you_will_gain: await generateSkillsYouWillGain(),
    };
    records.push(item);

    if (records.length === capacity) {
      console.log(`executing callback function on ${capacity} generated records!`);
      onDataFill(records);
      console.log(`flushing ${capacity} records!`);
      records = [];
    }
  }
  return records;
};

const seedDatabase = async (Description) => {
  console.time('Database Seed');
  const records = await generateRecords(100);
  Description.insertMany(records, (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log(res);
    }
  });
  console.timeEnd('Database Seed');
};

module.exports = {
  generateRandomPercentage,
  generateRecords,
  generateFillerText,
  generateMetadata,
  generateNumberWithinRange,
  generateSkillsYouWillGain,
  generateWhatYouWillLearn,
  generateLanguageList,
  generateLearnerCareerOutcomes,
  seedDatabase,
};
