/* eslint-disable no-await-in-loop */
const faker = require('faker');
// const fs = require('fs');
// const stream = require('stream');
// const csv = require('fast-csv');
// const util = require('util');

const generateRandomPercentage = () => (Math.floor(Math.random() * 100) / 100);

const generateNumberWithinRange = (min, max) => (Math.floor(Math.random() * (max - min) + min));

const generateFillerText = (options) => {
  let text;

  if (options.paras) {
    text = faker.lorem.paragraphs(options.paras);
  } else if (options.sentences) {
    text = faker.lorem.sentences(options.sentences);
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

const generateWhatYouWillLearn = () => {
  const whatYouWillLearn = [];
  for (let i = 0; i < 4; i++) {
    const text = generateFillerText({ sentences: 2 });
    whatYouWillLearn.push(text);
  }
  return whatYouWillLearn;
};

const generateSkillsYouWillGain = () => {
  const skills = [];
  const numOfSkills = generateNumberWithinRange(0, 10);
  for (let i = 0; i < numOfSkills; i++) {
    let skill = generateFillerText({ sentences: 1 });
    if (skill.split(' ').length > 4) {
      const numOfWords = generateNumberWithinRange(2, 4);
      skill = skill.split(' ').slice(0, numOfWords).join(' ');
    }
    skills.push(skill);
  }
  return skills;
};

const generateRecord = (id = 1) => {
  let courseID = id;

  if (Number.isNaN(id)) {
    courseID = 1;
  }

  return {
    courseID,
    course_id: courseID, // 1 - n
    // Random number between 0 and 10 million
    recent_views: Math.floor(Math.random() * 10000000),
    description: generateFillerText({ paras: 4 }),
    learner_career_outcomes: generateLearnerCareerOutcomes().splice(0, 1),
    metadata: generateMetadata(),
    what_you_will_learn: generateWhatYouWillLearn(),
    skills_you_will_gain: generateSkillsYouWillGain(),
  };
};

module.exports = {
  generateRandomPercentage,
  generateFillerText,
  generateMetadata,
  generateNumberWithinRange,
  generateSkillsYouWillGain,
  generateWhatYouWillLearn,
  generateLanguageList,
  generateLearnerCareerOutcomes,
  generateRecord,
};
