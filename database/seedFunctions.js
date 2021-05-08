/* eslint-disable no-await-in-loop */
const faker = require('faker');
const fs = require('fs');
const csv = require('fast-csv');

// arrayToJSON iterates through the array to build a string
const arrayToJSON = (array) => {
  const arrToJSON = (arr) => {
    let str = '{';

    for (let i = 0; i < array.length; i++) {
      const element = arr[i];

      if (Array.isArray(element)) {
        str += arrToJSON(element);
        str += ',';
      } else if (typeof element === 'object') {
        const keys = Object.keys(element);

        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          const objElement = element[key];

          str += `"${key}":`;


        }
      } else {
        str += `${element}`;
      }
    }

    str += '}';

    return str;
  };

  return arrToJSON(array);
};

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

const generateRecords = async (numToGenerate, onDataFill = () => {}) => {
  // const capacity = 1000;
  // let records = new Array(capacity);

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

    onDataFill(item);

    // records[i] = item;

    // if (i === numToGenerate) {
    //   onDataFill(records);

    //   break;
    // } else if (i === capacity) {
    //   console.log(`executing callback function on ${capacity} generated records!`);
    //   onDataFill(records);
    //   console.log(`flushing ${capacity} records!`);
    //   records = new Array(capacity);
    // }
  }

  // return records;
};

// generateAndSave saves to .csv
const generateAndSave = async (n, outputPath) => {
  if (outputPath.slice(-4) !== '.csv') {
    throw new Error('output path must include ".csv"');
  }

  const writeStream = csv.format({ headers: true });

  writeStream.pipe(fs.createWriteStream(outputPath));

  await generateRecords(n, (record) => {
    const recordCopy = record;

    // we can assume the rest of the array is empty
    if (!recordCopy) {
      return;
    }

    const keys = Object.keys(recordCopy);

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];

      // nested arrays will be JSON.stringified
      if (Array.isArray(recordCopy[key])) {
        recordCopy[key] = JSON.stringify(recordCopy[key]);
        // .replace('[', '{')
        // .replace(']', '}');
      }
    }

    writeStream.write(recordCopy);
  });

  writeStream.end();
};

const seedDatabase = async (Description) => {
  console.time('Database Seed');
  const records = generateRecords(100);
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
  arrayToJSON,
  generateRandomPercentage,
  generateRecords,
  generateFillerText,
  generateMetadata,
  generateNumberWithinRange,
  generateSkillsYouWillGain,
  generateWhatYouWillLearn,
  generateLanguageList,
  generateLearnerCareerOutcomes,
  generateAndSave,
  seedDatabase,
};
