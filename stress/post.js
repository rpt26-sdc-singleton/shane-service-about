const { check, sleep } = require('k6');
const http = require('k6/http');

// const baseURL = process.env.BASE_URL || 'http://localhost:3002/';
const baseURL = 'http://localhost:3002/';
const record = {
  course_id: 1,
  recent_views: 6676565,
  description: 'Machine learning is the science of getting computers to act without being explicitly programmed. In the past decade, machine learning has given us self-driving cars, practical speech recognition, effective web search, and a vastly improved understanding of the human genome. Machine learning is so pervasive today that you probably use it dozens of times a day without knowing it. Many researchers also think it is the best way to make progress towards human-level AI. In this class, you will learn about the most effective machine learning techniques, and gain practice implementing them and getting them to work for yourself. More importantly, you\'ll learn about not only the theoretical underpinnings of learning, but also gain the practical know-how needed to quickly and powerfully apply these techniques to new problems. Finally, you\'ll learn about some of Silicon Valley\'s best practices in innovation as it pertains to machine learning and AI. \n\nThis course provides a broad introduction to machine learning, datamining, and statistical pattern recognition. Topics include: (i) Supervised learning (parametric/non-parametric algorithms, support vector machines, kernels, neural networks). (ii) Unsupervised learning (clustering, dimensionality reduction, recommender systems, deep learning). (iii) Best practices in machine learning (bias/variance theory; innovation process in machine learning and AI). The course will also draw from numerous case studies and applications, so that you\'ll also learn how to apply learning algorithms to building smart robots (perception, control), text understanding (web search, anti-spam), computer vision, medical informatics, audio, database mining, and other areas.',
  learner_career_outcomes: [
    {
      icon: 'fa-map-signs',
      pct: 0.33,
      outcome: 'started a new career after completing these courses',
    },
    {
      icon: 'fa-briefcase',
      pct: 0.32,
      outcome: 'got a tangible career benefit from this course',
    },
    {
      icon: 'fa-money',
      pct: 0.12,
      outcome: 'got a pay increase or promotion',
    },
  ],
  metadata: [
    {
      icon: 'certificate',
      title: 'Shareable Certificate',
      subtitle: 'Earn a Certificate upon completion',
    },
    {
      icon: 'globe',
      title: '100% online',
      subtitle: 'Start instantly and learn at your own schedule',
    },
    {
      icon: 'calendar',
      title: 'Flexible deadlines',
      subtitle: 'Reset deadlines in accordance to your schedule',
    },
    {
      icon: 'clock',
      title: 'Approx. 60 hours to complete',
      subtitle: '',
    },
    {
      icon: 'speechbubble',
      title: 'English',
      subtitle: 'Subtitles: Arabic, French, Portuguese (European), Chinese (Simplified), Italian, Vietnamese, German, Russian, English, Hebrew, Spanish, Hindi, Japanese',
    },
  ],
  what_you_will_learn: [
    'Identify a subset of data needed from a column or set of columns and write a SQL query to limit to those results.',
    'U​se SQL commands to filter, sort, and summarize data.',
    'Create an analysis table from multiple queries using the UNION operator.',
    'Manipulate strings, dates, & numeric data using functions to integrate data from different sources into fields with the correct format for analysis.',
  ],
  skills_you_will_gain: [
    'Logistic Regression',
    'Artificial Neural Network',
    'Machine Learning (ML) Algorithms',
    'Machine Learning',
  ],
};

export const options = {
  vus: 1000,
  duration: '60s',
  thresholds: {
    // http_req_duration: ['p(95)<2000'],
  },
};

export default () => {
  const result = http.post(`${baseURL}api/about/new`, {
    body: JSON.stringify(record),
    headers: {
      'Content-Type': 'application/json',
    },
  }, {
    tags: {
      name: 'service-post-endpoint',
    },
  });

  check(result, {
    '201 status code': (res) => res.status === 201,
  });

  sleep(1);
};
