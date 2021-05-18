/* eslint-disable no-await-in-loop */
const faker = require('faker');
const fs = require('fs');
const stream = require('stream');
const csv = require('fast-csv');
const util = require('util');

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

const generateRecords = async (i, numToGenerate) => {
  if (typeof i !== 'number') {
    throw new Error('i must be of type number');
  } else if (typeof numToGenerate !== 'number') {
    throw new Error('numToGenerate must be of type number');
  }

  let j = i;

  const generate = function g() {
    this.newRecord = {
      course_id: j, // 1 - n
      // Random number between 0 and 10 million
      recent_views: Math.floor(Math.random() * 10000000),
      description: generateFillerText({ paras: 4 }),
      learner_career_outcomes: generateLearnerCareerOutcomes().splice(0, 1),
      metadata: generateMetadata(),
      what_you_will_learn: generateWhatYouWillLearn(),
      skills_you_will_gain: generateSkillsYouWillGain(),
    };

    if (!this.push(this.newRecord)) {
      generate.call(this);
      return;
    }
  };

  const readStream = new stream.Readable({
    objectMode: true,

    newRecord: null,
    lastRecordID: null,
    async read() {
        generate.call(this);
        console.log(`Creating record ${j}`);
      }
    },
  });

  return readStream;
};

const stringifyArrayForPostgres = (arr = []) => {
  let str = '{';

  for (let i = 0; i < arr.length; i++) {
    str += `"${encodeURIComponent(JSON.stringify(arr[i]))}"`;

    if (i !== arr.length - 1) {
      str += ',';
    }
  }

  str += '}';

  return str;
};

const stringifyObjectArrays = (obj = {}) => {
  const objCopy = Object.assign(obj);

  let keys = Object.keys(objCopy);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // nested arrays will be JSON.stringified
    if (Array.isArray(objCopy[key])) {
      if (key === 'learner_career_outcomes'
        || key === 'metadata') {
        objCopy[key] = stringifyArrayForPostgres(objCopy);
      }
    }
  }

  keys = null;

  return objCopy;
};

const isFileEmpty = async (filepath = '') => (
  new Promise((resolve) => {
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

const ArraysToJSON = function toJSON(options = {}) {
  stream.Transform.call(this, options);

  this._readableState.objectMode = true;
  this._writableState.objectMode = true;

  return this;
};

util.inherits(ArraysToJSON, stream.Transform);

ArraysToJSON.prototype._transform = function transform(chunk, enc, cb) {
  this.push(stringifyObjectArrays(chunk));

  cb();
};

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

  const csvStream = csv.format({
    writeHeaders,
    headers: true,
  });

  const fsStream = fs.createWriteStream(outputPath, { flags: 'a' });

  csvStream.pipe(fsStream);

  generateRecords(n, numToGenerate, (recordStream) => {
    const arraysToJSON = new ArraysToJSON();

    recordStream.pipe(arraysToJSON).pipe(csvStream);
  });
};

const seedDatabase = async (client) => {
  let insertStatement = 'INSERT INTO description';
  insertStatement += '(course_id,recent_views,description, learner_career_outcomes,';
  insertStatement += 'metadata,what_you_will_learn,skills_you_will_gain)';
  insertStatement += ' VALUES($1, $2, $3, $4, $5, $6, $7)';

  const rollback = async (err) => {
    await client.query('ROLLBACK');

    await client.release();
    console.log(err);
    process.exit(1);
  };

  Promise.resolve(() => {
    console.time('Database Seed');

    return client.query('BEGIN');
  })
    .then(() => generateRecords(110001, 2e5))
    .then((recordStream) => {
      recordStream.on('end', () => {
        client.query('COMMIT');
        // console.timeEnd('Database Seed');
      });

      recordStream.on('error', (err) => {
        console.log(`record stream error: ${err}`);
      });

      recordStream.on('data', async (record) => {
        try {
          client.query(insertStatement, [
            record.course_id,
            record.recent_views,
            record.description,
            record.learner_career_outcomes,
            record.metadata,
            record.what_you_will_learn,
            record.skills_you_will_gain,
          ]);

          console.log(`inserted course_id: ${record.course_id}`);
        } catch (err) {
          rollback(`insert into db failed: ${err}`);
        }
      });
    })
    .catch((err) => {
      rollback(`transaction failed: ${err}`);
    });
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
  generateAndSave,
  seedDatabase,
};
