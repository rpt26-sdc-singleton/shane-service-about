/* eslint-disable no-await-in-loop */
const faker = require('faker');
const fs = require('fs');
const csv = require('fast-csv');

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

const generateRecords = (i, numToGenerate, onDataFill = () => {}) => {
  if (typeof i !== 'number') {
    throw new Error('i must be of type number');
  } else if (typeof numToGenerate !== 'number') {
    throw new Error('numToGenerate must be of type number');
  }

  for (let j = i; j <= numToGenerate; j++) {
    console.log(`Creating record ${j}`);
    process.nextTick(() => {
      onDataFill({
        course_id: j, // 1 - n
        // Random number between 0 and 10 million
        recent_views: Math.floor(Math.random() * 10000000),
        description: generateFillerText({ paras: 4 }),
        learner_career_outcomes: generateLearnerCareerOutcomes().splice(0, 1),
        metadata: generateMetadata(),
        what_you_will_learn: generateWhatYouWillLearn(),
        skills_you_will_gain: generateSkillsYouWillGain(),
      });
    });
  }
};

const stringifyObjectArrays = (obj = {}) => {
  const objCopy = Object.assign(obj);

  let keys = Object.keys(objCopy);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // nested arrays will be JSON.stringified
    if (Array.isArray(objCopy[key])) {
      let str = '{';

      for (let j = 0; j < objCopy[key].length; j++) {
        str += `"${encodeURIComponent(JSON.stringify(objCopy[key][j]))}"`;

        if (j !== objCopy[key].length - 1) {
          str += ',';
        }
      }

      str += '}';

      objCopy[key] = str;
    }
  }

  keys = null;

  return objCopy;
};

const isFileEmpty = async (filepath = '') => (
  new Promise ((resolve) => {
    fs.stat(filepath, (err, stats) => {
      if (err) {
        resolve(true);
      } else {
        console.log(stats.size);
        resolve(stats.size === 0);
      }
    });
  })
);

// generateAndSave saves to .csv
const generateAndSave = async (n, numToGenerate, outputPath) => {
  if (outputPath.slice(-4) !== '.csv') {
    throw new Error('output path must include ".csv"');
  }

  let writeHeaders = false;

  // do not write headers if file is not empty
  const isEmpty = await isFileEmpty(outputPath);
  if (isEmpty) {
    writeHeaders = true;
  }

  const stream = csv.format({
    writeHeaders,
    headers: true,
  });

  const fsStream = fs.createWriteStream(outputPath, { flags: 'a' });

  stream.pipe(fsStream);

  stream.on('error', (err) => console.log(`write stream error: ${err}`));
  stream.on('finish', () => console.log('finished writing to stream'));

  let initDrain = false;

  await generateRecords(n, numToGenerate, async (record) => {
    const recordCopy = stringifyObjectArrays(record);

    if (!stream.write(recordCopy)) {
      await new Promise((resolve) => {
        if (initDrain) {
          resolve();
          return;
        }

        initDrain = true;

        stream.once('drain', () => {
          stream.removeAllListeners('drain');
          initDrain = false;
          resolve();
        });
      });
    }
  });
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

// const seedPostgres = async () => {

// };

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
  generateAndSave,
  seedDatabase,
};
